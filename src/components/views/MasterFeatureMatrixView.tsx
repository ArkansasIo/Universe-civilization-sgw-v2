import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertCircle, Sparkles, Search, Filter, 
  Layers, ChevronRight, Play, Server, Shield, Database, Cpu, 
  Globe, Rocket, Pickaxe, Atom, Wrench, Swords, Crown, BookOpen 
} from 'lucide-react';
import { sound } from '../../sound';

interface MasterFeatureMatrixViewProps {
  onNavigate: (route: string) => void;
}

interface FeatureItem {
  id: string;
  category: string;
  name: string;
  status: 'IMPLEMENTED' | 'ACTIVE_RUNTIME' | 'EXPANDED' | 'PLANNED';
  route?: string;
  description: string;
  specs: string;
}

const MASTER_FEATURE_INVENTORY: FeatureItem[] = [
  // 1. Core & Universe
  { id: 'f-101', category: '1. Galaxy & Universe', name: 'Persistent Multiplayer Galaxy', status: 'ACTIVE_RUNTIME', route: 'universe', description: 'Real-time galaxy server simulation with 30 Universes, 90 Galaxies, and sector distance coordinate formulas.', specs: 'UniverseView.tsx | Server Loop' },
  { id: 'f-102', category: '1. Galaxy & Universe', name: 'Celestial Objects (Stars, Planets, Moons)', status: 'IMPLEMENTED', route: 'universe', description: 'Comprehensive astronomical object database including 16 planetary classifications, moons, and asteroid belts.', specs: 'gameData.ts | Celestial System' },
  { id: 'f-103', category: '1. Galaxy & Universe', name: 'Capital Distance Scaling', status: 'ACTIVE_RUNTIME', route: 'universe', description: 'Dynamic difficulty scaling and flight-time cost curves expanding from homeworld coordinates.', specs: 'UniverseView.tsx' },

  // 2. Planet & Colony
  { id: 'f-201', category: '2. Planets & Colonies', name: 'Colonial World Nexus (1-999,999 Planets)', status: 'IMPLEMENTED', route: 'planetary-invasion', description: 'Mass scale conquest system supporting hundreds of thousands of colonizable worlds.', specs: 'PlanetaryInvasionView.tsx' },
  { id: 'f-202', category: '2. Planets & Colonies', name: 'Food & Water Rationing Systems', status: 'ACTIVE_RUNTIME', route: 'life-support', description: 'Planetary life-support management tracking hydroponic food, water purification, and ration tiers.', specs: 'PlanetaryPowerView.tsx' },
  { id: 'f-203', category: '2. Planets & Colonies', name: 'Moon Base & Sensor Phalanx Grid', status: 'IMPLEMENTED', route: 'moon-bases', description: 'Lunar base construction with long-range sensor phalanx scanning and fleet jump gates.', specs: 'MoonBaseView.tsx' },

  // 3. Command & RPG Progression
  { id: 'f-301', category: '3. Command & RPG', name: '👑 Nemesis Warlord & Rival Hierarchy', status: 'IMPLEMENTED', route: 'nemesis-system', description: '4-Tier dynamic rival command tree with mutinies, cybernetic traits, tactical fleet duels, and vassalage.', specs: 'NemesisSystemView.tsx' },
  { id: 'f-302', category: '3. Command & RPG', name: 'Commander HQ & 7 Specialized Roles', status: 'ACTIVE_RUNTIME', route: 'commander-hq', description: 'RPG Commander progression with Admiral, Industrialist, Tactician, Corsair, Logistician, Geologist roles.', specs: 'CommanderSystemView.tsx' },
  { id: 'f-303', category: '3. Command & RPG', name: '999 Level / 99 Tier Progression Engine', status: 'IMPLEMENTED', route: 'player-profile', description: 'Master XP engine calculating milestone rewards, skill unlocks, and empire rank bonuses.', specs: 'ProfileSystemView.tsx' },

  // 4. Research & Technology
  { id: 'f-401', category: '4. Research & Technology', name: 'Master Technology Tree & Prerequisites', status: 'ACTIVE_RUNTIME', route: 'tech-tree', description: 'Branching technology graph linking Energy, Propulsion, Physics, AI, Quantum, and Megastructure nodes.', specs: 'TechTreeView.tsx' },
  { id: 'f-402', category: '4. Research & Technology', name: 'EVE Blueprints & Material/Time Efficiency', status: 'IMPLEMENTED', route: 'eve-blueprints', description: 'Blueprint manufacturing library with ME/TE research levels, copy runs, and invention chances.', specs: 'EveBlueprintsView.tsx' },
  { id: 'f-403', category: '4. Research & Technology', name: 'Research Laboratory Specializations', status: 'ACTIVE_RUNTIME', route: 'tech-library', description: 'Dedicated lab modules for Physics, Engineering, Biology, Military, Computer, and Quantum sciences.', specs: 'ResearchLibraryView.tsx' },

  // 5. Industry & Upgrades
  { id: 'f-501', category: '5. Industry & Upgrades', name: '🏛️ Master Upgrades Hub', status: 'IMPLEMENTED', route: 'master-upgrades', description: 'Centralized empire facility upgrade portal for mines, power plants, nanofactories, and shipyards.', specs: 'MasterUpgradesView.tsx' },
  { id: 'f-502', category: '5. Industry & Upgrades', name: 'Automated Industry Complex (AIC)', status: 'ACTIVE_RUNTIME', route: 'aic-system', description: 'Automated queue management for continuous resource refining, component assembly, and stockpiling.', specs: 'AICSystemView.tsx' },
  { id: 'f-503', category: '5. Industry & Upgrades', name: 'Stellar Megastructures (Dyson Swarms, Ringworlds)', status: 'IMPLEMENTED', route: 'megastructures', description: 'Endgame superstructures yielding hyper-energy production and global fleet construction bonuses.', specs: 'MegastructureView.tsx' },

  // 6. Shipyard & Fleet
  { id: 'f-601', category: '6. Shipyard & Fleet', name: '90-Class Unit Roster & 13 Ship Tiers', status: 'IMPLEMENTED', route: 'unit-roster-90', description: 'Comprehensive fleet unit directory spanning light fighters, destroyers, dreadnoughts, and titans.', specs: 'UnitRoster90View.tsx' },
  { id: 'f-602', category: '6. Shipyard & Fleet', name: 'Ship Fitting & 6-Type Armor Matrix', status: 'ACTIVE_RUNTIME', route: 'ship-fitting', description: 'EVE-style slot fitting (High, Mid, Low) with 6 specialized armor layers and weapon hardpoints.', specs: 'ShipFittingView.tsx' },
  { id: 'f-603', category: '6. Shipyard & Fleet', name: 'Stargate Network & Jump Gate Relays', status: 'IMPLEMENTED', route: 'stargate-network', description: 'Instant planetary transport and fleet gate jumps across galaxy coordinate addresses.', specs: 'StargateNetworkView.tsx' },

  // 7. Combat & Intelligence
  { id: 'f-701', category: '7. Combat & Intelligence', name: 'Multi-Phase Fleet & Ground Combat Engine', status: 'ACTIVE_RUNTIME', route: 'targets', description: 'Shield/Armor/Hull damage mitigation, accuracy formulas, critical hits, and battle log generators.', specs: 'CombatView.tsx' },
  { id: 'f-702', category: '7. Combat & Intelligence', name: 'Espionage, Recon & Sabotage Ops', status: 'IMPLEMENTED', route: 'spy', description: 'Covert reconnaissance probes, signal jamming, counter-intelligence, and facility sabotage missions.', specs: 'SpyView.tsx' },

  // 8. Visuals & Engine
  { id: 'f-801', category: '8. Visuals & Engine', name: '👑 Stargate System Lords & PvE Raids', status: 'IMPLEMENTED', route: 'stargate-system-lords', description: 'Goa\'uld System Lords High Council, Naquadah tribute extraction, Sarcophagus healing, and Jaffa rebellion sabotage.', specs: 'StargateSystemLordsPvEView.tsx' },
  { id: 'f-802', category: '8. Visuals & Engine', name: 'Turn System (6 Turns/Min Server Loop)', status: 'ACTIVE_RUNTIME', route: 'turn-system', description: 'Continuous server tick engine running resource calculations, movement timers, and event triggers.', specs: 'TurnSystemView.tsx' },
];

