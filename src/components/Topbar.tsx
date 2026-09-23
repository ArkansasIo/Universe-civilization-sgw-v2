import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  Sparkles,
  User,
  RefreshCw,
  Cpu,
  Database,
  Shield,
  Zap,
  Clock,
  Globe,
  FastForward,
  Play,
  Pause,
  AlertTriangle,
  Info,
  ChevronDown,
  Layers,
  Droplet,
  Gem,
  Coins,
  Radio,
  ExternalLink,
  Crown,
  Check,
  Building,
  Flame,
  Sliders,
  Rocket,
  Wheat,
  Users,
  AlertOctagon,
  TrendingDown,
  Activity,
  CreditCard,
} from 'lucide-react';
import { sound } from '../sound';
import { PlayerProfile, PlayerResources, PlanetColony } from '../types';

interface TopbarProps {
  activeRoute: string;
  profile: PlayerProfile;
  resources: PlayerResources;
  planets?: PlanetColony[];
  activePlanetId?: string;
  onSelectPlanet?: (planetId: string) => void;
  cronAutoTickEnabled?: boolean;
  nextTickSeconds?: number;
  netIncome?: number;
  bankCapacity?: number;
  onProcessTurn: (count?: number) => void;
  onResetGame: () => void;
  onNavigate?: (route: string) => void;
}

