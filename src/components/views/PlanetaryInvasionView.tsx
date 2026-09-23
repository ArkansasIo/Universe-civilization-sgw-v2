import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Swords,
  Shield,
  Zap,
  Crosshair,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  Radio,
  Building,
  Coins,
  Crown,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  RefreshCw,
  Skull,
  Cross,
  Anchor,
  Activity,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources, PlayerProfile } from '../../types';
import {
  GalacticPlanet,
  ConqueredPlanetRecord,
  generateProceduralPlanet,
  INITIAL_CONQUERED_PLANETS,
  QUICK_JUMP_SECTORS,
  PlanetInfrastructure,
} from '../../galacticConquestData';

interface PlanetaryInvasionViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  profile?: PlayerProfile;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

type ConquestTab = 'browser' | 'combat' | 'dominion' | 'infrastructure';

export const PlanetaryInvasionView: React.FC<PlanetaryInvasionViewProps> = ({
  resources,
  onUpdateResources,
  profile,
  onUpdateProfile,
}) => {
  // Stored conquered planets (Map of ID -> ConqueredPlanetRecord)
  const [conqueredMap, setConqueredMap] = useState<Record<number, ConqueredPlanetRecord>>(() => {
    try {
      const saved = localStorage.getItem('uc_conquered_planets_999k');
      return saved ? JSON.parse(saved) : INITIAL_CONQUERED_PLANETS;
    } catch {
      return INITIAL_CONQUERED_PLANETS;
    }
  });

  // Stored Bookmarked Planets
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('uc_bookmarked_planets_999k');
      return saved ? JSON.parse(saved) : [1, 10, 2500, 50000];
    } catch {
      return [1, 10, 2500, 50000];
    }
  });

  // Active Selected Planet ID (1 to 999,999)
  const [currentPlanetId, setCurrentPlanetId] = useState<number>(10);
  const [dialInput, setDialInput] = useState<string>('10');
  const [activeTab, setActiveTab] = useState<ConquestTab>('browser');

  // Combat Inputs & Status
  const [deployedTroops, setDeployedTroops] = useState<string>('30000');
  const [tacticalFeedback, setTacticalFeedback] = useState<{
    type: 'success' | 'danger' | 'info';
    title: string;
    details: string;
  } | null>(null);

  // Softened defense multiplier for current planet session (from orbital strikes / infiltration)
  const [defenseDebuffPct, setDefenseDebuffPct] = useState<number>(0);

  // Save to localStorage when conqueredMap updates
  useEffect(() => {
    try {
      localStorage.setItem('uc_conquered_planets_999k', JSON.stringify(conqueredMap));
    } catch (e) {
      console.error('Failed to persist conquered planets:', e);
    }
  }, [conqueredMap]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('uc_bookmarked_planets_999k', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to persist bookmarks:', e);
    }
  }, [bookmarks]);

  // Procedurally generate active planet
  const activePlanet: GalacticPlanet = useMemo(() => {
    return generateProceduralPlanet(currentPlanetId);
  }, [currentPlanetId]);

  const isConquered = !!conqueredMap[activePlanet.id];
  const conqueredRecord = conqueredMap[activePlanet.id];
  const isBookmarked = bookmarks.includes(activePlanet.id);

  // Calculate total empire statistics across all conquered worlds
  const empireStats = useMemo(() => {
    const conqueredList = Object.values(conqueredMap);
    let totalNaquadahRate = 0;
    let totalMetalRate = 0;
    let totalCrystalRate = 0;
    let totalDeuteriumRate = 0;
    let totalPendingNaquadah = 0;
    let totalPendingMetal = 0;
    let totalPendingCrystal = 0;
    let totalPendingDeuterium = 0;
    let totalPendingGlory = 0;

    conqueredList.forEach((c) => {
      const p = generateProceduralPlanet(c.id);
      const refineryMultiplier = 1 + (c.infrastructure.refineryLevel || 0) * 0.2;
      const tapMultiplier = 1 + (c.infrastructure.geothermalTapLevel || 0) * 0.15;
      const taxMultiplier = c.taxPolicy === 'extractive' ? 1.3 : c.taxPolicy === 'subsidized' ? 0.7 : 1.0;

      const nq = Math.round(p.yield.naquadahPerHour * refineryMultiplier * taxMultiplier);
      const met = Math.round(p.yield.metalPerHour * tapMultiplier * taxMultiplier);
      const cry = Math.round(p.yield.crystalPerHour * tapMultiplier * taxMultiplier);
      const deut = Math.round(p.yield.deuteriumPerHour * tapMultiplier * taxMultiplier);

      totalNaquadahRate += nq;
      totalMetalRate += met;
      totalCrystalRate += cry;
      totalDeuteriumRate += deut;

      // Accumulated pending tribute
      totalPendingNaquadah += c.accumulatedTribute.naquadah;
      totalPendingMetal += c.accumulatedTribute.metal;
      totalPendingCrystal += c.accumulatedTribute.crystal;
      totalPendingDeuterium += c.accumulatedTribute.deuterium;
      totalPendingGlory += c.accumulatedTribute.glory;
    });

    return {
      count: conqueredList.length,
      totalNaquadahRate,
      totalMetalRate,
      totalCrystalRate,
      totalDeuteriumRate,
      totalPendingNaquadah,
      totalPendingMetal,
      totalPendingCrystal,
      totalPendingDeuterium,
      totalPendingGlory,
    };
  }, [conqueredMap]);

  // Jump to specific planet number
  const handleDialPlanet = (targetId: number) => {
    const validId = Math.max(1, Math.min(999999, Math.floor(targetId)));
    setCurrentPlanetId(validId);
    setDialInput(validId.toString());
    setDefenseDebuffPct(0);
    sound.play('click');
  };

  // Dial Stargate input submit
  const handleDialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(dialInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 999999) {
      handleDialPlanet(parsed);
      sound.play('stargate_dial');
    } else {
      sound.play('warning');
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: number) => {
    sound.play('click');
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Ground Assault Operation
  const handleGroundInvasion = () => {
    if (isConquered) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'info',
        title: 'Already Conquered',
        details: `${activePlanet.name} is already under your sovereign imperial dominion!`,
      });
      return;
    }

    const troops = parseInt(deployedTroops, 10);
    if (isNaN(troops) || troops <= 0) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Invalid Force Deployment',
        details: 'Specify a valid count of assault infantry battalions.',
      });
      return;
    }

    if (troops > resources.attackUnits) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Attack Infantry',
        details: `Requested ${troops.toLocaleString()} troops, but your empire only commands ${resources.attackUnits.toLocaleString()} attack units.`,
      });
      return;
    }

    if (resources.attackTurns < 10) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Stargate Turns',
        details: 'Ground planetary invasion requires at least 10 Stargate Attack Turns.',
      });
      return;
    }

    // Effective defender strength considering debuffs
    const effectiveDefense = Math.round(activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100));
    const playerInvasionPower = Math.round(troops * 1.85);

    if (playerInvasionPower >= effectiveDefense) {
      // VICTORY!
      const casualtyPct = Math.max(0.04, Math.min(0.25, (effectiveDefense / playerInvasionPower) * 0.15));
      const casualties = Math.max(1, Math.round(troops * casualtyPct));

      sound.play('confirm');

      // Update Resources
      onUpdateResources({
        attackTurns: Math.max(0, resources.attackTurns - 10),
        attackUnits: Math.max(0, resources.attackUnits - casualties),
        naquadah: resources.naquadah + activePlanet.yield.plunderNaquadah,
        metal: (resources.metal || 0) + activePlanet.yield.plunderMetal,
        crystal: (resources.crystal || 0) + activePlanet.yield.plunderCrystal,
      });

      if (profile && onUpdateProfile) {
        onUpdateProfile({
          glory: (profile.glory || 0) + activePlanet.yield.gloryReward,
        });
      }

      // Add to Conquered Record
      const newRecord: ConqueredPlanetRecord = {
        id: activePlanet.id,
        conqueredTimestamp: Date.now(),
        customName: activePlanet.name,
        infrastructure: {
          refineryLevel: 1,
          shieldGridLevel: 1,
          garrisonCitadelLevel: 1,
          orbitalDrydockLevel: 0,
          geothermalTapLevel: 1,
          stargateNexusLevel: 1,
        },
        stationedGarrison: Math.round(troops * 0.2),
        taxPolicy: 'balanced',
        accumulatedTribute: {
          naquadah: Math.round(activePlanet.yield.naquadahPerHour * 2),
          metal: Math.round(activePlanet.yield.metalPerHour * 2),
          crystal: Math.round(activePlanet.yield.crystalPerHour * 2),
          deuterium: Math.round(activePlanet.yield.deuteriumPerHour * 2),
          glory: 15,
        },
        lastCollectedAt: Date.now(),
      };

      setConqueredMap((prev) => ({ ...prev, [activePlanet.id]: newRecord }));
      setDefenseDebuffPct(0);

      setTacticalFeedback({
        type: 'success',
        title: `VICTORY! ${activePlanet.name} HAS BEEN CONQUERED!`,
        details: `Your ground forces crushed the ${activePlanet.rulingFaction} garrison (${playerInvasionPower.toLocaleString()} vs ${effectiveDefense.toLocaleString()} Defense). Plundered ${activePlanet.yield.plunderNaquadah.toLocaleString()} NQ, ${activePlanet.yield.plunderMetal.toLocaleString()} Metal, ${activePlanet.yield.plunderCrystal.toLocaleString()} Crystal, and +${activePlanet.yield.gloryReward} Glory XP! Suffered ${casualties.toLocaleString()} heroic casualties.`,
      });
    } else {
      // DEFEAT
      const casualties = Math.max(10, Math.round(troops * 0.35));
      sound.play('warning');

      onUpdateResources({
        attackTurns: Math.max(0, resources.attackTurns - 10),
        attackUnits: Math.max(0, resources.attackUnits - casualties),
      });

      setTacticalFeedback({
        type: 'danger',
        title: `INVASION FORCE REPUDIATED AT ${activePlanet.name}`,
        details: `The garrison commanded by ${activePlanet.garrison.commanderTitle} held the defensive line (${playerInvasionPower.toLocaleString()} assault power vs ${effectiveDefense.toLocaleString()} planetary armor). Lost ${casualties.toLocaleString()} assault units in the dropship landing corridor.`,
      });
    }
  };

  // Precision Orbital Bombardment
  const handleOrbitalBombardment = () => {
    if (isConquered) return;
    if (resources.attackTurns < 5) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Turns',
        details: 'Orbital bombardment barrage requires 5 Stargate Attack Turns.',
      });
      return;
    }

    if ((resources.deuterium || 0) < 5000) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Deuterium',
        details: 'Orbital heavy lance plasma barrage requires 5,000 Deuterium fuel.',
      });
      return;
    }

    sound.play('explosion');
    const debuffIncrease = 25;
    const newDebuff = Math.min(75, defenseDebuffPct + debuffIncrease);
    setDefenseDebuffPct(newDebuff);

    onUpdateResources({
      attackTurns: resources.attackTurns - 5,
      deuterium: Math.max(0, (resources.deuterium || 0) - 5000),
    });

    setTacticalFeedback({
      type: 'info',
      title: 'ORBITAL BARRAGE COMPLETE',
      details: `Heavy flagship lances bombarded ${activePlanet.name}'s surface shields. Enemy defensive fortification rating reduced by ${newDebuff}%!`,
    });
  };

  // Covert Infiltration Sabotage
  const handleCovertInfiltration = () => {
    if (isConquered) return;
    if (resources.attackTurns < 4) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Turns',
        details: 'Covert Stargate Infiltration requires 4 Attack Turns.',
      });
      return;
    }
    if (resources.naquadah < 25000) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Naquadah',
        details: 'Black-ops infiltration gear requires 25,000 Naquadah.',
      });
      return;
    }

    sound.play('warp_pulse');
    const debuffIncrease = 30;
    const newDebuff = Math.min(75, defenseDebuffPct + debuffIncrease);
    setDefenseDebuffPct(newDebuff);

    onUpdateResources({
      attackTurns: resources.attackTurns - 4,
      naquadah: resources.naquadah - 25000,
    });

    setTacticalFeedback({
      type: 'info',
      title: 'STARGATE INFILTRATION SUCCESSFUL',
      details: `Spec-ops cloaked operatives dialed ${activePlanet.name}'s Stargate and detonated the planetary shield sub-station! Total defense debuff now at ${newDebuff}%.`,
    });
  };

  // Diplomatic Annexation / Vassal Treaty
  const handleDiplomaticAnnex = () => {
    if (isConquered) return;
    const gloryCost = activePlanet.tier * 50;
    const naquadahCost = activePlanet.yield.plunderNaquadah * 2;

    if ((profile?.glory || 0) < gloryCost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Glory XP',
        details: `Diplomatic annexation of this ${activePlanet.tierLabel} world requires ${gloryCost} Glory XP.`,
      });
      return;
    }

    if (resources.naquadah < naquadahCost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Diplomatic Tribute',
        details: `Treaty gift requires ${naquadahCost.toLocaleString()} Naquadah.`,
      });
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      naquadah: resources.naquadah - naquadahCost,
    });

    if (profile && onUpdateProfile) {
      onUpdateProfile({
        glory: profile.glory - gloryCost,
      });
    }

    const newRecord: ConqueredPlanetRecord = {
      id: activePlanet.id,
      conqueredTimestamp: Date.now(),
      customName: `${activePlanet.name} (Vassal)`,
      infrastructure: {
        refineryLevel: 1,
        shieldGridLevel: 1,
        garrisonCitadelLevel: 1,
        orbitalDrydockLevel: 0,
        geothermalTapLevel: 1,
        stargateNexusLevel: 1,
      },
      stationedGarrison: 25000,
      taxPolicy: 'balanced',
      accumulatedTribute: {
        naquadah: Math.round(activePlanet.yield.naquadahPerHour),
        metal: Math.round(activePlanet.yield.metalPerHour),
        crystal: Math.round(activePlanet.yield.crystalPerHour),
        deuterium: Math.round(activePlanet.yield.deuteriumPerHour),
        glory: 20,
      },
      lastCollectedAt: Date.now(),
    };

    setConqueredMap((prev) => ({ ...prev, [activePlanet.id]: newRecord }));
    setTacticalFeedback({
      type: 'success',
      title: 'DIPLOMATIC ANNEXATION RATIFIED',
      details: `${activePlanet.name} peacefully signed an Imperial Protectorate Treaty and is now a sovereign colony in your dominion!`,
    });
  };

  // Collect All Imperial Tribute
  const handleCollectAllTribute = () => {
    if (
      empireStats.totalPendingNaquadah === 0 &&
      empireStats.totalPendingMetal === 0 &&
      empireStats.totalPendingCrystal === 0
    ) {
      sound.play('warning');
      return;
    }

    sound.play('trade');
    onUpdateResources({
      naquadah: resources.naquadah + empireStats.totalPendingNaquadah,
      metal: (resources.metal || 0) + empireStats.totalPendingMetal,
      crystal: (resources.crystal || 0) + empireStats.totalPendingCrystal,
      deuterium: (resources.deuterium || 0) + empireStats.totalPendingDeuterium,
    });

    if (profile && onUpdateProfile && empireStats.totalPendingGlory > 0) {
      onUpdateProfile({
        glory: (profile.glory || 0) + empireStats.totalPendingGlory,
      });
    }

    // Reset pending tribute across all conquered planets
    setConqueredMap((prev) => {
      const updated: Record<number, ConqueredPlanetRecord> = {};
      Object.keys(prev).forEach((key) => {
        const numKey = Number(key);
        updated[numKey] = {
          ...prev[numKey],
          accumulatedTribute: {
            naquadah: 0,
            metal: 0,
            crystal: 0,
            deuterium: 0,
            glory: 0,
          },
          lastCollectedAt: Date.now(),
        };
      });
      return updated;
    });

    setTacticalFeedback({
      type: 'success',
      title: 'IMPERIAL TRIBUTE COLLECTED',
      details: `Collected +${empireStats.totalPendingNaquadah.toLocaleString()} NQ, +${empireStats.totalPendingMetal.toLocaleString()} Metal, +${empireStats.totalPendingCrystal.toLocaleString()} Crystal, and +${empireStats.totalPendingGlory} Glory XP from ${empireStats.count} conquered worlds!`,
    });
  };

  // Upgrade Infrastructure Building on Conquered Planet
  const handleUpgradeInfrastructure = (
    buildingKey: keyof PlanetInfrastructure,
    cost: number
  ) => {
    if (!conqueredRecord) return;
    if (resources.naquadah < cost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Funds',
        details: `Upgrade requires ${cost.toLocaleString()} Naquadah.`,
      });
      return;
    }

    sound.play('research');
    onUpdateResources({ naquadah: resources.naquadah - cost });

    const currentLvl = conqueredRecord.infrastructure[buildingKey] || 0;
    setConqueredMap((prev) => ({
      ...prev,
      [activePlanet.id]: {
        ...prev[activePlanet.id],
        infrastructure: {
          ...prev[activePlanet.id].infrastructure,
          [buildingKey]: currentLvl + 1,
        },
      },
    }));

    setTacticalFeedback({
      type: 'success',
      title: 'INFRASTRUCTURE UPGRADED',
      details: `Successfully upgraded ${buildingKey} to Level ${currentLvl + 1} on ${activePlanet.name}.`,
    });
  };

  // Change Tax Policy
  const handleChangeTax = (policy: 'balanced' | 'extractive' | 'subsidized') => {
    if (!conqueredRecord) return;
    sound.play('click');
    setConqueredMap((prev) => ({
      ...prev,
      [activePlanet.id]: {
        ...prev[activePlanet.id],
        taxPolicy: policy,
      },
    }));
  };

  return (
    <div id="planetary-conquest-system-view" className="space-y-6">
      {/* Top Banner & Empire Statistics Bar */}
      <div className="border border-[#dedede] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[2px] uppercase mb-1 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              1 TO 999,999 PROCEDURAL PLANETARY CONQUEST UNIVERSE
            </div>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
              Galactic Empire & Planetary Conquest Nexus
            </h1>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Explore, dial, and conquer across all <strong>999,999 procedural celestial worlds</strong>.
              Launch precision orbital strikes, coordinate ground dropship invasions, construct planetary
              deflector grids, and collect continuous imperial tribute from your conquered dominions.
            </p>
          </div>

          {/* Quick Collect Tribute Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[#888888] uppercase block font-semibold">
                Dominion Vault Yield
              </span>
              <span className="font-mono text-sm font-bold text-amber-600">
                +{empireStats.totalPendingNaquadah.toLocaleString()} NQ
              </span>
            </div>
            <button
              onClick={handleCollectAllTribute}
              disabled={empireStats.totalPendingNaquadah === 0}
              className="px-4 py-2.5 bg-[#111111] text-white hover:bg-amber-600 disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Collect All Tribute ({empireStats.count} Worlds)
            </button>
          </div>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Conquered Worlds
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-[#111111]">
                {empireStats.count.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#999999]">/ 999,999 Worlds</span>
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Naquadah Tribute Rate
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-amber-600">
                +{empireStats.totalNaquadahRate.toLocaleString()}/hr
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Metal & Crystal Tribute
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-blue-600">
                +{(empireStats.totalMetalRate + empireStats.totalCrystalRate).toLocaleString()}/hr
              </span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Empire Attack Forces
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-emerald-600">
                {resources.attackUnits.toLocaleString()} Troops
              </span>
              <span className="text-[10px] text-[#666666]">{resources.attackTurns} Turns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#dedede] pb-2">
        <button
          onClick={() => { sound.play('click'); setActiveTab('browser'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'browser'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Compass className="w-4 h-4" />
          1. Stargate Dial & Orbital Browser (1-999,999)
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('combat'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'combat'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Swords className="w-4 h-4" />
          2. Ground Assault & Combat Station
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('dominion'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'dominion'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Crown className="w-4 h-4" />
          3. Imperial Dominion Registry ({empireStats.count})
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('infrastructure'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'infrastructure'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Building className="w-4 h-4" />
          4. Planetary Infrastructure & Garrisons
        </button>
      </div>

      {/* Feedback Banner */}
      {tacticalFeedback && (
        <div
          className={`p-4 border text-xs flex items-start justify-between gap-3 shadow-sm ${
            tacticalFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 border-l-4'
              : tacticalFeedback.type === 'danger'
              ? 'bg-rose-50 border-rose-400 text-rose-950 border-l-4'
              : 'bg-blue-50 border-blue-400 text-blue-950 border-l-4'
          }`}
        >
          <div>
            <div className="font-bold uppercase tracking-wider mb-0.5">
              {tacticalFeedback.title}
            </div>
            <p className="leading-relaxed">{tacticalFeedback.details}</p>
          </div>
          <button
            onClick={() => setTacticalFeedback(null)}
            className="p-1 hover:bg-black/10 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================== TAB 1: STARGATE DIAL & PLANETARY BROWSER ===================== */}
      {activeTab === 'browser' && (
        <div className="space-y-6">
          {/* Stargate Dialing Bar */}
          <div className="border border-[#dedede] bg-white p-5">
            <div className="text-[10px] font-bold text-[#777777] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-600" />
              Subspace Stargate Coordinates Console (Input Planet # 1 to 999,999)
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Previous / Next Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDialPlanet(currentPlanetId - 1)}
                  disabled={currentPlanetId <= 1}
                  className="p-2 border border-[#dedede] hover:bg-[#f0f0f0] disabled:opacity-40 cursor-pointer"
                  title="Previous Planet"
                >
                  <ChevronLeft className="w-5 h-5 text-[#333333]" />
                </button>
                <button
                  onClick={() => handleDialPlanet(currentPlanetId + 1)}
                  disabled={currentPlanetId >= 999999}
                  className="p-2 border border-[#dedede] hover:bg-[#f0f0f0] disabled:opacity-40 cursor-pointer"
                  title="Next Planet"
                >
                  <ChevronRight className="w-5 h-5 text-[#333333]" />
                </button>
              </div>

              {/* Direct Input Form */}
              <form onSubmit={handleDialSubmit} className="flex-1 flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#888888]">
                    PLANET #
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={999999}
                    value={dialInput}
                    onChange={(e) => setDialInput(e.target.value)}
                    className="w-full pl-24 pr-4 py-2 border border-[#dedede] text-sm font-mono font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="Enter 1 - 999999"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] cursor-pointer"
                >
                  Dial Coordinate
                </button>
              </form>

              {/* Random Scout & Bookmark */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * 999999) + 1;
                    handleDialPlanet(rnd);
                    sound.play('stargate_dial');
                  }}
                  className="px-3 py-2 bg-[#fafafa] border border-[#dedede] hover:bg-[#eee] text-xs font-bold text-[#333] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Random Scout
                </button>

                <button
                  onClick={() => handleToggleBookmark(activePlanet.id)}
                  className={`p-2 border border-[#dedede] text-xs font-bold cursor-pointer ${
                    isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-white text-[#555]'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Bookmark Planet'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Jumps Row */}
            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] text-[#777777] font-bold uppercase mr-2">Sector Jumps:</span>
              {QUICK_JUMP_SECTORS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleDialPlanet(sec.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono border transition-colors cursor-pointer ${
                    currentPlanetId === sec.id
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#fcfcfc] text-[#555555] border-[#e2e2e2] hover:bg-[#f0f0f0]'
                  }`}
                >
                  #{sec.id.toLocaleString()} {sec.label.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Planet Tactical Inspection Card */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-[#eeeeee] pb-6 mb-6">
              {/* Left Column: Visual & Header */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none border-2 border-[#111111] bg-gradient-to-br from-[#18181b] via-[#09090b] to-[#1e1b4b] flex flex-col items-center justify-center text-center p-2 shrink-0 shadow-md relative overflow-hidden">
                  <span className="text-3xl sm:text-4xl mb-1">{activePlanet.biomeIcon}</span>
                  <span className="text-[9px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                    {activePlanet.coordinate}
                  </span>
                  {isConquered && (
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-1 py-0.5">
                      CONQUERED
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                      PLANET #{activePlanet.id.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      {activePlanet.tierLabel}
                    </span>
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: activePlanet.factionColor }}
                    >
                      {activePlanet.rulingFaction}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                    {activePlanet.name}
                  </h2>
                  <p className="text-xs text-[#666666] leading-relaxed max-w-xl">
                    {activePlanet.flavorLore}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                {!isConquered ? (
                  <button
                    onClick={() => { sound.play('click'); setActiveTab('combat'); }}
                    className="px-5 py-3 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Swords className="w-4 h-4" />
                    Launch Invasion
                  </button>
                ) : (
                  <button
                    onClick={() => { sound.play('click'); setActiveTab('infrastructure'); }}
                    className="px-5 py-3 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Building className="w-4 h-4" />
                    Manage Infrastructure
                  </button>
                )}
              </div>
            </div>

            {/* Planet Attributes & Garrison Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Physical Parameters */}
              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Planetary Biome & Environment
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Classification:</span>
                  <b className="text-[#111]">{activePlanet.biome}</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Core Diameter:</span>
                  <b className="font-mono text-[#111]">{activePlanet.diameterKm.toLocaleString()} km</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Surface Temperature:</span>
                  <b className="font-mono text-[#111]">{activePlanet.temperatureCelsius}°C</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Surface Gravity:</span>
                  <b className="font-mono text-[#111]">{activePlanet.gravityG} G</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Building Grid Fields:</span>
                  <b className="font-mono text-[#111]">{activePlanet.surfaceFields} Fields</b>
                </div>
              </div>

              {/* Garrison & Defenses */}
              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  Garrison & Fortifications
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Commander:</span>
                  <b className="text-[#111]">{activePlanet.garrison.commanderTitle}</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Defense Rating:</span>
                  <b className="font-mono text-rose-600 font-bold">
                    {Math.round(activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100)).toLocaleString()} pts
                    {defenseDebuffPct > 0 && ` (-${defenseDebuffPct}%)`}
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Infantry Garrison:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.infantryTroops.toLocaleString()} troops</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Heavy Armor Tanks:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.heavyArmorVehicles.toLocaleString()} tanks</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Orbital Batteries:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.orbitalDefenseBatteries} cannons</b>
                </div>
              </div>

              {/* Resource Yield & Plunder */}
              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  Resource Extraction & Plunder
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Naquadah Yield:</span>
                  <b className="font-mono text-amber-600">+{activePlanet.yield.naquadahPerHour.toLocaleString()}/hr</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Metal & Crystal:</span>
                  <b className="font-mono text-[#111]">
                    +{(activePlanet.yield.metalPerHour + activePlanet.yield.crystalPerHour).toLocaleString()}/hr
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Plunder Spoils:</span>
                  <b className="font-mono text-emerald-600">
                    +{activePlanet.yield.plunderNaquadah.toLocaleString()} NQ
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Conquest Glory:</span>
                  <b className="font-mono text-purple-600">+{activePlanet.yield.gloryReward} Glory XP</b>
                </div>
              </div>
            </div>

            {/* Strategic Traits & Stargate Address */}
            <div className="mt-6 pt-4 border-t border-[#eeeeee] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase block mb-1.5">
                  Strategic Traits & Modifiers
                </span>
                <div className="space-y-1.5">
                  {activePlanet.strategicTraits.map((t, i) => (
                    <div key={i} className="p-2 bg-[#f6f6f6] border border-[#e8e8e8] flex items-center justify-between">
                      <div>
                        <b className="text-[#111] block">{t.name}</b>
                        <span className="text-[11px] text-[#666]">{t.description}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold whitespace-nowrap">
                        {t.effectBonus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase block mb-1.5">
                  Stargate 7-Chevron DHD Address
                </span>
                <div className="p-3 bg-[#111111] text-white font-mono text-[11px] space-y-1">
                  <div className="text-amber-400 font-bold text-[10px] uppercase">
                    GLYPH SEQUENCE ACTIVE
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {activePlanet.stargateGlyphs.map((glyph, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#222222] border border-[#444444] text-cyan-300"
                      >
                        [{i + 1}] {glyph}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: GROUND ASSAULT & COMBAT STATION ===================== */}
      {activeTab === 'combat' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  COMBAT ENGAGEMENT THEATER
                </span>
                <h2 className="text-xl font-bold text-[#111111]">
                  Assault Operations on {activePlanet.name} (Planet #{activePlanet.id.toLocaleString()})
                </h2>
              </div>
              <span
                className="px-3 py-1 text-xs font-bold text-white uppercase"
                style={{ backgroundColor: activePlanet.factionColor }}
              >
                Defending: {activePlanet.rulingFaction}
              </span>
            </div>

            {/* Preparation Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Option 1: Orbital Bombardment */}
              <div className="p-4 border border-[#dedede] bg-[#fafafa] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <h3 className="font-bold text-xs uppercase text-[#111]">1. Orbital Heavy Lance Strike</h3>
                  </div>
                  <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                    Fire spinal flagship lances from orbit to vaporize surface defenses and reduce enemy garrison strength by 25%.
                  </p>
                </div>
                <div className="border-t border-[#e8e8e8] pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888]">Cost: 5 Turns & 5k Deuterium</span>
                  <button
                    onClick={handleOrbitalBombardment}
                    disabled={isConquered}
                    className="px-3 py-1.5 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-orange-700 disabled:opacity-40 cursor-pointer"
                  >
                    Fire Lance
                  </button>
                </div>
              </div>

              {/* Option 2: Stargate Covert Infiltration */}
              <div className="p-4 border border-[#dedede] bg-[#fafafa] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crosshair className="w-4 h-4 text-cyan-600" />
                    <h3 className="font-bold text-xs uppercase text-[#111]">2. Stargate Black-Ops Sabotage</h3>
                  </div>
                  <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                    Infiltrate through the Stargate with stealth cloaked operatives to disable planetary shield generators (-30% Defense).
                  </p>
                </div>
                <div className="border-t border-[#e8e8e8] pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888]">Cost: 4 Turns & 25k NQ</span>
                  <button
                    onClick={handleCovertInfiltration}
                    disabled={isConquered}
                    className="px-3 py-1.5 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-cyan-700 disabled:opacity-40 cursor-pointer"
                  >
                    Infiltrate
                  </button>
                </div>
              </div>

              {/* Option 3: Diplomatic Annexation */}
              <div className="p-4 border border-[#dedede] bg-[#fafafa] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-xs uppercase text-[#111]">3. Diplomatic Annexation</h3>
                  </div>
                  <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                    Offer generous imperial protectorate status and annex the world peacefully without troop casualties.
                  </p>
                </div>
                <div className="border-t border-[#e8e8e8] pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888]">
                    Cost: {activePlanet.tier * 50} Glory XP & {activePlanet.yield.plunderNaquadah.toLocaleString()} NQ
                  </span>
                  <button
                    onClick={handleDiplomaticAnnex}
                    disabled={isConquered}
                    className="px-3 py-1.5 bg-purple-700 text-white text-[11px] font-bold uppercase hover:bg-purple-800 disabled:opacity-40 cursor-pointer"
                  >
                    Annex World
                  </button>
                </div>
              </div>
            </div>

            {/* Main Ground Assault Form */}
            <div className="p-5 border-2 border-[#111111] bg-[#fafafa]">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111]">
                  Primary Ground Dropship Assault Operation
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mb-4">
                <div>
                  <label className="text-[11px] font-bold text-[#555] uppercase block mb-1">
                    Deploy Attack Infantry Battalions:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={deployedTroops}
                      onChange={(e) => setDeployedTroops(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#dedede] bg-white font-mono font-bold text-sm text-[#111]"
                      placeholder="e.g. 50000"
                    />
                    <button
                      onClick={() => setDeployedTroops(resources.attackUnits.toString())}
                      className="px-3 py-2 bg-[#eeeeee] hover:bg-[#dddddd] font-bold text-xs cursor-pointer"
                    >
                      MAX ({resources.attackUnits.toLocaleString()})
                    </button>
                  </div>
                  <span className="text-[10px] text-[#888] mt-1 block">
                    Available: {resources.attackUnits.toLocaleString()} troops · Requires 10 Attack Turns
                  </span>
                </div>

                {/* Probability Meter */}
                <div className="p-3 bg-white border border-[#dedede] space-y-1">
                  <div className="flex justify-between text-[#666]">
                    <span>Defender Fortification:</span>
                    <b className="font-mono text-rose-600">
                      {Math.round(activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100)).toLocaleString()} pts
                    </b>
                  </div>
                  <div className="flex justify-between text-[#666]">
                    <span>Invasion Assault Power:</span>
                    <b className="font-mono text-emerald-600">
                      {Math.round((parseInt(deployedTroops, 10) || 0) * 1.85).toLocaleString()} pts
                    </b>
                  </div>
                  <div className="flex justify-between text-[#666] border-t border-[#eee] pt-1">
                    <span>Estimated Outcome:</span>
                    <b
                      className={`font-bold ${
                        (parseInt(deployedTroops, 10) || 0) * 1.85 >=
                        activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100)
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {(parseInt(deployedTroops, 10) || 0) * 1.85 >=
                      activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100)
                        ? '★ DECISIVE VICTORY'
                        : '⚠️ HIGH RISK OF CASUALTIES'}
                    </b>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGroundInvasion}
                disabled={isConquered}
                className="w-full py-3 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Swords className="w-4 h-4" />
                Execute Planetary Ground Assault (10 Turns)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: IMPERIAL DOMINION REGISTRY ===================== */}
      {activeTab === 'dominion' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  IMPERIAL DOMINION REGISTRY
                </span>
                <h2 className="text-xl font-bold text-[#111111]">
                  All Sovereign Conquered Worlds ({empireStats.count} Colonies)
                </h2>
              </div>
              <button
                onClick={handleCollectAllTribute}
                disabled={empireStats.totalPendingNaquadah === 0}
                className="px-4 py-2 bg-[#111111] text-white hover:bg-amber-600 disabled:opacity-40 text-xs font-bold uppercase cursor-pointer"
              >
                Collect Tribute (+{empireStats.totalPendingNaquadah.toLocaleString()} NQ)
              </button>
            </div>

            {/* List of Conquered Worlds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Object.values(conqueredMap).map((record) => {
                const planet = generateProceduralPlanet(record.id);
                return (
                  <div
                    key={record.id}
                    className="p-4 border border-[#dedede] bg-[#fafafa] flex flex-col justify-between hover:border-[#111111] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-2 mb-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#777]">
                            Planet #{record.id.toLocaleString()} · {planet.coordinate}
                          </span>
                          <h3 className="font-bold text-sm text-[#111]">
                            {record.customName || planet.name}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                          Tier {planet.tier}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3 text-[#555]">
                        <div className="flex justify-between">
                          <span>Biome:</span>
                          <b className="text-[#111]">{planet.biome}</b>
                        </div>
                        <div className="flex justify-between">
                          <span>Naquadah Rate:</span>
                          <b className="font-mono text-amber-600">
                            +{planet.yield.naquadahPerHour.toLocaleString()}/hr
                          </b>
                        </div>
                        <div className="flex justify-between">
                          <span>Garrison Stationed:</span>
                          <b className="font-mono text-[#111]">
                            {record.stationedGarrison.toLocaleString()} troops
                          </b>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-[#888]">
                        Tax Policy: <b className="capitalize text-[#111]">{record.taxPolicy}</b>
                      </span>
                      <button
                        onClick={() => {
                          handleDialPlanet(record.id);
                          setActiveTab('infrastructure');
                        }}
                        className="px-3 py-1.5 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-[#333] cursor-pointer"
                      >
                        Manage Colony
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: PLANETARY INFRASTRUCTURE & GARRISONS ===================== */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  COLONIAL INFRASTRUCTURE & MANTLE ENGINEERING
                </span>
                <h2 className="text-xl font-bold text-[#111111]">
                  Infrastructure Matrix: {activePlanet.name} (Planet #{activePlanet.id.toLocaleString()})
                </h2>
              </div>
              {isConquered ? (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold uppercase">
                  ✓ SOVEREIGN DOMINION
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase">
                  ⚠️ NOT YET CONQUERED
                </span>
              )}
            </div>

            {!isConquered ? (
              <div className="p-8 text-center bg-[#fafafa] border border-[#dedede] space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-sm text-[#111]">This world is not under your empire's control!</h3>
                <p className="text-xs text-[#666] max-w-md mx-auto">
                  Launch a ground invasion or diplomatic annexation in the Combat Station to claim this planet and construct colonial infrastructure.
                </p>
                <button
                  onClick={() => { sound.play('click'); setActiveTab('combat'); }}
                  className="px-5 py-2.5 bg-[#111] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Go to Combat Station
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tax Policy Selector */}
                <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <b className="text-[#111] uppercase block">Empire Colonial Tax Directive</b>
                    <span className="text-[#666]">Adjust resource exploitation and tribute yields.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['balanced', 'extractive', 'subsidized'] as const).map((policy) => (
                      <button
                        key={policy}
                        onClick={() => handleChangeTax(policy)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                          conqueredRecord?.taxPolicy === policy
                            ? 'bg-[#111] text-white'
                            : 'bg-white text-[#555] border border-[#dedede] hover:bg-[#eee]'
                        }`}
                      >
                        {policy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6 Building Upgrades Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* 1. Naquadah Core Refinery */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.refineryLevel || 0;
                    const cost = (lvl + 1) * 35000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Naquadah Core Refinery</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Increases hourly Naquadah extraction rate from this world by +20% per level.
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('refineryLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-amber-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}

                  {/* 2. Planetary Shield Grid */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.shieldGridLevel || 0;
                    const cost = (lvl + 1) * 45000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Planetary Shield Grid</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Enhances orbital deflector field buffer, defending against enemy counter-raids.
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('shieldGridLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-blue-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}

                  {/* 3. Garrison Citadel */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.garrisonCitadelLevel || 0;
                    const cost = (lvl + 1) * 30000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Garrison Citadel Barracks</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Expands ground garrison barracks and recruits local colonial defense battalions.
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('garrisonCitadelLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-emerald-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}

                  {/* 4. Orbital Shipyard Drydock */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.orbitalDrydockLevel || 0;
                    const cost = (lvl + 1) * 60000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Orbital Shipyard Drydock</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Constructs local defense corvettes and accelerates fleet repair turnaround times.
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('orbitalDrydockLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-purple-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}

                  {/* 5. Deep Geothermal Tap */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.geothermalTapLevel || 0;
                    const cost = (lvl + 1) * 28000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Deep Mantle Core Tap</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Extracts heavy magma metals and crystalline silicates (+15% Metal/Crystal tribute).
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('geothermalTapLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-orange-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}

                  {/* 6. Stargate Supergate Terminal */}
                  {(() => {
                    const lvl = conqueredRecord?.infrastructure.stargateNexusLevel || 0;
                    const cost = (lvl + 1) * 50000;
                    return (
                      <div className="p-4 border border-[#dedede] bg-white flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xs uppercase text-[#111]">Stargate Supergate Nexus</h3>
                            <span className="px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold">
                              Lv {lvl}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666] leading-relaxed mb-3">
                            Connects to the galactic macro-gate network, generating +2 Attack Turns per turn cycle.
                          </p>
                        </div>
                        <button
                          onClick={() => handleUpgradeInfrastructure('stargateNexusLevel', cost)}
                          className="w-full py-2 bg-[#111] text-white text-[11px] font-bold uppercase hover:bg-cyan-600 cursor-pointer"
                        >
                          Upgrade ({cost.toLocaleString()} NQ)
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
