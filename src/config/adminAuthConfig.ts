import { AdminCredentialAccount, AdminPermission, AdminUserRole, AdminAuthSession } from '../types';

export interface AdminPermissionMetadata {
  key: AdminPermission;
  label: string;
  category: 'System Root' | 'Player Mgmt' | 'Universe Controls' | 'Database & SQL' | 'Tactical Operations';
  description: string;
  securityLevel: number; // 1 to 5
}

export const ADMIN_PERMISSIONS_REGISTRY: AdminPermissionMetadata[] = [
  {
    key: 'GRANT_RESOURCES',
    label: 'Grant Resources & Dark Matter',
    category: 'Universe Controls',
    description: 'Inject unlimited Naquadah, Crystal, Dark Matter, Antimatter, and Turns into player accounts.',
    securityLevel: 3,
  },
  {
    key: 'MANAGE_USERS',
    label: 'User Account & Role Management',
    category: 'Player Mgmt',
    description: 'Edit player ranks, assign moderator/operator roles, change email credentials, and force password resets.',
    securityLevel: 4,
  },
  {
    key: 'BAN_PLAYERS',
    label: 'Ban, Mute & Sanction Enforcement',
    category: 'Player Mgmt',
    description: 'Issue temporary/permanent IP bans, chat mutes, attack locks, and anti-cheat multi-account suspensions.',
    securityLevel: 4,
  },
  {
    key: 'MODIFY_UNIVERSE_CONFIG',
    label: 'Universe Speed & Maintenance Mode',
    category: 'Universe Controls',
    description: 'Alter game/fleet speeds, deuterium consumption factors, beginner protection, and server maintenance windows.',
    securityLevel: 4,
  },
  {
    key: 'EXECUTE_SQL',
    label: 'Raw SQL Database Terminal & DDL',
    category: 'Database & SQL',
    description: 'Execute direct SELECT, INSERT, UPDATE, DDL queries, and schema migrations against PostgreSQL.',
    securityLevel: 5,
  },
  {
    key: 'ISSUE_DECREES',
    label: 'Imperial Crown Decrees',
    category: 'Tactical Operations',
    description: 'Issue galaxy-wide sovereign decrees providing realm-wide resource and fleet combat multipliers.',
    securityLevel: 3,
  },
  {
    key: 'MANAGE_FLEETS',
    label: 'Fleet Teleport & Armada Operations',
    category: 'Tactical Operations',
    description: 'Instantly spawn armadas, recall in-flight missions, teleport fleets, and clear spatial debris fields.',
    securityLevel: 3,
  },
  {
    key: 'PURGE_SYSTEM_DATA',
    label: 'Factory Reset & Universe Season Wipe',
    category: 'System Root',
    description: 'Perform total factory resets, flush cache daemons, and wipe/reset universe season leaderboards.',
    securityLevel: 5,
  },
  {
    key: 'MODERATE_TICKETS',
    label: 'Support Tickets & Holonet Broadcasts',
    category: 'Player Mgmt',
    description: 'Reply to player support tickets, update ticket statuses, and publish global Holonet announcements.',
    securityLevel: 2,
  },
  {
    key: 'MANAGE_EVENTS',
    label: 'Global Galactic Events & Raid Bosses',
    category: 'Tactical Operations',
    description: 'Trigger world boss raids, supernova cosmic storms, double XP weekends, and global event timers.',
    securityLevel: 3,
  },
];

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = ADMIN_PERMISSIONS_REGISTRY.map((p) => p.key);

export const CANONICAL_ADMIN_ACCOUNTS: AdminCredentialAccount[] = [
  {
    id: 'admin_super_archon',
    username: 'SupremeAdmin_Archon',
    email: 'archon@stargate-command.root',
    loginCode: 'SG1-ARCHON-9000',
    passcode: 'stargate2026',
    securityPin: '9901',
    role: 'super_admin',
    title: 'Supreme Galactic Administrator & Root Archon',
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin_oneill_sgc',
    username: 'Commander_O_Neill',
    email: 'oneill@sgarche.mil',
    loginCode: 'SGC-ONEILL-304',
    passcode: 'tauri304',
    securityPin: '3040',
    role: 'administrator',
    title: 'High Fleet General & SGC Commander',
    permissions: [
      'GRANT_RESOURCES',
      'MANAGE_USERS',
      'BAN_PLAYERS',
      'MODIFY_UNIVERSE_CONFIG',
      'EXECUTE_SQL',
      'ISSUE_DECREES',
      'MANAGE_FLEETS',
      'MODERATE_TICKETS',
      'MANAGE_EVENTS',
    ],
  },
  {
    id: 'admin_thor_asgard',
    username: 'SupremeThor_Asgard',
    email: 'thor@asgard-council.ida',
    loginCode: 'ASGARD-THOR-101',
    passcode: 'idacouncil',
    securityPin: '1010',
    role: 'operator',
    title: 'Asgard High Council Game Operator',
    permissions: [
      'GRANT_RESOURCES',
      'BAN_PLAYERS',
      'EXECUTE_SQL',
      'MANAGE_FLEETS',
      'MODERATE_TICKETS',
      'MANAGE_EVENTS',
    ],
  },
  {
    id: 'admin_tollan_narim',
    username: 'Tollan_Curator_Narim',
    email: 'narim@tollana-archon.gov',
    loginCode: 'TOLLAN-NARIM-77',
    passcode: 'phasecurator',
    securityPin: '7700',
    role: 'moderator',
    title: 'Curator Support Moderator & Anti-Cheat Auditor',
    permissions: [
      'BAN_PLAYERS',
      'MODERATE_TICKETS',
    ],
  },
];

export const STORAGE_KEY_ADMIN_AUTH = 'uc_active_admin_auth_session';

export function getAdminAuthSession(): AdminAuthSession {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      activeAdmin: null,
      authenticatedAt: null,
      securityClearanceLevel: 0,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
    if (saved) {
      const parsed: AdminAuthSession = JSON.parse(saved);
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read admin auth session', err);
  }

  // Default auto-logged in as Root Administrator for ease of developer inspection
  const defaultSuper = CANONICAL_ADMIN_ACCOUNTS[0];
  return {
    isAuthenticated: true,
    activeAdmin: defaultSuper,
    authenticatedAt: new Date().toISOString(),
    securityClearanceLevel: 5,
  };
}

export function setAdminAuthSession(session: AdminAuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session));
}

export function clearAdminAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
}

export function validateAdminCredentials(
  loginCodeOrUser: string,
  passcode: string,
  securityPin?: string
): AdminCredentialAccount | null {
  const match = CANONICAL_ADMIN_ACCOUNTS.find(
    (acc) =>
      (acc.loginCode.toLowerCase() === loginCodeOrUser.trim().toLowerCase() ||
        acc.username.toLowerCase() === loginCodeOrUser.trim().toLowerCase() ||
        acc.email.toLowerCase() === loginCodeOrUser.trim().toLowerCase()) &&
      acc.passcode === passcode
  );

  if (match) {
    if (securityPin && match.securityPin !== securityPin) {
      return null;
    }
    return match;
  }
  return null;
}

export function checkAdminPermission(
  session: AdminAuthSession | null,
  permission: AdminPermission
): boolean {
  if (!session || !session.isAuthenticated || !session.activeAdmin) {
    return false;
  }
  if (session.activeAdmin.role === 'super_admin') return true;
  return session.activeAdmin.permissions.includes(permission);
}