export const MasterFeatureMatrixView: React.FC<MasterFeatureMatrixViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const CATEGORIES = [
    'All',
    '1. Galaxy & Universe',
    '2. Planets & Colonies',
    '3. Command & RPG',
    '4. Research & Technology',
    '5. Industry & Upgrades',
    '6. Shipyard & Fleet',
    '7. Combat & Intelligence',
    '8. Visuals & Engine'
  ];

  const filteredFeatures = MASTER_FEATURE_INVENTORY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const implementedCount = MASTER_FEATURE_INVENTORY.filter(f => f.status === 'IMPLEMENTED' || f.status === 'ACTIVE_RUNTIME').length;
  const totalCount = MASTER_FEATURE_INVENTORY.length;
  const completionPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-5 p-4 text-white font-sans max-w-7xl mx-auto">
      {/* Header Summary */}
      <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
            <Layers className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
              Master System Feature Inventory & Live Matrix
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono">
                Stellar Dominion 3.5 Spec
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive inventory of 1,000+ game engine modules, API endpoints, 3D scenes, and interactive views.
            </p>
          </div>
        </div>

        {/* Operational Stats Counter */}
        <div className="flex items-center gap-4 bg-[#0b1120] border border-[#1e293b] p-3 rounded-lg font-mono text-xs shrink-0">
          <div className="text-center px-2 border-r border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase">Total Modules</span>
            <span className="text-lg font-bold text-white">1,000+</span>
          </div>
          <div className="text-center px-2 border-r border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase">Active Views</span>
            <span className="text-lg font-bold text-cyan-400">60/60</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase">Completion</span>
            <span className="text-lg font-bold text-emerald-400">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 1,000+ features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category & Status Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#090d16] border border-[#1f293d] text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#090d16] border border-[#1f293d] text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE_RUNTIME">ACTIVE RUNTIME</option>
            <option value="IMPLEMENTED">IMPLEMENTED</option>
            <option value="PLANNED">PLANNED</option>
          </select>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-[#0f172a] border border-[#1e293b] hover:border-[#334155] p-4 rounded-xl flex flex-col justify-between gap-3 transition shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded uppercase font-bold">
                    {item.category}
                  </span>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                    item.status === 'ACTIVE_RUNTIME'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom Specs & Launch Button */}
              <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between font-mono text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                  {item.specs}
                </span>

                {item.route && (
                  <button
                    onClick={() => {
                      sound.play('click');
                      onNavigate(item.route!);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer shadow"
                  >
                    <span>Launch Module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
