import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Zap,
  RotateCw,
  Server,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Clock,
  Play,
  Pause,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Megaphone,
  Radio,
  Sparkles,
  Layers,
  Wrench,
  Flame,
  Rocket,
  Atom,
  Database,
  Globe,
  DollarSign,
  TrendingUp,
  Crosshair,
  Lock,
  Unlock,
  Users,
  Ban,
  Moon,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../sound';
import {
  ImperialDecree,
  AdminWorldModifier,
  AdminServerSettings,
  CronJob,
  CronExecutionLog,
  CronConfig,
  CronJobId,
  PlayerResources,
  PlayerProfile,
  FactoryQueueItem,
  ResearchQueueItem,
  ShipyardQueueItem,
  OGameUniverseConfig,
  AdminUserAccount,
  AdminBanRecord,
  AdminPlanetEntry,
  AdminFleetMission,
  AdminDebrisField,
  AdminSupportTicket,
  AdminSecurityAlert,
  AdminGlobalEvent,
} from '../../types';
import {
  DEFAULT_OGAME_UNIVERSE_CONFIG,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_BANS,
  INITIAL_ADMIN_PLANETS,
  INITIAL_ADMIN_FLEET_MISSIONS,
  INITIAL_ADMIN_DEBRIS_FIELDS,
  INITIAL_ADMIN_SUPPORT_TICKETS,
  INITIAL_ADMIN_SECURITY_ALERTS,
  INITIAL_ADMIN_GLOBAL_EVENTS,
} from '../../data/ogameAdminData';
import { AdminUniverseConfigTab } from './admin/AdminUniverseConfigTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminBansTab } from './admin/AdminBansTab';
import { AdminPlanetsTab } from './admin/AdminPlanetsTab';
import { AdminFleetsTab } from './admin/AdminFleetsTab';
import { AdminDebrisSpatialTab } from './admin/AdminDebrisSpatialTab';
import { AdminTicketsTab } from './admin/AdminTicketsTab';
import { AdminSecurityAuditTab } from './admin/AdminSecurityAuditTab';
import { AdminGlobalEventsTab } from './admin/AdminGlobalEventsTab';
import { AdminMaintenanceTab } from './admin/AdminMaintenanceTab';

export type AdminTabType =
  | 'crown'
  | 'universe'
  | 'users'
  | 'bans'
  | 'planets'
  | 'fleets'
  | 'debris'
  | 'tickets'
  | 'security'
  | 'events'
  | 'cheats'
  | 'operations'
  | 'scheduler'
  | 'logs'
  | 'cli'
  | 'maintenance';

interface AdminControlPanelViewProps {
  initialTab?: AdminTabType;
  profile: PlayerProfile;
  resources: PlayerResources;
  decrees: ImperialDecree[];
  worldModifiers: AdminWorldModifier[];
  serverSettings: AdminServerSettings;
  cronJobs: CronJob[];
  cronLogs: CronExecutionLog[];
  cronConfig: CronConfig;
  nextTickSeconds: number;
  grossIncome?: number;
  netIncome?: number;
  upkeepTotal?: number;
  factoryQueue?: FactoryQueueItem[];
  researchQueue?: ResearchQueueItem[];
  shipyardQueue?: ShipyardQueueItem[];

  // OGame Clone Admin Systems Data
  universeConfig?: OGameUniverseConfig;
  adminUsers?: AdminUserAccount[];
  adminBans?: AdminBanRecord[];
  adminPlanets?: AdminPlanetEntry[];
  adminFleetMissions?: AdminFleetMission[];
  adminDebrisFields?: AdminDebrisField[];
  adminSupportTickets?: AdminSupportTicket[];
  adminSecurityAlerts?: AdminSecurityAlert[];
  adminGlobalEvents?: AdminGlobalEvent[];

  onUpdateResources: (updates: Partial<PlayerResources>) => void;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onToggleDecree: (decreeId: string) => void;
  onAddDecree: (decree: ImperialDecree) => void;
  onUpdateWorldModifier: (modifierId: string, value: number) => void;
  onUpdateServerSettings: (settings: Partial<AdminServerSettings>) => void;
  onInstantFinishBuildings: () => void;
  onInstantFinishResearch: () => void;
  onInstantFinishShipyard: () => void;
  onUnlockAllTechs: () => void;
  onSpawnArmada: () => void;
  onRunCronJob: (jobId: CronJobId) => void;
  onRunAllCronJobs: () => void;
  onToggleCronJob: (jobId: CronJobId) => void;
  onUpdateCronConfig: (config: Partial<CronConfig>) => void;
  onClearCronLogs?: () => void;
  onClearLogs?: () => void;
  onExportState: () => string;
  onImportState: (json: string) => boolean;
  onFactoryReset: () => void;
  onBroadcastMessage: (message: string) => void;

  // OGame Clones Admin Systems Handlers
  onUpdateUniverseConfig?: (updates: Partial<OGameUniverseConfig>) => void;
  onUpdateAdminUser?: (userId: string, updates: Partial<AdminUserAccount>) => void;
  onBanUser?: (ban: AdminBanRecord) => void;
  onUnbanUser?: (banId: string) => void;
  onUpdatePlanet?: (planetId: string, updates: Partial<AdminPlanetEntry>) => void;
  onSpawnMoon?: (planetId: string, moonName: string, diameter: number) => void;
  onTerraformPlanet?: (planetId: string, extraFields: number) => void;
  onRecallFleetMission?: (missionId: string) => void;
  onTeleportFleetMission?: (missionId: string) => void;
  onSpawnDebris?: (coords: string, metal: number, crystal: number) => void;
  onClearDebris?: (debrisId: string) => void;
  onClearAllDebris?: () => void;
  onReplySupportTicket?: (ticketId: string, message: string) => void;
  onUpdateTicketStatus?: (ticketId: string, status: AdminSupportTicket['status']) => void;
  onResolveSecurityAlert?: (alertId: string) => void;
  onToggleGlobalEvent?: (eventId: string) => void;
  onRecalculateHighscores?: () => void;
  onPurgeInactives?: () => void;
  onFlushCache?: () => void;
  onResetUniverseSeason?: () => void;
}

