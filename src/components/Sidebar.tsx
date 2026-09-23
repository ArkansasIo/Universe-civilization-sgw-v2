import React from 'react';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { sound } from '../sound';
import { PlayerProfile, Race } from '../types';
import { RACES } from '../gameData';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  profile: PlayerProfile;
  openGroups: Record<string, boolean>;
  onToggleGroup: (group: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout?: () => void;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  items: { id: string; label: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'command',
    label: 'Command Center',
    icon: '⌂',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'master-feature-matrix', label: '📊 Master Feature Matrix (1,000+ Specs)' },
      { id: 'civilization', label: 'Civilization & Population' },
      { id: 'missions', label: 'Missions & Campaigns' },
      { id: 'turn-system', label: 'Turn System (6 Turns/Min)' },
      { id: 'commander-hq', label: 'Commander HQ & Officers' },
      { id: 'player-profile', label: 'Player Profile & Dossier' },
      { id: 'store-battlepass', label: 'Store & Battle Pass' },
      { id: 'codex-doc', label: 'Strategy Codex & GDD' },
      { id: 'resources', label: 'Resources' },
      { id: 'income', label: 'Income' },
      { id: 'military-stats', label: 'Military Scores' },
    ],
  },
  {
    id: 'attack',
    label: 'Attack',
    icon: '⚔',
    items: [
      { id: 'nemesis-system', label: '👑 Nemesis Warlord System' },
      { id: 'targets', label: 'Targets' },
      { id: 'planetary-invasion', label: '1-999,999 Planets Conquest' },
      { id: 'spy', label: 'Spy' },
      { id: 'sabotage', label: 'Sabotage' },
      { id: 'attack-log', label: 'Attack Log' },
    ],
  },
  {
    id: 'armory',
    label: 'Armory',
    icon: '▣',
    items: [
      { id: 'weapons', label: 'Weapons Arsenal' },
      { id: 'armors', label: 'Armors & Vehicles' },
      { id: 'shields', label: 'Shields & Deflectors' },
      { id: 'weapon-market', label: 'Procurement Catalog' },
      { id: 'repair', label: 'Depot & Repair' },
    ],
  },
  {
    id: 'training',
    label: 'Training',
    icon: '◈',
    items: [
      { id: 'units', label: 'Units' },
      { id: 'miners', label: 'Miners' },
      { id: 'super-units', label: 'Super Units' },
      { id: 'unit-production', label: 'Unit Production' },
      { id: 'unit-roster-90', label: '90-Class Unit Roster' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology & Science',
    icon: '◇',
    items: [
      { id: 'tech-tree', label: 'Master Tech Tree' },
      { id: 'tech-library', label: 'Research Library & Labs' },
      { id: 'eve-blueprints', label: 'EVE Blueprints & ME/TE' },
      { id: 'tech-offense', label: 'Offense Weapons' },
      { id: 'tech-defense', label: 'Shield & Armor' },
      { id: 'tech-covert', label: 'Covert Intel' },
      { id: 'tech-anti-covert', label: 'Anti-Covert' },
    ],
  },
  {
    id: 'fleet-command',
    label: 'Shipyard & Fleet',
    icon: '🚀',
    items: [
      { id: 'universe', label: '30 Universes & 90 Galaxies' },
      { id: 'ship-fitting', label: 'Ship Fitting & 6-Type Armor' },
      { id: 'shipyard', label: 'Orbital Shipyard' },
      { id: 'nms-universe', label: 'NMS Procedural Universe' },
      { id: 'stargate-network', label: 'Stargate & Jump Gates' },
      { id: 'stargate-relics', label: '🏺 Stargate Relics & Artifacts' },
      { id: 'stargate-system-lords', label: '👑 Stargate System Lords & PvE Raids' },
      { id: 'stargate-npc-races', label: '27 Stargate Alien Races' },
      { id: 'hyperspace-systems', label: 'Hyperspace & Motherships' },
      { id: 'expeditions', label: 'Deep Space Expeditions' },
      { id: 'space-stations', label: 'Orbital Starbases' },
    ],
  },
  {
    id: 'industry',
    label: 'Industry & Upgrades',
    icon: '⚙',
    items: [
      { id: 'master-upgrades', label: '🏛️ Master Upgrades Hub' },
      { id: 'storage-upgrades', label: '📦 Resource Storage Silos' },
      { id: 'aic-system', label: '🏭 Automated Industry (AIC)' },
      { id: 'power-grid', label: '⚡ Power Grid Systems' },
      { id: 'factories', label: 'Factories & Mines' },
      { id: 'defenses', label: 'Planetary Defenses' },
      { id: 'megastructures', label: 'Stellar Megastructures' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: '◎',
    items: [
      { id: 'spy-log', label: 'Spy Log' },
      { id: 'enemy-intelligence', label: 'Enemy Intelligence' },
      { id: 'intel-codex', label: 'Strategic Intel Codex' },
    ],
  },
  {
    id: 'market',
    label: 'Market',
    icon: '¤',
    items: [
      { id: 'resource-exchange', label: 'Resource Exchange' },
      { id: 'mercenary-market', label: 'Mercenary Market' },
      { id: 'bank-vault', label: 'Imperial Bank & Vault' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: '♧',
    items: [
      { id: 'diplomacy', label: 'Diplomacy & Treaties' },
      { id: 'galactic-news', label: 'Holonet News Network' },
      { id: 'mmorpg-ogame', label: 'MMORPG Guilds & Raids' },
      { id: 'rankings', label: 'Rankings' },
      { id: 'alliances', label: 'Alliances' },
      { id: 'messages', label: 'Messages' },
    ],
  },
  {
    id: 'planets',
    label: 'Planets',
    icon: '○',
    items: [
      { id: 'planet-list', label: 'Colonial World Nexus' },
      { id: 'life-support', label: '🌾 Food & Water Systems' },
      { id: 'population', label: '👥 Population & Rationing' },
      { id: 'hazards', label: '⚠️ Planetary Hazards' },
      { id: 'colonial-plunge', label: '📉 Colonial Plunge System' },
      { id: 'stellar-encyclopedia', label: 'A-Z Planetary Encyclopedia' },
      { id: 'planet-bonuses', label: 'Bonuses & Governance' },
      { id: 'planet-defenses', label: 'Defenses Grid' },
      { id: 'planet-power', label: 'Planetary Power Grid' },
      { id: 'moon-bases', label: 'Moon Bases & Phalanxes' },
    ],
  },
  {
    id: 'mothership',
    label: 'Mothership',
    icon: '△',
    items: [
      { id: 'ship', label: 'Ship Overview' },
      { id: 'modules', label: 'Modules' },
      { id: 'exploration', label: 'Exploration' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Systems',
    icon: '👑',
    items: [
      { id: 'admin-dashboard', label: 'Admin Control Panel' },
      { id: 'admin-universe', label: 'Universe & Physics Config' },
      { id: 'admin-users', label: 'Player Accounts & Inspector' },
      { id: 'admin-crown', label: 'Imperial Crown & Decrees' },
      { id: 'admin-bans', label: 'Bans & Sanctions Registry' },
      { id: 'admin-planets', label: 'Planets & Moon Spawner' },
      { id: 'admin-fleets', label: 'Fleet Radar & Interception' },
      { id: 'admin-debris', label: 'Galaxy Debris & Spatial' },
      { id: 'admin-tickets', label: 'Support Ticket Desk' },
      { id: 'admin-security', label: 'Anti-Cheat & Multi-IP Logs' },
      { id: 'admin-events', label: 'Global Events & Happy Hour' },
      { id: 'admin-cheats', label: 'God Mode & Grants Console' },
      { id: 'admin-operations', label: 'Server Ops & Modifiers' },
      { id: 'cron-jobs', label: 'Cron Scheduler' },
      { id: 'cron-logs', label: 'Execution & Ops Logs' },
      { id: 'cron-cli', label: 'Server Crontab CLI' },
      { id: 'admin-maintenance', label: 'Database & Season Reset' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Heritage',
    icon: '◌',
    items: [
      { id: 'account-profiles', label: 'Multi-Account Profiles' },
      { id: 'race', label: 'Race & Faction' },
      { id: 'vacation', label: 'Sanctuary Shield' },
      { id: 'ascension', label: 'Ascension' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  profile,
  openGroups,
  onToggleGroup,
  soundEnabled,
  onToggleSound,
  onLogout,
}) => {
  const currentRace: Race | undefined = RACES.find((r) => r.id === profile.race);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-white border-r border-[#dedede] flex flex-col shrink-0 min-h-screen select-none"
    >
      {/* Brand Header */}
      <div
        id="sidebar-brand"
        className="h-20 border-b border-[#dedede] px-4 flex items-center gap-3 cursor-pointer"
        onClick={() => {
          sound.play('click');
          onNavigate('dashboard');
        }}
      >
        <div className="w-8 h-8 bg-[#111111] text-white font-bold flex items-center justify-center text-sm tracking-wider">
          S
        </div>
        <div>
          <strong className="block text-xs font-bold tracking-wider text-[#111111] uppercase leading-tight">
            Universe Civilization
          </strong>
          <small className="block text-[9px] text-[#777777] font-semibold tracking-widest uppercase">
            Empire at Wars
          </small>
        </div>
      </div>

      {/* Commander Profile Chip */}
      <div
        id="sidebar-profile-box"
        className="m-3 p-3 border border-[#dedede] bg-[#fafafa] flex items-center gap-3 cursor-pointer hover:border-[#111111] transition-colors"
        onClick={() => {
          sound.play('click');
          onNavigate('account-info');
        }}
      >
        <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
          {getInitials(profile.displayName)}
        </div>
        <div className="overflow-hidden">
          <strong className="block text-xs font-bold text-[#111111] truncate">
            {profile.displayName}
          </strong>
          <span className="block text-[11px] text-[#666666] truncate">
            {currentRace?.name || "Tau'ri"} realm · Rank {profile.rankLevel}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        <div className="px-3 py-1.5 text-[9px] font-bold text-[#888888] tracking-[1.5px] uppercase">
          Navigation
        </div>

        {NAV_SECTIONS.map((sec) => {
          const isOpen = !!openGroups[sec.id];
          const hasActiveChild = sec.items.some((item) => item.id === activeRoute);

          return (
            <div key={sec.id} className="mb-0.5">
              <button
                type="button"
                id={`nav-group-btn-${sec.id}`}
                onClick={() => {
                  sound.play('click');
                  onToggleGroup(sec.id);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors border-l-2 ${
                  hasActiveChild
                    ? 'border-[#111111] font-semibold text-[#111111] bg-[#f5f5f5]'
                    : 'border-transparent text-[#333333] hover:bg-[#f5f5f5] hover:text-[#111111]'
                }`}
              >
                <span className="w-4 text-center text-[#555555] font-serif">{sec.icon}</span>
                <span className="flex-1 truncate">{sec.label}</span>
                <span
                  className={`text-xs text-[#888888] transform transition-transform duration-150 ${
                    isOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="pl-7 pr-1 py-1 space-y-0.5">
                  {sec.items.map((item) => {
                    const isCurrent = activeRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`subnav-item-${item.id}`}
                        onClick={() => {
                          sound.play('click');
                          onNavigate(item.id);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-[11px] block truncate border-l transition-colors ${
                          isCurrent
                            ? 'border-[#111111] text-[#111111] font-bold bg-[#f0f0f0]'
                            : 'border-[#dedede] text-[#666666] hover:text-[#111111] hover:border-[#111111] hover:bg-[#fafafa]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div id="sidebar-footer" className="border-t border-[#dedede] p-4 bg-white text-xs text-[#444444] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#111111] animate-pulse" />
            <span className="text-[11px] font-medium text-[#222222]">Systems operational</span>
          </div>
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="text-[#666666] hover:text-[#111111] p-1 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
        <div className="text-[10px] text-[#888888]">Turn cycle: 30 minutes</div>

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            id="sidebar-logout-btn"
            onClick={() => {
              sound.play('click');
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono font-bold text-[#b91c1c] border border-[#fecaca] bg-[#fef2f2] hover:bg-[#b91c1c] hover:text-white transition-colors cursor-pointer"
            title="Log out of commander realm"
          >
            <LogOut size={13} />
            <span>LOGOUT</span>
          </button>
        )}
      </div>
    </aside>
  );
};