const ROUTE_LABELS: Record<string, { section: string; title: string }> = {
  dashboard: { section: 'COMMAND CENTER', title: 'Dashboard Overview' },
  'turn-system': { section: 'COMMAND CENTER', title: 'Empire Turn Engine (6 Turns/Min)' },
  'commander-hq': { section: 'COMMAND CENTER', title: 'Commander HQ, Officers & Doctrines' },
  'player-profile': { section: 'COMMAND CENTER', title: 'Sovereign Player Profile & Realm Dossier' },
  'account-info': { section: 'COMMAND CENTER', title: 'Commander Information' },
  resources: { section: 'COMMAND CENTER', title: 'Naquadah Reserves & Vault' },
  income: { section: 'COMMAND CENTER', title: 'Planetary Income Models' },
  'military-stats': { section: 'COMMAND CENTER', title: 'Military Strength & DefCon' },
  targets: { section: 'ATTACK & COMBAT', title: 'Target Realms' },
  'planetary-invasion': { section: 'ATTACK & COMBAT', title: 'Planetary Invasion & Ground Siege' },
  spy: { section: 'ATTACK & COMBAT', title: 'Covert Reconnaissance' },
  sabotage: { section: 'ATTACK & COMBAT', title: 'Covert Sabotage' },
  'attack-log': { section: 'ATTACK & COMBAT', title: 'Battle Engagements Log' },
  weapons: { section: 'ARMORY ARSENAL', title: 'Weapons Inventory' },
  armors: { section: 'ARMORY ARSENAL', title: 'Armors & Combat Vehicles' },
  shields: { section: 'ARMORY ARSENAL', title: 'Deflector Shields & Barriers' },
  'weapon-market': { section: 'ARMORY ARSENAL', title: 'Arms Exchange' },
  repair: { section: 'ARMORY ARSENAL', title: 'Weapon Repair Facility' },
  universe: { section: 'ORBITAL SHIPYARD', title: 'Universe Galaxy Map' },
  units: { section: 'PERSONNEL & TRAINING', title: 'Troop Training' },
  miners: { section: 'PERSONNEL & TRAINING', title: 'Industrial Workforce' },
  'super-units': { section: 'PERSONNEL & TRAINING', title: 'Elite Super Units' },
  'unit-production': { section: 'PERSONNEL & TRAINING', title: 'Population Generation' },
  'unit-roster-90': { section: 'PERSONNEL & TRAINING', title: '90-Class Unit Roster' },
  'tech-tree': { section: 'TECHNOLOGY ARCHIVE', title: 'Master Technology Tree & Visual Unlock Graph' },
  'tech-library': { section: 'TECHNOLOGY ARCHIVE', title: 'Research Library & Laboratory Focus' },
  'eve-blueprints': { section: 'TECHNOLOGY ARCHIVE', title: 'EVE Blueprints & ME/TE' },
  'tech-offense': { section: 'TECHNOLOGY ARCHIVE', title: 'Offensive Research' },
  'tech-defense': { section: 'TECHNOLOGY ARCHIVE', title: 'Defensive Grids' },
  'tech-covert': { section: 'TECHNOLOGY ARCHIVE', title: 'Covert Operations Tech' },
  'tech-anti-covert': { section: 'TECHNOLOGY ARCHIVE', title: 'Subspace Counter-Sensors' },
  factories: { section: 'INDUSTRIAL COMPLEX', title: 'Planetary Mines & Nanite Factories' },
  shipyard: { section: 'ORBITAL SHIPYARD', title: 'Orbital Shipyard & Fleet Drydocks' },
  'space-stations': { section: 'ORBITAL SHIPYARD', title: 'Orbital Starbases & Space Stations' },
  defenses: { section: 'PLANETARY DEFENSE', title: 'Planetary Defense Grid Matrix' },
  expeditions: { section: 'DEEP SPACE MISSIONS', title: 'Deep Space Expeditions & Anomalies' },
  megastructures: { section: 'STELLAR ENGINEERING', title: 'Stellar Megastructure Projects' },
  'nms-universe': { section: 'DEEP SPACE MISSIONS', title: "No Man's Sky Procedural Universe" },
  'stargate-network': { section: 'DEEP SPACE MISSIONS', title: 'Stargate & Interstellar Jump Gates' },
  'spy-log': { section: 'INTELLIGENCE BUREAU', title: 'Covert Missions History' },
  'enemy-intelligence': { section: 'INTELLIGENCE BUREAU', title: 'Enemy Intel Reports' },
  'resource-exchange': { section: 'COMMERCE & LOGISTICS', title: 'Resource Market' },
  'mercenary-market': { section: 'COMMERCE & LOGISTICS', title: 'Mercenary Guild' },
  'bank-vault': { section: 'COMMERCE & LOGISTICS', title: 'Imperial Bank & Vault' },
  rankings: { section: 'GALACTIC COUNCIL', title: 'Realm Leaderboards' },
  alliances: { section: 'GALACTIC COUNCIL', title: 'Alliances & Coalitions' },
  messages: { section: 'GALACTIC COUNCIL', title: 'Subspace Communications' },
  'planet-list': { section: 'WORLDS & COLONIES', title: 'Colonial Registry' },
  'planet-bonuses': { section: 'WORLDS & COLONIES', title: 'Planetary Modifiers' },
  'planet-defenses': { section: 'WORLDS & COLONIES', title: 'Orbital Defense Cannons' },
  'planet-power': { section: 'WORLDS & COLONIES', title: 'Planetary Power Grid' },
  'moon-bases': { section: 'WORLDS & COLONIES', title: 'Moon Bases & Phalanxes' },
  ship: { section: 'FLAGSHIP MOTHERSHIP', title: 'Mothership Core' },
  modules: { section: 'FLAGSHIP MOTHERSHIP', title: 'Vessel Modular Upgrades' },
  exploration: { section: 'FLAGSHIP MOTHERSHIP', title: 'Deep Space Recon' },
  'admin-dashboard': { section: 'ADMIN SYSTEMS', title: 'Admin Control Panel' },
  'admin-crown': { section: 'ADMIN SYSTEMS', title: 'Imperial Crown & Sovereign Decrees' },
  'admin-cheats': { section: 'ADMIN SYSTEMS', title: 'God Mode & Sovereign Grants Console' },
  'admin-operations': { section: 'ADMIN SYSTEMS', title: 'Server Operations & Modifiers' },
  'cron-jobs': { section: 'ADMIN & OPERATIONS', title: 'Empire Cron Scheduler' },
  'cron-logs': { section: 'ADMIN & OPERATIONS', title: 'Execution & Operations Logs' },
  'cron-cli': { section: 'ADMIN & OPERATIONS', title: 'Server Crontab CLI Reference' },
  'store-battlepass': { section: 'STORE & BATTLE PASS', title: 'Imperial Store, Battle Pass & VIP Pass' },
  'ship-fitting': { section: 'MODULAR FITTING LAB', title: 'Modular Ship Fitting & 6-Type Armor Resistance' },
  civilization: { section: 'EMPIRE GOVERNANCE', title: 'Civilization Traditions, Demographics & Happiness' },
  diplomacy: { section: 'DIPLOMATIC NEXUS', title: 'Galactic Diplomacy, Embassies & Federation Vault' },
  missions: { section: 'CAMPAIGN OPERATIONS', title: 'Story Missions, Galactic Events & Achievements' },
  'galactic-news': { section: 'HOLONET BROADCAST', title: 'Live Galactic News Feed & Holonet Alerts' },
  'codex-doc': { section: 'STRATEGIC CODEX', title: 'In-Game Strategy Codex & Engine Formulas' },
  'account-profiles': { section: 'COMMAND MATRIX', title: 'Commander Character Slots & Profiles' },
  'mmorpg-ogame': { section: 'MMORPG GALAXY HUB', title: 'Guild Raids, Live Chat & Interstellar Bosses' },
  'hyperspace-systems': { section: 'FTL & TITAN PROPULSION', title: 'Hyperspace Drives & Titan Motherships' },
  'stellar-encyclopedia': { section: 'WORLDS & COLONIES', title: 'Stellar Planetary & Lunar Encyclopedia' },
  'aic-system': { section: 'AUTOMATED INDUSTRY', title: 'Automated Industry Complex (AIC) & Logistics' },
  'power-grid': { section: 'STELLAR ENGINEERING', title: 'Planetary & Microgrid Power Network' },
  race: { section: 'REALM PROFILE', title: 'Race & Government Faction' },
  vacation: { section: 'REALM PROFILE', title: 'Vacation Shielding' },
  ascension: { section: 'REALM PROFILE', title: 'Ascension Chamber' },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeRoute,
  profile,
  resources,
  planets = [],
  activePlanetId,
  onSelectPlanet,
  cronAutoTickEnabled = true,
  nextTickSeconds = 60,
  netIncome = 18500,
  bankCapacity = 350000,
  onProcessTurn,
  onResetGame,
  onNavigate,
}) => {
  const currentMeta = ROUTE_LABELS[activeRoute] || {
    section: 'UNIVERSE CIVILIZATION',
    title: 'Command Interface',
  };

  // Live Galaxy Server Clock
  const [serverTime, setServerTime] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [turnExecuting, setTurnExecuting] = useState<boolean>(false);
  const [isPlanetMenuOpen, setIsPlanetMenuOpen] = useState<boolean>(false);
  const planetDropdownRef = useRef<HTMLDivElement>(null);

  // Active Planet resolution
  const activePlanet = planets.find((p) => p.id === activePlanetId) ||
    planets.find((p) => p.isHomeworld) ||
    planets[0] || {
      id: 'pl-homeworld',
      name: 'Homeworld Earth (Tau\'ri Command)',
      coordinate: '1:204:8',
      biome: 'Temperate Continental',
      level: 5,
      incomeBonus: 35000,
      defenseBonus: 65000,
      moonName: 'Luna Prime',
      jumpGateLevel: 2,
      isHomeworld: true,
      fieldsUsed: 84,
      fieldsMax: 188,
    };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (planetDropdownRef.current && !planetDropdownRef.current.contains(event.target as Node)) {
        setIsPlanetMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setServerTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Standard OGame Storage Capacities
  const metalCapacity = 500000;
  const crystalCapacity = 300000;
  const deutCapacity = 150000;
  const foodCapacity = resources.maxFood || 250000;
  const waterCapacity = resources.maxWater || 300000;
  const maxEnergy = resources.maxEnergy || 1000;
  const maxTurns = 100;

  // Percentage filled
  const metalPercent = Math.min(100, Math.round(((resources.metal ?? 50000) / metalCapacity) * 100));
  const crystalPercent = Math.min(100, Math.round(((resources.crystal ?? 30000) / crystalCapacity) * 100));
  const deutPercent = Math.min(100, Math.round(((resources.deuterium ?? 15000) / deutCapacity) * 100));
  const foodPercent = Math.min(100, Math.round(((resources.food ?? 42000) / foodCapacity) * 100));
  const waterPercent = Math.min(100, Math.round(((resources.water ?? 58000) / waterCapacity) * 100));
  const energyPercent = Math.min(100, Math.round(((resources.energy ?? 500) / maxEnergy) * 100));
  const turnPercent = Math.min(100, Math.round((resources.attackTurns / maxTurns) * 100));

  // Turn Execution Wrapper with visual feedback
  const handleTriggerTurn = (count: number = 1) => {
    sound.play('confirm');
    setTurnExecuting(true);
    onProcessTurn(count);
    setTimeout(() => setTurnExecuting(false), 450);
  };

  return (
    <header id="ogame-topbar-header" className="border-b border-[#dedede] bg-white shrink-0 relative z-30">
      {/* ========================================================================= */}
      {/* 1. TOP SUB-HEADER: COLONY COORDINATES, SERVER TIME & COMMANDER */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#fafafa] border-b border-[#dedede] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Active Colony / Coordinates & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Active Planet Coordinates Dropdown Selector (OGame Signature) */}
          <div className="relative" ref={planetDropdownRef}>
            <button
              type="button"
              id="planet-dropdown-trigger"
              onClick={() => {
                sound.play('click');
                setIsPlanetMenuOpen(!isPlanetMenuOpen);
              }}
              title={`Active World: ${activePlanet.name} [${activePlanet.coordinate}] - Click to switch or manage worlds`}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#dedede] hover:border-[#111111] transition-colors cursor-pointer shadow-xs group"
            >
              <Globe size={14} className="text-[#111111] group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-1.5">
                {activePlanet.isHomeworld && (
                  <span className="text-amber-500 font-bold" title="Homeworld">👑</span>
                )}
                <span className="font-bold text-[#111111]">{activePlanet.name.split(' (')[0]}</span>
                <span className="font-mono text-[#111111] bg-neutral-100 px-1.5 py-0.5 text-[11px] font-bold border border-neutral-200">
                  [{activePlanet.coordinate}]
                </span>
              </div>
              <ChevronDown size={13} className={`text-[#666666] transition-transform duration-200 ${isPlanetMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Interactive Dropdown Button List of Worlds */}
            {isPlanetMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-[360px] sm:w-[440px] bg-white border border-[#111111] shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Dropdown Header */}
                <div className="p-3 bg-[#111111] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-cyan-400" />
                    <span className="font-bold uppercase tracking-wider text-xs">
                      Sovereign Worlds & Colonies ({planets.length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPlanetMenuOpen(false);
                      onNavigate && onNavigate('planet-list');
                    }}
                    className="text-[10px] font-mono uppercase bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2 py-0.5 cursor-pointer flex items-center gap-1"
                  >
                    <span>World Nexus</span>
                    <ExternalLink size={10} />
                  </button>
                </div>

                {/* Planet Items List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-[#eeeeee]">
                  {planets.map((planet) => {
                    const isSelected = planet.id === activePlanet.id;
                    return (
                      <div
                        key={planet.id}
                        className={`p-3 transition-colors ${
                          isSelected ? 'bg-amber-50/50 border-l-4 border-amber-600' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            onClick={() => {
                              sound.play('confirm');
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                            }}
                            className="cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-1.5">
                              {planet.isHomeworld && (
                                <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                                  HOMEWORLD
                                </span>
                              )}
                              <span className="font-bold text-xs text-[#111111] hover:text-blue-600">
                                {planet.name}
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-1 border border-neutral-200">
                                [{planet.coordinate}]
                              </span>
                              {isSelected && (
                                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                                  <Check size={12} /> Active
                                </span>
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] font-mono text-[#666666]">
                              <span>Biome: <strong className="text-[#111111]">{planet.biome}</strong></span>
                              <span>Fields: <strong className="text-[#111111]">{planet.fieldsUsed || 80}/{planet.fieldsMax || 188}</strong></span>
                              {planet.moonName && (
                                <span className="text-cyan-700 font-semibold">🌙 {planet.moonName}</span>
                              )}
                            </div>

                            <div className="mt-1 text-[10px] font-mono text-emerald-700">
                              Production: +{planet.metalProductionRate?.toLocaleString() || '40k'} Met · +{planet.crystalProductionRate?.toLocaleString() || '25k'} Cryst/h
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Sub-Menu Jump Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-1 text-[10px]">
                          <button
                            onClick={() => {
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                              onNavigate && onNavigate('planet-list');
                            }}
                            className="px-2 py-0.5 bg-white border border-[#dedede] hover:border-[#111111] font-bold text-[#111111] cursor-pointer flex items-center gap-1"
                          >
                            <Globe size={10} />
                            <span>Overview</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                              onNavigate && onNavigate('factories');
                            }}
                            className="px-2 py-0.5 bg-white border border-[#dedede] hover:border-[#111111] font-bold text-[#111111] cursor-pointer flex items-center gap-1"
                          >
                            <Flame size={10} />
                            <span>Mines</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                              onNavigate && onNavigate('shipyard');
                            }}
                            className="px-2 py-0.5 bg-white border border-[#dedede] hover:border-[#111111] font-bold text-[#111111] cursor-pointer flex items-center gap-1"
                          >
                            <Building size={10} />
                            <span>Shipyard</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                              onNavigate && onNavigate('defenses');
                            }}
                            className="px-2 py-0.5 bg-white border border-[#dedede] hover:border-[#111111] font-bold text-[#111111] cursor-pointer flex items-center gap-1"
                          >
                            <Shield size={10} />
                            <span>Defenses</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectPlanet && onSelectPlanet(planet.id);
                              setIsPlanetMenuOpen(false);
                              onNavigate && onNavigate('moon-bases');
                            }}
                            className="px-2 py-0.5 bg-white border border-[#dedede] hover:border-[#111111] font-bold text-[#111111] cursor-pointer flex items-center gap-1"
                          >
                            <Radio size={10} />
                            <span>Moon</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown Footer Action */}
                <div className="p-2.5 bg-[#fafafa] border-t border-[#dedede] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#777777] font-mono">
                    All 30 Universes & 90 Galaxies
                  </span>
                  <button
                    onClick={() => {
                      setIsPlanetMenuOpen(false);
                      onNavigate && onNavigate('universe');
                    }}
                    className="px-2.5 py-1 bg-[#111111] text-white hover:bg-neutral-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Rocket size={11} />
                    <span>Colonize New World</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[#777777] font-mono text-[11px]">
            <span>/</span>
            <span className="uppercase tracking-wider font-semibold text-[#555555]">
              {currentMeta.section}
            </span>
            <span>:</span>
            <span className="text-[#111111] font-bold">{currentMeta.title}</span>
          </div>
        </div>

        {/* Right: Live Server Time, DefCon, Commander Profile & Reset */}
        <div className="flex items-center gap-3">
          {/* Live Galaxy Server Clock */}
          <div
            className="flex items-center gap-1.5 font-mono text-xs text-[#555555] bg-white border border-[#dedede] px-2.5 py-1"
            title="Galactic Standard Time (Server synchronized)"
          >
            <Clock size={12} className="text-[#888888]" />
            <span className="text-[10px] text-[#888888] font-bold">ST</span>
            <span className="font-bold text-[#111111]">{serverTime || '12:00:00'}</span>
          </div>

          {/* Commander Rank Pill */}
          <div
            onClick={() => onNavigate && onNavigate('commander-hq')}
            className="flex items-center gap-2 px-2.5 py-1 bg-white border border-[#dedede] hover:border-[#111111] cursor-pointer transition-colors"
            title="Commander HQ, Officers & Doctrines"
          >
            <User size={13} className="text-[#555555]" />
            <span className="font-bold text-[#111111]">{profile.username}</span>
            <span className="text-[10px] text-[#777777] uppercase font-mono">
              ({profile.rankName || 'Imperator'})
            </span>
            <span
              className={`px-1.5 py-0.2 text-[9px] font-black uppercase ${
                profile.defconLevel === 0
                  ? 'bg-neutral-200 text-neutral-800'
                  : profile.defconLevel === 1
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-black'
              }`}
            >
              DEFCON {profile.defconLevel}
            </span>
          </div>

          {/* Reset Demo State Button */}
          <button
            type="button"
            id="reset-game-state-btn"
            onClick={() => {
              sound.play('warning');
              onResetGame();
            }}
            title="Reset universe back to default state"
            className="flex items-center gap-1 px-2 py-1 text-[#777777] hover:text-[#111111] hover:bg-neutral-100 border border-transparent hover:border-[#dedede] transition-colors cursor-pointer text-[11px]"
          >
            <RefreshCw size={11} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OGAME MULTI-RESOURCE BAR: CREDITS, METAL, CRYSTAL, DEUTERIUM, FOOD, WATER, POP, ENERGY, NAQ */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-2.5 bg-white flex flex-wrap items-center justify-between gap-4 border-b border-[#dedede]">
        {/* Resource Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2 flex-1">
          {/* 0. GALACTIC CREDITS (GC) */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-amber-500 transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('credits')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('resource-exchange')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <CreditCard size={11} className="text-amber-500" />
                <span>Galactic Credits</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+250/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong className="text-sm sm:text-base font-bold tracking-tight text-amber-900">
                {(resources.credits ?? 500000).toLocaleString()}{' '}
                <span className="text-[10px] text-amber-600">GC</span>
              </strong>
              <span className="text-[10px] text-[#888888]">Universal</span>
            </div>
            {/* Credits Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-300 w-full" />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'credits' && (
              <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>GALACTIC CREDITS (GC)</span>
                  <span className="font-mono text-amber-400">FIAT CURRENCY</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Available Balance:</span>
                  <span className="font-mono text-white">{(resources.credits ?? 500000).toLocaleString()} GC</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>AIC Factory Revenue:</span>
                  <span className="font-mono text-emerald-400">+250 GC/turn (+15k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Universal interstellar tender accepted across all 30 universes. Used for AIC factory upgrades, arms trading, mercenary contracts, and craft floor rushing.
                </div>
              </div>
            )}
          </div>
          {/* 1. METAL */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('metal')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('factories')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Layers size={11} className="text-[#555555]" />
                <span>Metal</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+120/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  metalPercent >= 90 ? 'text-rose-600' : 'text-[#111111]'
                }`}
              >
                {(resources.metal ?? 50000).toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">500k</span>
            </div>
            {/* Storage Progress Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  metalPercent >= 90 ? 'bg-rose-500' : metalPercent >= 75 ? 'bg-amber-500' : 'bg-[#111111]'
                }`}
                style={{ width: `${metalPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'metal' && (
              <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>METAL STORAGE</span>
                  <span className="font-mono">{metalPercent}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Current:</span>
                  <span className="font-mono text-white">{(resources.metal ?? 50000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Capacity:</span>
                  <span className="font-mono text-white">{metalCapacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Mine Yield:</span>
                  <span className="font-mono text-emerald-400">+120/turn (+7.2k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Essential for warship frames, orbital defenses, and heavy armor.
                </div>
              </div>
            )}
          </div>

          {/* 2. CRYSTAL */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('crystal')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('factories')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Gem size={11} className="text-cyan-600" />
                <span>Crystal</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+80/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  crystalPercent >= 90 ? 'text-rose-600' : 'text-[#111111]'
                }`}
              >
                {(resources.crystal ?? 30000).toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">300k</span>
            </div>
            {/* Storage Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  crystalPercent >= 90 ? 'bg-rose-500' : crystalPercent >= 75 ? 'bg-amber-500' : 'bg-cyan-600'
                }`}
                style={{ width: `${crystalPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'crystal' && (
              <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>CRYSTAL STORAGE</span>
                  <span className="font-mono">{crystalPercent}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Current:</span>
                  <span className="font-mono text-white">{(resources.crystal ?? 30000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Capacity:</span>
                  <span className="font-mono text-white">{crystalCapacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Mine Yield:</span>
                  <span className="font-mono text-emerald-400">+80/turn (+4.8k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Required for electronic circuits, laser cannons, and research disciplines.
                </div>
              </div>
            )}
          </div>

          {/* 3. DEUTERIUM */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('deut')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('factories')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Droplet size={11} className="text-blue-600" />
                <span>Deuterium</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+45/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  deutPercent >= 90 ? 'text-rose-600' : 'text-[#111111]'
                }`}
              >
                {(resources.deuterium ?? 15000).toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">150k</span>
            </div>
            {/* Storage Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  deutPercent >= 90 ? 'bg-rose-500' : deutPercent >= 75 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${deutPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'deut' && (
              <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>DEUTERIUM STORAGE</span>
                  <span className="font-mono">{deutPercent}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Current:</span>
                  <span className="font-mono text-white">{(resources.deuterium ?? 15000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Capacity:</span>
                  <span className="font-mono text-white">{deutCapacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Synthesizer Yield:</span>
                  <span className="font-mono text-emerald-400">+45/turn (+2.7k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Used as hyperspace warship fuel, fusion reaction feed, and sensor probes.
                </div>
              </div>
            )}
          </div>

          {/* 4. FOOD (LIFE SUPPORT & NUTRITION) */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('food')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('life-support')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Wheat size={11} className="text-emerald-600" />
                <span>Food</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+60/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  (resources.food ?? 42000) < 5000 ? 'text-rose-600 animate-pulse' : 'text-[#111111]'
                }`}
              >
                {(resources.food ?? 42000).toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">{Math.round(foodCapacity / 1000)}k</span>
            </div>
            {/* Storage Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  foodPercent < 15 ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${foodPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'food' && (
              <div className="absolute left-0 top-full mt-2 w-60 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>FOOD & HYDROPONICS</span>
                  <span className="font-mono text-emerald-400">{foodPercent}% FULL</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Stockpile:</span>
                  <span className="font-mono text-white">{(resources.food ?? 42000).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Capacity:</span>
                  <span className="font-mono text-white">{foodCapacity.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Net Growth Surplus:</span>
                  <span className="font-mono text-emerald-400">+60/t (+3.6k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Essential sustenance for citizen pops. Famine triggers civil unrest and colonial plunge.
                </div>
              </div>
            )}
          </div>

          {/* 5. WATER (AQUIFER & HYDRATION) */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('water')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('life-support')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Droplet size={11} className="text-cyan-500" />
                <span>Water</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+75/t</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong
                className={`text-sm sm:text-base font-bold tracking-tight ${
                  (resources.water ?? 58000) < 5000 ? 'text-rose-600 animate-pulse' : 'text-[#111111]'
                }`}
              >
                {(resources.water ?? 58000).toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">{Math.round(waterCapacity / 1000)}k</span>
            </div>
            {/* Storage Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  waterPercent < 15 ? 'bg-rose-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'water' && (
              <div className="absolute left-0 top-full mt-2 w-60 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>AQUIFER & PURIFICATION</span>
                  <span className="font-mono text-cyan-300">{waterPercent}% FULL</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Stockpile:</span>
                  <span className="font-mono text-white">{(resources.water ?? 58000).toLocaleString()} kL</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Capacity:</span>
                  <span className="font-mono text-white">{waterCapacity.toLocaleString()} kL</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Desalination Net:</span>
                  <span className="font-mono text-emerald-400">+75/t (+4.5k/h)</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Atmospheric moisture and deep aquifer reserves. Drought multiplies environmental hazard penalties.
                </div>
              </div>
            )}
          </div>

          {/* 6. POPULATION & PLUNGE STABILITY */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('pop')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('life-support')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Users size={11} className="text-indigo-600" />
                <span>Pops / Plunge</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">STABLE</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong className="text-sm sm:text-base font-bold tracking-tight text-[#111111]">
                {((resources.totalPopulation ?? 14200000) / 1000000).toFixed(1)}M
              </strong>
              <span className="text-[10px] text-emerald-700 font-bold">Plunge: 8%</span>
            </div>
            {/* Plunge Stability Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: '92%' }} />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'pop' && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>CITIZEN DEMOGRAPHICS</span>
                  <span className="font-mono text-emerald-400">92% STABILITY</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Total Dominion Pops:</span>
                  <span className="font-mono text-white">{(resources.totalPopulation ?? 14200000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Colonial Plunge Index:</span>
                  <span className="font-mono text-emerald-400">8% (Nominal)</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Living Standards:</span>
                  <span className="font-mono text-white">Utopian Abundance</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Pops provide workforce across mines, farms, and fleets. Manage hazards to avoid societal plunge!
                </div>
              </div>
            )}
          </div>

          {/* 7. ENERGY */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('energy')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('planet-power')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Zap size={11} className="text-amber-500" />
                <span>Energy Grid</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">+340 MW</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong className="text-sm sm:text-base font-bold tracking-tight text-[#111111]">
                {(resources.energy ?? 500).toLocaleString()} <span className="text-[10px]">MW</span>
              </strong>
              <span className="text-[10px] text-[#888888]">{maxEnergy} MW</span>
            </div>
            {/* Grid Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${energyPercent}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'energy' && (
              <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>ENERGY BALANCE</span>
                  <span className="font-mono text-emerald-400">SURPLUS</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Total Output:</span>
                  <span className="font-mono text-white">{(resources.energy ?? 500).toLocaleString()} MW</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Colonial Demand:</span>
                  <span className="font-mono text-neutral-400">160 MW</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Net Available:</span>
                  <span className="font-mono text-emerald-400">+340 MW</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Supplies power to mines and defense shields. Insufficient power reduces mine output!
                </div>
              </div>
            )}
          </div>

          {/* 5. DARK MATTER */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('dm')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('store-battlepass')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-purple-600" />
                <span>Dark Matter</span>
              </span>
              <span className="text-[9px] font-mono text-purple-700 font-bold">STORE →</span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong className="text-sm sm:text-base font-bold tracking-tight text-[#111111]">
                {(resources.darkMatter ?? 2500).toLocaleString()}{' '}
                <span className="text-[10px] text-purple-700">DM</span>
              </strong>
              <span className="text-[10px] text-[#888888]">Rare</span>
            </div>
            {/* Aesthetic Mini Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div className="h-full bg-purple-600 transition-all duration-300 w-full" />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'dm' && (
              <div className="absolute left-0 top-full mt-2 w-56 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>DARK MATTER RESERVE</span>
                  <span className="font-mono text-purple-300">PREMIUM</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Balance:</span>
                  <span className="font-mono text-white">
                    {(resources.darkMatter ?? 2500).toLocaleString()} DM
                  </span>
                </div>
                <div className="text-[10px] text-neutral-300 pt-1 border-t border-white/10">
                  Acquire elite commanders, instant supply drops, warship hull skins, and activate the VIP
                  Battle Pass.
                </div>
              </div>
            )}
          </div>

          {/* 6. NAQUADAH SOVEREIGN CURRENCY & BANK VAULT */}
          <div
            className="relative p-2 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-all cursor-pointer group"
            onMouseEnter={() => setActiveTooltip('naq')}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => onNavigate && onNavigate('resources')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase text-[#666666] tracking-wider flex items-center gap-1">
                <Coins size={11} className="text-amber-600" />
                <span>Naquadah</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">
                +{netIncome.toLocaleString()}/t
              </span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <strong className="text-sm sm:text-base font-bold tracking-tight text-[#111111]">
                {resources.naquadah.toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#888888]">
                Vault: {Math.round(resources.bankedNaquadah / 1000)}k
              </span>
            </div>
            {/* Vault Bar */}
            <div className="w-full h-1 bg-[#e5e5e5] mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-600 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((resources.bankedNaquadah / bankCapacity) * 100))}%` }}
              />
            </div>

            {/* Hover Tooltip */}
            {activeTooltip === 'naq' && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#111111] text-white text-xs z-50 shadow-xl border border-white/20 space-y-1.5 pointer-events-none">
                <div className="font-bold flex justify-between border-b border-white/20 pb-1">
                  <span>SOVEREIGN TREASURY</span>
                  <span className="font-mono text-amber-300">LIQUID & VAULT</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Liquid Cash:</span>
                  <span className="font-mono text-white">{resources.naquadah.toLocaleString()} NQ</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Protected Vault:</span>
                  <span className="font-mono text-white">{resources.bankedNaquadah.toLocaleString()} NQ</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Vault Capacity:</span>
                  <span className="font-mono text-white">{bankCapacity.toLocaleString()} NQ</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-300">
                  <span>Net Turn Yield:</span>
                  <span className="font-mono text-emerald-400">+{netIncome.toLocaleString()} NQ/turn</span>
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                  Unbanked Naquadah can be plundered in combat raids. Stash funds in the Vault!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OGAME TURN ENGINE & CRON TICK CONSOLE (INTERACTIVE CONTROL STRIP) */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#fafafa] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Turn Gauge & Server Cron Pulse */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Turn Reservoir Gauge */}
          <div className="flex items-center gap-3 bg-white border border-[#dedede] px-3 py-1.5 font-mono">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#777777] gap-3">
                <span className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1">
                  <RotateCw
                    size={11}
                    className={`text-[#111111] ${turnExecuting ? 'animate-spin' : ''}`}
                  />
                  <span>Empire Turns:</span>
                </span>
                <span className="font-bold text-[#111111]">
                  {resources.attackTurns} / {maxTurns}
                </span>
              </div>
              <div className="w-28 sm:w-36 h-2 bg-[#eeeeee] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    resources.attackTurns >= 90
                      ? 'bg-emerald-600'
                      : resources.attackTurns >= 30
                      ? 'bg-[#111111]'
                      : 'bg-amber-600'
                  }`}
                  style={{ width: `${turnPercent}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] text-[#888888] border-l border-[#dedede] pl-2.5">
              <span className="block font-bold text-[#111111]">Regen</span>
              <span>+1 / 60s</span>
            </div>
          </div>

          {/* Automated Heartbeat / Cron Countdown */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('cron-jobs')}
              title="Automated Turn Heartbeat (Click to open Empire Cron)"
              className="flex items-center gap-2 bg-white border border-[#dedede] hover:border-[#111111] px-3 py-1.5 text-xs transition-colors cursor-pointer font-mono"
            >
              <span className="relative flex h-2.5 w-2.5">
                {cronAutoTickEnabled && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    cronAutoTickEnabled ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                />
              </span>
              <span className="text-[10px] font-bold text-[#777777] uppercase">Next Cycle:</span>
              <span className="font-bold text-[#111111]">
                {cronAutoTickEnabled ? `00:${nextTickSeconds.toString().padStart(2, '0')}` : 'PAUSED'}
              </span>
              <span className="text-[9px] bg-neutral-100 text-neutral-600 px-1 py-0.2 border border-neutral-300">
                6/min
              </span>
            </button>
          )}
        </div>

        {/* Right: Quick Turn Execution Controls (OGame Tactile Actions) */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Process 1 Turn Button */}
          <button
            type="button"
            id="process-turn-btn"
            onClick={() => handleTriggerTurn(1)}
            disabled={turnExecuting}
            title="Advance 1 empire cycle: Harvests colonial mines, collects sovereign revenue, and drafts recruits"
            className="px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95"
          >
            <RotateCw size={13} className={turnExecuting ? 'animate-spin' : ''} />
            <span>Process Turn (+1)</span>
          </button>

          {/* Batch Advance x5 */}
          <button
            type="button"
            onClick={() => handleTriggerTurn(5)}
            disabled={turnExecuting}
            title="Fast-forward 5 production turns in sequence"
            className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FastForward size={13} />
            <span>x5</span>
          </button>

          {/* Batch Advance x10 */}
          <button
            type="button"
            onClick={() => handleTriggerTurn(10)}
            disabled={turnExecuting}
            title="Fast-forward 10 production turns in sequence"
            className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors hidden sm:flex"
          >
            <FastForward size={13} />
            <span>x10</span>
          </button>

          {/* Quick link to Turn Engine Overview */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('turn-system')}
              title="Open Full Empire Turn Engine"
              className="p-2 bg-white border border-[#dedede] hover:border-[#111111] text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
            </button>
          )}

          {/* Quick link to Admin Systems & Crown */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('admin-dashboard')}
              title="Open Admin Control Panel Systems (Imperial Crown & Server Operations)"
              className="px-2.5 py-2 bg-amber-400 hover:bg-amber-300 text-[#111111] border border-amber-500 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crown size={14} className="text-[#111111]" />
              <span className="hidden md:inline font-mono text-[11px] uppercase">ADMIN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