export const AdminControlPanelView: React.FC<AdminControlPanelViewProps> = ({
  initialTab = 'crown',
  profile,
  resources,
  decrees,
  worldModifiers,
  serverSettings,
  cronJobs,
  cronLogs,
  cronConfig,
  nextTickSeconds,
  grossIncome,
  netIncome,
  upkeepTotal,
  factoryQueue = [],
  researchQueue = [],
  shipyardQueue = [],
  universeConfig = DEFAULT_OGAME_UNIVERSE_CONFIG,
  adminUsers = INITIAL_ADMIN_USERS,
  adminBans = INITIAL_ADMIN_BANS,
  adminPlanets = INITIAL_ADMIN_PLANETS,
  adminFleetMissions = INITIAL_ADMIN_FLEET_MISSIONS,
  adminDebrisFields = INITIAL_ADMIN_DEBRIS_FIELDS,
  adminSupportTickets = INITIAL_ADMIN_SUPPORT_TICKETS,
  adminSecurityAlerts = INITIAL_ADMIN_SECURITY_ALERTS,
  adminGlobalEvents = INITIAL_ADMIN_GLOBAL_EVENTS,
  onUpdateResources,
  onUpdateProfile,
  onToggleDecree,
  onAddDecree,
  onUpdateWorldModifier,
  onUpdateServerSettings,
  onInstantFinishBuildings,
  onInstantFinishResearch,
  onInstantFinishShipyard,
  onUnlockAllTechs,
  onSpawnArmada,
  onRunCronJob,
  onRunAllCronJobs,
  onToggleCronJob,
  onUpdateCronConfig,
  onClearCronLogs,
  onClearLogs,
  onExportState,
  onImportState,
  onFactoryReset,
  onBroadcastMessage,
  onUpdateUniverseConfig = () => {},
  onUpdateAdminUser = () => {},
  onBanUser = () => {},
  onUnbanUser = () => {},
  onUpdatePlanet = () => {},
  onSpawnMoon = () => {},
  onTerraformPlanet = () => {},
  onRecallFleetMission = () => {},
  onTeleportFleetMission = () => {},
  onSpawnDebris = () => {},
  onClearDebris = () => {},
  onClearAllDebris = () => {},
  onReplySupportTicket = () => {},
  onUpdateTicketStatus = () => {},
  onResolveSecurityAlert = () => {},
  onToggleGlobalEvent = () => {},
  onRecalculateHighscores = () => {},
  onPurgeInactives = () => {},
  onFlushCache = () => {},
  onResetUniverseSeason = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab);
  const [banPromptUser, setBanPromptUser] = useState<AdminUserAccount | null>(null);
  const [broadcastInput, setBroadcastInput] = useState(serverSettings.globalBroadcastMessage);
  const [importJson, setImportJson] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customGrantAmount, setCustomGrantAmount] = useState<number>(1000000);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [newDecreeTitle, setNewDecreeTitle] = useState('');
  const [newDecreeDesc, setNewDecreeDesc] = useState('');
  const [newDecreeEffect, setNewDecreeEffect] = useState('');
  const [newDecreeMultiplier, setNewDecreeMultiplier] = useState(1.5);
  const [newDecreeCategory, setNewDecreeCategory] = useState<'economic' | 'military' | 'science' | 'expansion' | 'divine'>('divine');
  const [showNewDecreeForm, setShowNewDecreeForm] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.play('confirm');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyBroadcast = () => {
    if (!broadcastInput.trim()) return;
    onBroadcastMessage(broadcastInput);
    onUpdateServerSettings({
      globalBroadcastMessage: broadcastInput,
      globalBroadcastActive: true,
    });
    sound.play('confirm');
  };

  const handleCreateCustomDecree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecreeTitle.trim() || !newDecreeDesc.trim()) return;
    const newDecree: ImperialDecree = {
      id: `custom_decree_${Date.now()}`,
      title: newDecreeTitle.trim(),
      codename: `IMPERIAL-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      category: newDecreeCategory,
      description: newDecreeDesc.trim(),
      effectSummary: newDecreeEffect.trim() || `+${Math.round((newDecreeMultiplier - 1) * 100)}% Realm Effectiveness`,
      multiplier: Number(newDecreeMultiplier),
      active: true,
      costDarkMatter: 0,
      icon: '👑',
      durationMinutes: 1440,
      activatedAt: new Date().toISOString(),
    };
    onAddDecree(newDecree);
    setNewDecreeTitle('');
    setNewDecreeDesc('');
    setNewDecreeEffect('');
    setShowNewDecreeForm(false);
    sound.play('confirm');
  };

  const activeDecreesCount = decrees.filter((d) => d.active).length;
  const activeJobsCount = cronJobs.filter((j) => j.enabled).length;

  const totalQueuedItems = factoryQueue.length + researchQueue.length + shipyardQueue.length;

  return (
    <div id="admin-control-panel" className="space-y-6">
      {/* Grand Sovereign Master Header */}
      <div className="border-2 border-[#111111] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold tracking-widest uppercase">
                <Crown size={12} className="text-amber-400" />
                SOVEREIGN LEVEL 10 · ROOT ACCESS
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                Host: <strong className="text-[#111111]">{serverSettings.serverName}</strong>
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2">
              <span>Admin Control Panel Systems</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 border border-[#111111] bg-[#f5f5f5] text-[#111111]">
                v4.8 SUPREME
              </span>
            </h1>
            <p className="text-xs text-[#555555] mt-1 max-w-3xl leading-relaxed">
              Galactic sovereign administration mainframe. Manage the Imperial Crown of Sovereignty, issue galaxy-wide
              imperial decrees, execute instant resource and fleet grants, control the real-time cron engine, and conduct
              server operations.
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 border border-[#dedede] bg-[#fafafa] flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <div>
                <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider">Cron Daemons</div>
                <div className="text-xs font-mono font-bold text-[#111111]">{activeJobsCount} / {cronJobs.length} Active</div>
              </div>
            </div>

            <div className="px-3 py-2 border border-[#dedede] bg-[#fafafa] flex items-center gap-2">
              <Crown size={16} className="text-amber-600" />
              <div>
                <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider">Crown Edicts</div>
                <div className="text-xs font-mono font-bold text-[#111111]">{activeDecreesCount} Active</div>
              </div>
            </div>

            <div className="px-3 py-2 border border-[#dedede] bg-[#fafafa] flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" />
              <div>
                <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider">Turn Heartbeat</div>
                <div className="text-xs font-mono font-bold text-[#111111]">
                  {cronConfig.autoTickEnabled ? `00:${nextTickSeconds.toString().padStart(2, '0')}` : 'PAUSED'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Broadcast Ticker Bar */}
        {serverSettings.globalBroadcastActive && serverSettings.globalBroadcastMessage && (
          <div className="mt-4 p-2.5 bg-[#111111] text-white flex items-center justify-between text-xs font-mono border-l-4 border-amber-400">
            <div className="flex items-center gap-2 overflow-hidden">
              <Megaphone size={14} className="text-amber-400 shrink-0 animate-bounce" />
              <span className="font-bold text-amber-400 shrink-0">IMPERIAL BROADCAST:</span>
              <span className="truncate">{serverSettings.globalBroadcastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateServerSettings({ globalBroadcastActive: false })}
              className="text-[10px] text-[#aaaaaa] hover:text-white px-1.5 py-0.5 border border-[#444444] cursor-pointer shrink-0 ml-2"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-1 border-b border-[#dedede] pb-2">
          {/* 1. Crown */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('crown');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'crown'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Crown size={14} className={activeTab === 'crown' ? 'text-amber-400' : 'text-amber-600'} />
            <span>Crown & Decrees</span>
            {activeDecreesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-[#111111] text-[10px] font-bold rounded-full">
                {activeDecreesCount}
              </span>
            )}
          </button>

          {/* 2. Universe Config */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('universe');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'universe'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Sliders size={14} className={activeTab === 'universe' ? 'text-amber-400' : 'text-amber-600'} />
            <span>Universe Config</span>
          </button>

          {/* 3. Player Accounts */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('users');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Users size={14} className={activeTab === 'users' ? 'text-sky-400' : 'text-sky-600'} />
            <span>Players ({adminUsers.length})</span>
          </button>

          {/* 4. Bans & Sanctions */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('bans');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'bans'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Ban size={14} className={activeTab === 'bans' ? 'text-red-400' : 'text-red-600'} />
            <span>Bans & Sanctions</span>
            {adminBans.filter((b) => b.active).length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                {adminBans.filter((b) => b.active).length}
              </span>
            )}
          </button>

          {/* 5. Planets & Moons */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('planets');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'planets'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Globe size={14} className={activeTab === 'planets' ? 'text-emerald-400' : 'text-emerald-600'} />
            <span>Planets & Moons</span>
          </button>

          {/* 6. Fleet Radar */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('fleets');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'fleets'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Rocket size={14} className={activeTab === 'fleets' ? 'text-red-400' : 'text-red-600'} />
            <span>Fleet Radar</span>
            {adminFleetMissions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                {adminFleetMissions.length}
              </span>
            )}
          </button>

          {/* 7. Debris Fields */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('debris');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'debris'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'debris' ? 'text-amber-400' : 'text-amber-600'} />
            <span>Galaxy Debris</span>
          </button>

          {/* 8. Tickets */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('tickets');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <MessageSquare size={14} className={activeTab === 'tickets' ? 'text-sky-400' : 'text-sky-600'} />
            <span>Support Desk</span>
            {adminSupportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length > 0 && (
              <span className="px-1.5 py-0.2 bg-sky-600 text-white text-[10px] font-bold rounded-full">
                {adminSupportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
              </span>
            )}
          </button>

          {/* 9. Security & Anti-Cheat */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('security');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <ShieldAlert size={14} className={activeTab === 'security' ? 'text-purple-400' : 'text-purple-600'} />
            <span>Anti-Cheat Logs</span>
            {adminSecurityAlerts.filter((a) => !a.resolved).length > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-600 text-white text-[10px] font-bold rounded-full">
                {adminSecurityAlerts.filter((a) => !a.resolved).length}
              </span>
            )}
          </button>

          {/* 10. Global Events */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('events');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Flame size={14} className={activeTab === 'events' ? 'text-amber-400' : 'text-amber-600'} />
            <span>Global Events</span>
            {adminGlobalEvents.filter((e) => e.active).length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-[#111111] text-[10px] font-bold rounded-full">
                {adminGlobalEvents.filter((e) => e.active).length}
              </span>
            )}
          </button>

          {/* 11. Cheats / God Mode */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('cheats');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'cheats'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Zap size={14} className={activeTab === 'cheats' ? 'text-yellow-400' : 'text-yellow-600'} />
            <span>God Mode Console</span>
            {totalQueuedItems > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                {totalQueuedItems} Q
              </span>
            )}
          </button>

          {/* 12. Server Ops */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('operations');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'operations'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Wrench size={14} className={activeTab === 'operations' ? 'text-indigo-400' : 'text-indigo-600'} />
            <span>Server Ops</span>
          </button>

          {/* 13. Scheduler */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('scheduler');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'scheduler'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Clock size={14} className={activeTab === 'scheduler' ? 'text-emerald-400' : 'text-emerald-600'} />
            <span>Scheduler ({cronJobs.length})</span>
          </button>

          {/* 14. Execution Logs */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('logs');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Terminal size={14} />
            <span>Logs ({cronLogs.length})</span>
          </button>

          {/* 15. CLI */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('cli');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Server size={14} />
            <span>CLI Crontab</span>
          </button>

          {/* 16. Universe Maintenance */}
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('maintenance');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-[#111111] text-white shadow'
                : 'bg-white text-[#555555] hover:bg-[#f5f5f5] hover:text-[#111111] border border-[#dedede]'
            }`}
          >
            <Database size={14} className={activeTab === 'maintenance' ? 'text-rose-400' : 'text-rose-600'} />
            <span>Database & Reset</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OGAME CLONE ADMIN TABS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'universe' && (
        <AdminUniverseConfigTab
          universeConfig={universeConfig}
          onUpdateUniverseConfig={onUpdateUniverseConfig}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab
          users={adminUsers}
          onUpdateUser={onUpdateAdminUser}
          onBanUserPrompt={(user) => {
            setBanPromptUser(user);
            setActiveTab('bans');
          }}
        />
      )}

      {activeTab === 'bans' && (
        <AdminBansTab
          bans={adminBans}
          users={adminUsers}
          currentAdminName={profile.displayName || profile.username || 'SuperAdmin_Archon'}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
          prefillUser={banPromptUser}
        />
      )}

      {activeTab === 'planets' && (
        <AdminPlanetsTab
          planets={adminPlanets}
          onUpdatePlanet={onUpdatePlanet}
          onSpawnMoon={onSpawnMoon}
          onTerraformPlanet={onTerraformPlanet}
        />
      )}

      {activeTab === 'fleets' && (
        <AdminFleetsTab
          fleetMissions={adminFleetMissions}
          onRecallMission={onRecallFleetMission}
          onTeleportMission={onTeleportFleetMission}
        />
      )}

      {activeTab === 'debris' && (
        <AdminDebrisSpatialTab
          debrisFields={adminDebrisFields}
          onSpawnDebris={onSpawnDebris}
          onClearDebris={onClearDebris}
          onClearAllDebris={onClearAllDebris}
        />
      )}

      {activeTab === 'tickets' && (
        <AdminTicketsTab
          tickets={adminSupportTickets}
          currentAdminName={profile.displayName || profile.username || 'SuperAdmin_Archon'}
          onReplyTicket={onReplySupportTicket}
          onUpdateTicketStatus={onUpdateTicketStatus}
        />
      )}

      {activeTab === 'security' && (
        <AdminSecurityAuditTab
          alerts={adminSecurityAlerts}
          onResolveAlert={onResolveSecurityAlert}
          onQuickBanUser={(username, reason) => {
            const now = new Date();
            const exp = new Date();
            exp.setDate(now.getDate() + 7);
            onBanUser({
              id: `ban-${Date.now()}`,
              userId: `user-${username}`,
              username,
              adminName: profile.displayName || profile.username || 'AntiCheat Daemon',
              reason,
              banType: 'attack_lock',
              ipAddress: '198.51.100.99',
              issuedAt: now.toISOString(),
              expiresAt: exp.toISOString(),
              isPermanent: false,
              active: true,
            });
          }}
        />
      )}

      {activeTab === 'events' && (
        <AdminGlobalEventsTab
          events={adminGlobalEvents}
          onToggleEvent={onToggleGlobalEvent}
        />
      )}

      {activeTab === 'maintenance' && (
        <AdminMaintenanceTab
          onRecalculateHighscores={onRecalculateHighscores}
          onPurgeInactives={onPurgeInactives}
          onFlushCache={onFlushCache}
          onResetUniverseSeason={onResetUniverseSeason}
          onExportState={onExportState}
          onImportState={onImportState}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: IMPERIAL CROWN OF SOVEREIGNTY & DECREES                           */}
      {/* ========================================================================= */}
      {activeTab === 'crown' && (
        <div id="admin-tab-crown" className="space-y-6">
          {/* Sovereign Throne Card */}
          <div className="border border-[#111111] bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#111111] text-white p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
              <Crown size={240} className="text-amber-300" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-[#111111] text-xs font-mono font-extrabold uppercase tracking-wider">
                  <Crown size={14} />
                  THRONE OF THE GALACTIC EMPEROR
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  Crown of Imperial Sovereignty
                </h2>
                <p className="text-xs text-[#cccccc] max-w-2xl leading-relaxed">
                  As Supreme Ruler of the Universe Realm, your decrees override planetary physics and empire law.
                  Enact imperial edicts below to grant empire-wide multipliers for mining yields, fleet speed,
                  technological breakthroughs, and divine defense sanctuaries.
                </p>
              </div>

              <div className="bg-[#111111]/80 border border-amber-400/40 p-4 shrink-0 min-w-[260px]">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-1">
                  SOVEREIGN AUTHORITY
                </div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Grand Emperor {profile.displayName || profile.username}</span>
                </div>
                <div className="mt-2 text-xs font-mono text-[#bbbbbb] space-y-1">
                  <div>Rank: <strong className="text-amber-400">Archon Supreme</strong></div>
                  <div>Empire ID: <strong className="text-white">#0001-ALPHA</strong></div>
                  <div>Decree Power: <strong className="text-emerald-400">UNLIMITED</strong></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewDecreeForm(!showNewDecreeForm)}
                  className="mt-3 w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-[#111111] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>{showNewDecreeForm ? 'Close Edict Studio' : 'Author Custom Decree'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Decree Creation Form */}
          {showNewDecreeForm && (
            <form
              onSubmit={handleCreateCustomDecree}
              className="border-2 border-amber-400 bg-amber-50/40 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-[#111111] flex items-center gap-2">
                  <Crown size={15} className="text-amber-600" />
                  <span>AUTHOR NEW IMPERIAL EDICT</span>
                </h3>
                <span className="text-xs text-[#666666]">Imperial Gazette Authorization Console</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#333333] mb-1">
                    Edict Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newDecreeTitle}
                    onChange={(e) => setNewDecreeTitle(e.target.value)}
                    placeholder="e.g., Edict of Endless Stars"
                    className="w-full px-3 py-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#333333] mb-1">
                    Category
                  </label>
                  <select
                    value={newDecreeCategory}
                    onChange={(e) => setNewDecreeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] outline-none"
                  >
                    <option value="divine">👑 Divine Sovereign</option>
                    <option value="economic">💎 Economic Synthesis</option>
                    <option value="military">⚔️ Military Blitz</option>
                    <option value="science">🌌 Stargate & Science</option>
                    <option value="expansion">🚀 Warp & Deep Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#333333] mb-1">
                    Power Multiplier ({newDecreeMultiplier}x)
                  </label>
                  <input
                    type="range"
                    min="1.1"
                    max="5.0"
                    step="0.1"
                    value={newDecreeMultiplier}
                    onChange={(e) => setNewDecreeMultiplier(parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#333333] mb-1">
                    Description / Lore
                  </label>
                  <input
                    type="text"
                    required
                    value={newDecreeDesc}
                    onChange={(e) => setNewDecreeDesc(e.target.value)}
                    placeholder="Imperial edict mandating hyperdrive energy redirection..."
                    className="w-full px-3 py-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#333333] mb-1">
                    Effect Summary Text
                  </label>
                  <input
                    type="text"
                    value={newDecreeEffect}
                    onChange={(e) => setNewDecreeEffect(e.target.value)}
                    placeholder="e.g., +100% Warp Travel Speed, -50% Energy Costs"
                    className="w-full px-3 py-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDecreeForm(false)}
                  className="px-4 py-2 border border-[#cccccc] bg-white text-xs font-mono hover:bg-[#eeeeee] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] text-white text-xs font-mono font-bold hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  Enact Imperial Decree
                </button>
              </div>
            </form>
          )}

          {/* Imperial Decrees Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#dedede] pb-2">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Imperial Decrees of the Sovereign Realm</h3>
                <p className="text-xs text-[#666666]">Toggle any decree to instantly enact or repeal imperial edicts.</p>
              </div>
              <span className="text-xs font-mono text-[#888888]">
                {decrees.length} Edicts in Imperial Registry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decrees.map((decree) => {
                return (
                  <div
                    key={decree.id}
                    id={`decree-card-${decree.id}`}
                    className={`border p-5 flex flex-col justify-between transition-all ${
                      decree.active
                        ? 'border-[#111111] bg-white shadow-md ring-2 ring-amber-400/40'
                        : 'border-[#e0e0e0] bg-[#fafafa] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{decree.icon}</span>
                          <div>
                            <span className="text-[10px] font-mono text-[#888888] tracking-widest uppercase">
                              {decree.codename}
                            </span>
                            <h4 className="text-sm font-bold text-[#111111] leading-tight">
                              {decree.title}
                            </h4>
                          </div>
                        </div>

                        {decree.active ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                            ENACTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#eaeaea] text-[#777777] text-[10px] font-mono border border-[#cccccc]">
                            DORMANT
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#666666] leading-relaxed mb-3">
                        {decree.description}
                      </p>

                      {/* Effect Box */}
                      <div className="p-2.5 bg-[#f0f0f0] border border-[#e0e0e0] text-xs font-mono text-[#111111] mb-4">
                        <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider mb-0.5">
                          EFFECT APPLIED:
                        </div>
                        <div className="font-bold text-amber-900">{decree.effectSummary}</div>
                      </div>
                    </div>

                    {/* Action Toggle Button */}
                    <button
                      type="button"
                      id={`toggle-decree-${decree.id}`}
                      onClick={() => {
                        sound.play('confirm');
                        onToggleDecree(decree.id);
                      }}
                      className={`w-full py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        decree.active
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-[#111111] hover:bg-amber-600 text-white'
                      }`}
                    >
                      {decree.active ? (
                        <>
                          <Lock size={13} />
                          <span>REPEAL DECREE</span>
                        </>
                      ) : (
                        <>
                          <Crown size={13} className="text-amber-400" />
                          <span>ENACT DECREE</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GOD MODE & CHEAT GRANTS CONSOLE                                    */}
      {/* ========================================================================= */}
      {activeTab === 'cheats' && (
        <div id="admin-tab-cheats" className="space-y-6">
          {/* Quick Grant Console */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#dedede] pb-3 mb-4">
              <div>
                <div className="text-[9px] font-bold text-yellow-600 tracking-[1.5px] uppercase">
                  INSTANT SOVEREIGN INJECTION
                </div>
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Zap size={18} className="text-yellow-500" />
                  <span>Imperial Resource & Energy Grant Console</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-[#888888]">
                Bypasses all natural resource limits
              </span>
            </div>

            {/* Current Resources Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Metal</div>
                <div className="text-base font-mono font-bold text-[#111111]">{resources.metal.toLocaleString()}</div>
              </div>
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Crystal</div>
                <div className="text-base font-mono font-bold text-sky-700">{resources.crystal.toLocaleString()}</div>
              </div>
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Deuterium</div>
                <div className="text-base font-mono font-bold text-emerald-700">{resources.deuterium.toLocaleString()}</div>
              </div>
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Energy</div>
                <div className="text-base font-mono font-bold text-yellow-700">{resources.energy.toLocaleString()}</div>
              </div>
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Dark Matter</div>
                <div className="text-base font-mono font-bold text-purple-700">{(resources.darkMatter ?? 0).toLocaleString()}</div>
              </div>
              <div className="p-3 border border-[#dedede] bg-[#fdfdfd]">
                <div className="text-[10px] text-[#777777] uppercase font-bold">Naquadah</div>
                <div className="text-base font-mono font-bold text-amber-700">{resources.naquadah.toLocaleString()}</div>
              </div>
            </div>

            {/* One-Click Quick Injections */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#333333]">
                1-CLICK MEGA BATCH GRANTS:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUpdateResources({
                      metal: resources.metal + 10000000,
                      crystal: resources.crystal + 10000000,
                      deuterium: resources.deuterium + 5000000,
                    });
                  }}
                  className="p-3 border border-[#111111] bg-[#111111] text-white hover:bg-amber-600 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <DollarSign size={16} />
                  <span>+10M All Primary Resources</span>
                  <span className="text-[10px] text-[#cccccc] font-normal">Metal, Crystal & Deuterium</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUpdateResources({
                      darkMatter: (resources.darkMatter ?? 0) + 50000,
                      naquadah: resources.naquadah + 10000000,
                    });
                  }}
                  className="p-3 border border-purple-800 bg-purple-900 text-white hover:bg-purple-800 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Atom size={16} className="text-purple-300" />
                  <span>+50,000 Dark Matter & Naquadah</span>
                  <span className="text-[10px] text-purple-200 font-normal">Rare Cosmological Fuel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUpdateResources({
                      energy: resources.energy + 500000,
                    });
                  }}
                  className="p-3 border border-yellow-700 bg-yellow-600 text-white hover:bg-yellow-500 text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Zap size={16} />
                  <span>+500,000 Fusion Energy</span>
                  <span className="text-[10px] text-yellow-100 font-normal">Overcharge Planetary Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUpdateResources({
                      metal: 100000000,
                      crystal: 100000000,
                      deuterium: 100000000,
                      energy: 1000000,
                      darkMatter: 100000,
                      naquadah: 100000000,
                    });
                  }}
                  className="p-3 border border-amber-600 bg-amber-500 text-[#111111] hover:bg-amber-400 text-xs font-mono font-extrabold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Crown size={16} />
                  <span>EMPEROR MAX VAULT (100M)</span>
                  <span className="text-[10px] text-[#222222] font-normal">Cap All Currencies</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instant Construction, Research & Military Unlocks */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="border-b border-[#dedede] pb-3 mb-4">
              <div className="text-[9px] font-bold text-indigo-600 tracking-[1.5px] uppercase">
                TIMELINE BENDING OPERATIONS
              </div>
              <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <Flame size={18} className="text-indigo-600" />
                <span>Instant Construction, Tech Mastery & Armada Spawner</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Finish Buildings */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#111111]">Building Drydocks</span>
                    <span className="text-[10px] font-mono text-[#888888]">{factoryQueue.length} Active</span>
                  </div>
                  <p className="text-xs text-[#666666] mb-4">
                    Instantly completes all planetary mines, power plants, and defense towers under construction.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onInstantFinishBuildings();
                  }}
                  className="w-full py-2 bg-[#111111] hover:bg-indigo-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Instant Complete ({factoryQueue.length})
                </button>
              </div>

              {/* Finish Research */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#111111]">Laboratory Research</span>
                    <span className="text-[10px] font-mono text-[#888888]">{researchQueue.length} Active</span>
                  </div>
                  <p className="text-xs text-[#666666] mb-4">
                    Instantly breakthroughs all active science experiments and blueprint iterations in the labs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onInstantFinishResearch();
                  }}
                  className="w-full py-2 bg-[#111111] hover:bg-cyan-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Instant Complete ({researchQueue.length})
                </button>
              </div>

              {/* Finish Shipyard */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#111111]">Orbital Shipyard</span>
                    <span className="text-[10px] font-mono text-[#888888]">{shipyardQueue.length} Active</span>
                  </div>
                  <p className="text-xs text-[#666666] mb-4">
                    Instantly launches all combat vessels, titans, and defense arrays queued in the orbital gantries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onInstantFinishShipyard();
                  }}
                  className="w-full py-2 bg-[#111111] hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Instant Complete ({shipyardQueue.length})
                </button>
              </div>

              {/* Unlock All Master Techs */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between bg-amber-50/30">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-900">Master Tech Tree</span>
                    <span className="text-[10px] font-mono text-amber-800 font-bold">90+ Techs</span>
                  </div>
                  <p className="text-xs text-[#666666] mb-4">
                    Unlocks all technology branches: Graviton, Hyperspace, Nanite, Titan, and Plasma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUnlockAllTechs();
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Unlock All Techs
                </button>
              </div>
            </div>

            {/* Spawn Grand Armada */}
            <div className="mt-4 p-4 border border-[#111111] bg-[#fafafa] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Rocket size={24} className="text-[#111111]" />
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">Spawn Grand Imperial War Armada</h4>
                  <p className="text-xs text-[#666666]">
                    Instantly materialize 50 Battleships, 20 Battlecruisers, 10 Dreadnoughts, 5 Titans, and 500 Destroyers in orbit.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.play('confirm');
                  onSpawnArmada();
                }}
                className="px-6 py-2.5 bg-[#111111] text-white hover:bg-amber-600 text-xs font-mono font-bold transition-colors cursor-pointer shrink-0"
              >
                Spawn Armada Fleet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SERVER OPERATIONS & WORLD MODIFIERS                                */}
      {/* ========================================================================= */}
      {activeTab === 'operations' && (
        <div id="admin-tab-operations" className="space-y-6">
          {/* Global World Modifiers */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="border-b border-[#dedede] pb-3 mb-4 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                  UNIVERSE CALIBRATION
                </div>
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Sliders size={18} />
                  <span>Galactic World Modifiers & Speed Multipliers</span>
                </h3>
              </div>
              <span className="text-xs text-[#666666]">Scales dynamic balance across all sectors</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {worldModifiers.map((mod) => (
                <div key={mod.id} className="border border-[#e0e0e0] p-4 bg-[#fafafa] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111111]">{mod.name}</span>
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 bg-[#111111] text-white">
                      {mod.multiplier.toFixed(2)}{mod.unit}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">{mod.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#888888]">{mod.min}{mod.unit}</span>
                    <input
                      type="range"
                      min={mod.min}
                      max={mod.max}
                      step={mod.step}
                      value={mod.multiplier}
                      onChange={(e) => {
                        onUpdateWorldModifier(mod.id, parseFloat(e.target.value));
                      }}
                      className="w-full"
                    />
                    <span className="text-[10px] font-mono text-[#888888]">{mod.max}{mod.unit}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onUpdateWorldModifier(mod.id, mod.defaultValue)}
                      className="text-[10px] font-mono text-[#777777] hover:text-[#111111] underline cursor-pointer"
                    >
                      Reset ({mod.defaultValue}{mod.unit})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Announcement Console */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="border-b border-[#dedede] pb-3 mb-4">
              <div className="text-[9px] font-bold text-amber-600 tracking-[1.5px] uppercase">
                COMMUNICATIONS RELAY
              </div>
              <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <Megaphone size={18} className="text-amber-500" />
                <span>Publish Imperial Broadcast Announcement</span>
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={broadcastInput}
                onChange={(e) => setBroadcastInput(e.target.value)}
                placeholder="Type global announcement ticker message..."
                className="flex-1 px-4 py-2.5 border border-[#cccccc] bg-[#fdfdfd] text-xs font-mono focus:border-[#111111] outline-none"
              />
              <button
                type="button"
                onClick={handleApplyBroadcast}
                className="px-6 py-2.5 bg-[#111111] hover:bg-amber-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer shrink-0"
              >
                Broadcast to Galaxy
              </button>
            </div>
          </div>

          {/* Database Backup & Maintenance */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="border-b border-[#dedede] pb-3 mb-4">
              <div className="text-[9px] font-bold text-rose-600 tracking-[1.5px] uppercase">
                STATE PERSISTENCE & STORAGE
              </div>
              <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <Database size={18} className="text-rose-600" />
                <span>Save State Operations & Database Backup</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Export JSON */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#111111] mb-1">Export Realm JSON</h4>
                  <p className="text-xs text-[#666666] mb-3">
                    Download full game state including all fleet compositions, planetary buildings, tech, and economy.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const data = onExportState();
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `universe_empire_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    sound.play('confirm');
                  }}
                  className="w-full py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Save File</span>
                </button>
              </div>

              {/* Import JSON */}
              <div className="border border-[#e0e0e0] p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#111111] mb-1">Import Save State</h4>
                  <p className="text-xs text-[#666666] mb-3">
                    Paste raw game state JSON to restore a previous timeline or load testing scenarios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="w-full py-2 border border-[#111111] text-[#111111] hover:bg-[#f5f5f5] text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={13} />
                  <span>Open Import Dialog</span>
                </button>
              </div>

              {/* Factory Reset */}
              <div className="border border-rose-200 bg-rose-50/30 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-rose-900 mb-1">Factory Reset Database</h4>
                  <p className="text-xs text-[#666666] mb-3">
                    Clears all localStorage keys and re-seeds the default empire, technologies, and fleet rosters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Wipe & Reset Universe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CRON SCHEDULER & DAEMONS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'scheduler' && (
        <div id="admin-tab-scheduler" className="space-y-6">
          {/* Scheduler Engine Overview */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#dedede] pb-4 mb-4">
              <div>
                <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                  AUTOMATED BACKGROUND HEARTBEAT
                </div>
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Clock size={18} className="text-emerald-600" />
                  <span>Empire Cron Daemon Scheduler</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onRunAllCronJobs();
                  }}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCw size={13} />
                  <span>Run All Daemons Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onUpdateCronConfig({ autoTickEnabled: !cronConfig.autoTickEnabled });
                  }}
                  className={`px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer ${
                    cronConfig.autoTickEnabled
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {cronConfig.autoTickEnabled ? <Pause size={13} /> : <Play size={13} />}
                  <span>{cronConfig.autoTickEnabled ? 'Pause Ticks' : 'Resume Ticks'}</span>
                </button>
              </div>
            </div>

            {/* Tick Interval Controls */}
            <div className="p-4 bg-[#f8f8f8] border border-[#e5e5e5] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#111111]">
                  Tick Frequency Interval: <span className="text-emerald-700">{cronConfig.tickIntervalSeconds} Seconds</span>
                </div>
                <div className="text-[11px] text-[#666666]">
                  Calibrates the background turn generation and resource income loop timer.
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[5, 10, 30, 60, 120].map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      onUpdateCronConfig({ tickIntervalSeconds: seconds });
                    }}
                    className={`px-3 py-1 text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      cronConfig.tickIntervalSeconds === seconds
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#555555] border-[#cccccc] hover:border-[#111111]'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            {/* Daemons Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border border-[#e0e0e0]">
                <thead className="bg-[#f2f2f2] text-[#555555] uppercase text-[10px] border-b border-[#e0e0e0]">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Job Name</th>
                    <th className="p-3">Cron Schedule</th>
                    <th className="p-3">Interval</th>
                    <th className="p-3">Total Runs</th>
                    <th className="p-3">Last Run</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5] bg-white">
                  {cronJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#fafafa]">
                      <td className="p-3">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            job.enabled ? 'bg-emerald-600' : 'bg-[#cccccc]'
                          }`}
                        />
                      </td>
                      <td className="p-3 font-bold text-[#111111]">
                        <div>{job.name}</div>
                        <div className="text-[10px] text-[#777777] font-normal">{job.description}</div>
                      </td>
                      <td className="p-3 text-[#555555]">{job.schedule}</td>
                      <td className="p-3 text-[#555555]">{job.intervalSeconds}s</td>
                      <td className="p-3 font-bold text-[#111111]">{job.runCount}</td>
                      <td className="p-3 text-[#777777]">
                        {job.lastRunAt ? new Date(job.lastRunAt).toLocaleTimeString() : 'Pending'}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            sound.play('confirm');
                            onRunCronJob(job.id);
                          }}
                          className="px-2.5 py-1 bg-[#111111] hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Run
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sound.play('click');
                            onToggleCronJob(job.id);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold border cursor-pointer ${
                            job.enabled
                              ? 'border-[#cccccc] text-[#666666] hover:bg-[#f0f0f0]'
                              : 'border-emerald-600 text-emerald-700 bg-emerald-50'
                          }`}
                        >
                          {job.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EXECUTION & OPS LOGS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div id="admin-tab-logs" className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#dedede] pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Terminal size={18} />
                  <span>Real-Time Operation & Execution Logs</span>
                </h3>
                <p className="text-xs text-[#666666]">
                  Audit log trail of all automated cron ticks, imperial decrees, and sovereign grants.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="px-3 py-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                >
                  <option value="all">All Daemons & Ops</option>
                  <option value="turn_cron">Turn Cron</option>
                  <option value="daily_cron">Daily Settlement</option>
                  <option value="market_cron">Market Fluctuation</option>
                  <option value="target_regen_cron">Target NPC Regen</option>
                  <option value="events_cron">Galaxy Events</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    if (onClearLogs) onClearLogs();
                    else if (onClearCronLogs) onClearCronLogs();
                  }}
                  className="px-3 py-1.5 border border-[#cccccc] hover:bg-[#f5f5f5] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Clear Logs</span>
                </button>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto font-mono text-xs">
              {cronLogs
                .filter((l) => logFilter === 'all' || l.jobId === logFilter)
                .map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border border-[#e5e5e5] bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111111]">{log.jobName}</span>
                          <span className="text-[10px] text-[#888888]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-[#555555] mt-0.5">{log.message}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-white border border-[#dddddd] text-[#666666] shrink-0 self-start sm:self-center">
                      {log.durationMs}ms
                    </span>
                  </div>
                ))}
              {cronLogs.length === 0 && (
                <div className="p-8 text-center text-xs text-[#888888] font-mono">
                  No execution logs recorded yet. Ticks will appear here in real time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SERVER CRONTAB CLI REFERENCE                                       */}
      {/* ========================================================================= */}
      {activeTab === 'cli' && (
        <div id="admin-tab-cli" className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div>
              <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                PRODUCTION LINUX CRONTAB INTEGRATION
              </div>
              <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <Server size={18} />
                <span>Headless Server Deployment Configuration</span>
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Drop these system crontab directives directly into production Linux VPS instances (Ubuntu/Debian) to automate ticks server-side.
              </p>
            </div>

            <div className="relative">
              <pre className="p-4 bg-[#111111] text-emerald-400 font-mono text-xs overflow-x-auto border border-[#333333] leading-relaxed">
{`# Universe Civilization: Empire at Wars Master Server Crontab
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# 1. Turn Tick Engine (Runs every 10 seconds or 1 minute)
* * * * * curl -s -X POST https://api.empire-at-wars.local/cron/turn >> /var/log/turn.log 2>&1

# 2. Daily Imperial Settlement & Tax (Midnight UTC)
0 0 * * * curl -s -X POST https://api.empire-at-wars.local/cron/daily >> /var/log/daily.log 2>&1

# 3. Market Dynamic Fluctuation (Every 5 Minutes)
*/5 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/market >> /var/log/market.log 2>&1

# 4. NPC Target & Pirate Fleet Regeneration (Every 3 Minutes)
*/3 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/npc_regen >> /var/log/npc.log 2>&1

# 5. Stargate Galaxy Phenomena & Space Storms (Every 10 Minutes)
*/10 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/events >> /var/log/events.log 2>&1`}
              </pre>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `# Universe Civilization: Empire at Wars Master Server Crontab\n* * * * * curl -s -X POST https://api.empire-at-wars.local/cron/turn >> /var/log/turn.log 2>&1\n0 0 * * * curl -s -X POST https://api.empire-at-wars.local/cron/daily >> /var/log/daily.log 2>&1\n*/5 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/market >> /var/log/market.log 2>&1\n*/3 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/npc_regen >> /var/log/npc.log 2>&1\n*/10 * * * * curl -s -X POST https://api.empire-at-wars.local/cron/events >> /var/log/events.log 2>&1`,
                    'crontab'
                  )
                }
                className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'crontab' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedKey === 'crontab' ? 'Copied' : 'Copy Crontab File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#111111] p-6 max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#111111]">RESTORE GAME STATE FROM JSON</h3>
            <textarea
              rows={8}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste serialized game state JSON here..."
              className="w-full p-3 border border-[#cccccc] font-mono text-xs outline-none focus:border-[#111111]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-[#cccccc] text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onImportState(importJson)) {
                    setShowImportModal(false);
                    setImportJson('');
                  }
                }}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-mono font-bold cursor-pointer"
              >
                Import & Apply State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-600 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={24} />
              <h3 className="text-base font-bold font-mono">CONFIRM FACTORY RESET</h3>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              This will erase all current planetary developments, shipyard queues, and custom fleet presets,
              returning your universe to initial factory defaults.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-[#cccccc] text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onFactoryReset();
                }}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-mono font-bold hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
