import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Key,
  LogOut,
  Settings,
  Check,
  RefreshCw,
  Copy,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  Download,
  Upload,
  Globe,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../sound';
import { Government, PlayerProfile, Race } from '../../types';
import { GOVERNMENTS, RACES } from '../../gameData';
import {
  COMMANDER_AVATARS,
  COMMANDER_TITLES,
  INITIAL_PROFILE_SLOTS,
  INITIAL_CAREER_STATS,
} from '../../accountProfilesData';

interface ProfileSystemViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onChangeRace: (raceId: string) => { success: boolean; message: string };
  onChangeGovernment: (govId: string) => { success: boolean; message: string };
  onToggleVacation: () => { success: boolean; message: string };
  onAscend: () => { success: boolean; message: string };
  onLogout?: () => void;
}

export const ProfileSystemView: React.FC<ProfileSystemViewProps> = ({
  profile,
  onUpdateProfile,
  onChangeRace,
  onChangeGovernment,
  onToggleVacation,
  onAscend,
  onLogout,
}) => {
  // Navigation Sub-tabs for the Profile System
  const [activeTab, setActiveTab] = useState<'dossier' | 'slots' | 'heritage' | 'career' | 'security'>('dossier');

  // Save Slots State
  const [profileSlots, setProfileSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('uc_state_commander_slots');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE_SLOTS;
    } catch {
      return INITIAL_PROFILE_SLOTS;
    }
  });

  // Career Stats State
  const [careerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('uc_state_career_stats');
      return saved ? JSON.parse(saved) : INITIAL_CAREER_STATS;
    } catch {
      return INITIAL_CAREER_STATS;
    }
  });

  // Identity Form State
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl || '👨‍✈️');
  const [selectedTitle, setSelectedTitle] = useState(profile.title || 'Fleet Commander');
  const [commanderName, setCommanderName] = useState(profile.name || 'Commander Tanang');
  const [motto, setMotto] = useState(() => {
    return localStorage.getItem('uc_state_profile_motto') || 'Through the Event Horizon to Victory';
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const showMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const currentRace = RACES.find((r) => r.id === profile.race);
  const currentGov = GOVERNMENTS.find((g) => g.id === profile.governmentId);

  // Save Profile Dossier Form
  const handleSaveDossier = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: commanderName,
      displayName: commanderName,
      username: commanderName,
      title: selectedTitle,
      avatarUrl: selectedAvatar,
    });
    localStorage.setItem('uc_state_profile_motto', motto);
    sound.play('confirm');
    showMsg('Sovereign Profile credentials & insignia updated successfully!');
  };

  // Switch Save Slot
  const handleSwitchSlot = (slotId: string) => {
    const updated = profileSlots.map((s: any) => ({
      ...s,
      isActive: s.id === slotId,
    }));
    setProfileSlots(updated);
    localStorage.setItem('uc_state_commander_slots', JSON.stringify(updated));

    const active = updated.find((s: any) => s.id === slotId);
    if (active) {
      onUpdateProfile({
        name: active.commanderName,
        displayName: active.commanderName,
        username: active.commanderName,
        title: active.title,
        race: active.race,
        governmentId: active.governmentId,
        level: active.level,
        avatarUrl: active.avatarUrl,
      });
      setSelectedAvatar(active.avatarUrl);
      setSelectedTitle(active.title);
      setCommanderName(active.commanderName);
      sound.play('success');
      showMsg(`Loaded Save Profile Slot: ${active.commanderName} [${active.title}]!`);
    }
  };

  // Handle Race Change
  const handleSelectRace = (raceId: string) => {
    const res = onChangeRace(raceId);
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Handle Government Change
  const handleSelectGov = (govId: string) => {
    const res = onChangeGovernment(govId);
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Handle Vacation Mode
  const handleVacation = () => {
    const res = onToggleVacation();
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    }
  };

  // Handle Ascension
  const handleAscension = () => {
    const res = onAscend();
    if (res.success) {
      sound.play('success');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Export Save State JSON
  const handleExportState = () => {
    const exportData = {
      profile,
      profileSlots,
      timestamp: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `universe_civilization_${profile.username}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sound.play('confirm');
    showMsg('Sovereign civilization backup successfully exported to disk.');
  };

  // Import Save State JSON
  const handleImportState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && parsed.profile) {
          onUpdateProfile(parsed.profile);
          if (parsed.profileSlots && Array.isArray(parsed.profileSlots)) {
            setProfileSlots(parsed.profileSlots);
            localStorage.setItem('uc_state_commander_slots', JSON.stringify(parsed.profileSlots));
          }
          sound.play('success');
          showMsg('Civilization backup successfully imported and restored!');
        } else {
          sound.play('warning');
          showMsg('Invalid backup file format: missing profile data.');
        }
      } catch {
        sound.play('warning');
        showMsg('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div id="profile-system-view" className="space-y-6">
      {/* 1. SOVEREIGN PROFILE HEADER */}
      <div className="border border-[#dedede] bg-white p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar, Sovereign Title & Identity */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#111111] bg-neutral-100 flex items-center justify-center text-3xl sm:text-4xl shadow-xs shrink-0">
              {profile.avatarUrl || '👨‍✈️'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">
                  SOVEREIGN CITIZEN RECORD · REALM ID: UC-{profile.id?.slice(0, 8) || 'ALPHA-01'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold border border-amber-400 bg-amber-50 text-amber-800 uppercase">
                  {currentRace?.name || "Tau'ri"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#111111] mt-0.5 font-mono">
                {profile.displayName || profile.username}
              </h2>
              <div className="text-xs text-[#555555] font-mono mt-1 flex items-center gap-3">
                <span>Title: <strong className="text-[#111111]">{profile.title || 'Fleet Commander'}</strong></span>
                <span>•</span>
                <span>Constitution: <strong className="text-[#111111]">{currentGov?.name || 'Military Junta'}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Quick Realm Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-[#dedede] bg-[#fafafa] p-4 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Glory Rating</span>
              <strong className="text-lg font-bold font-mono text-[#111111]">
                {(profile.glory ?? 840).toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Reputation</span>
              <strong className="text-lg font-bold font-mono text-emerald-700">
                {(profile.reputation ?? 95).toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Status</span>
              <span className="text-xs font-mono font-bold text-emerald-600 block">
                {profile.vacationUntil ? 'Sanctuary Shield' : 'Active Realm'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 bg-[#111111] text-white text-xs font-mono flex items-center justify-between border-l-4 border-emerald-500 shadow-md">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex border-b border-[#dedede] bg-white overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab('dossier')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'dossier'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <User size={14} />
          <span>Identity & Insignia</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'slots'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <FolderOpen size={14} />
          <span>Multiverse Save Slots</span>
          <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 font-mono">
            {profileSlots.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('heritage')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'heritage'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Globe size={14} />
          <span>Civilization Heritage & Faction</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('career')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'career'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Award size={14} />
          <span>Lifetime Career Record</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'security'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Shield size={14} />
          <span>Security & Sanctuary</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IDENTITY & INSIGNIA */}
      {/* ========================================================================= */}
      {activeTab === 'dossier' && (
        <form onSubmit={handleSaveDossier} className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-6">
            <h3 className="font-bold text-[#111111] text-base border-b border-[#eeeeee] pb-3">
              Player Identity Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Commander Call Sign / Display Name
                </label>
                <input
                  type="text"
                  value={commanderName}
                  onChange={(e) => setCommanderName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="Enter commander name..."
                  required
                />
              </div>

              {/* Title Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Sovereign Title
                </label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                >
                  {COMMANDER_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Civilization Motto */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Empire Motto / Sovereign Manifesto
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm outline-hidden bg-[#fafafa]"
                  placeholder="Enter your empire's battle cry..."
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="pt-4 border-t border-[#eeeeee] space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                Avatar Insignia Selection
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {COMMANDER_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.icon;
                  return (
                    <button
                      type="button"
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.icon)}
                      className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#111111] bg-neutral-100 ring-2 ring-[#111111]'
                          : 'border-[#dedede] bg-white hover:border-[#999999]'
                      }`}
                    >
                      <span className="text-3xl">{avatar.icon}</span>
                      <span className="text-[10px] font-bold text-[#111111] truncate w-full">
                        {avatar.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#eeeeee] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTIVERSE SAVE SLOTS */}
      {/* ========================================================================= */}
      {activeTab === 'slots' && (
        <div className="space-y-4">
          <div className="border border-[#dedede] bg-white p-4">
            <h3 className="font-bold text-[#111111] text-base">Multiverse Empire Save Slots</h3>
            <p className="text-xs text-[#666666]">
              Switch seamlessly between alternate realm save slots, different races, and operational theaters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profileSlots.map((slot: any) => (
              <div
                key={slot.id}
                className={`border p-5 bg-white transition-all flex flex-col justify-between ${
                  slot.isActive ? 'border-[#111111] shadow-xs' : 'border-[#dedede]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-[#dedede] bg-neutral-100 flex items-center justify-center text-2xl">
                        {slot.avatarUrl}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                          SLOT {slot.slotNumber} · {slot.race.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-[#111111]">{slot.commanderName}</h4>
                        <span className="text-[11px] text-[#555555]">{slot.title}</span>
                      </div>
                    </div>
                    {slot.isActive && (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#eeeeee] text-xs font-mono">
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">PLANETS</span>
                      <strong className="text-[#111111]">{slot.planetsCount} Worlds</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">FLEET SCORE</span>
                      <strong className="text-[#111111]">{slot.fleetScore.toLocaleString()}</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">LEVEL</span>
                      <strong className="text-[#111111]">Level {slot.level}</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">DARK MATTER</span>
                      <strong className="text-purple-700">{slot.darkMatter} DM</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchSlot(slot.id)}
                    disabled={slot.isActive}
                    className={`w-full py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      slot.isActive
                        ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                        : 'bg-[#111111] hover:bg-[#333333] text-white'
                    }`}
                  >
                    {slot.isActive ? 'Currently Active' : `Load Slot ${slot.slotNumber}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CIVILIZATION HERITAGE & FACTION */}
      {/* ========================================================================= */}
      {activeTab === 'heritage' && (
        <div className="space-y-6">
          {/* Race Selection */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#111111] text-base">Civilization Species & Racial Heritage</h3>
              <p className="text-xs text-[#666666]">
                Your species defines unique racial economic, military, and defensive traits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RACES.map((race) => {
                const isSelected = profile.race === race.id;
                return (
                  <div
                    key={race.id}
                    className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                      isSelected ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-[#dedede]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-[#111111]">{race.name}</h4>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed mb-3">{race.description}</p>
                      <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                        {race.bonusLabel}: +{race.bonusPercent}%
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eeeeee] mt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectRace(race.id)}
                        disabled={isSelected}
                        className={`w-full py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                            : 'bg-[#111111] hover:bg-[#333333] text-white'
                        }`}
                      >
                        {isSelected ? 'Active Species' : 'Adopt Heritage'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Government Selection */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#111111] text-base">Supreme Government Constitution</h3>
              <p className="text-xs text-[#666666]">
                Establish the sovereign constitution governing your planetary systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GOVERNMENTS.map((gov) => {
                const isSelected = profile.governmentId === gov.id;
                return (
                  <div
                    key={gov.id}
                    className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                      isSelected ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-[#dedede]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-[#111111]">{gov.name}</h4>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed mb-3">{gov.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#eeeeee] mt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectGov(gov.id)}
                        disabled={isSelected}
                        className={`w-full py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                            : 'bg-[#111111] hover:bg-[#333333] text-white'
                        }`}
                      >
                        {isSelected ? 'Current Constitution' : 'Ratify Constitution'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIFETIME CAREER RECORD */}
      {/* ========================================================================= */}
      {activeTab === 'career' && (
        <div className="space-y-4">
          <div className="border border-[#dedede] bg-white p-4">
            <h3 className="font-bold text-[#111111] text-base">Imperial Lifetime Galactic Record</h3>
            <p className="text-xs text-[#666666]">
              Comprehensive career metrics accumulated across all combat theaters, colonial expeditions, and galactic operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Total Engagements</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.totalBattles}</strong>
              <small className="block text-[10px] text-[#888888]">Space & ground operations</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Combat Victories</span>
              <strong className="text-2xl font-bold font-mono text-emerald-700">{careerStats.victories}</strong>
              <small className="block text-[10px] text-emerald-600 font-bold">{careerStats.winRate}% Win Rate</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Naquadah Plundered</span>
              <strong className="text-2xl font-bold font-mono text-amber-700">
                {(careerStats.totalLootNaquadah / 1000000).toFixed(2)}M
              </strong>
              <small className="block text-[10px] text-[#888888]">From enemy vaults</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Stargates Dialed</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.stargatesDialed}</strong>
              <small className="block text-[10px] text-[#888888]">Wormhole traversals</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Worlds Colonized</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.planetsColonized}</strong>
              <small className="block text-[10px] text-[#888888]">Planetary domains</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Moons Discovered</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.moonsDiscovered}</strong>
              <small className="block text-[10px] text-[#888888]">Lunar phalanx bases</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Expeditions Completed</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.expeditionsCompleted}</strong>
              <small className="block text-[10px] text-[#888888]">Deep space missions</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Debris Recycled</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">
                {(careerStats.debrisRecycled / 1000).toLocaleString()}k
              </strong>
              <small className="block text-[10px] text-[#888888]">Raw salvage harvested</small>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SECURITY & SANCTUARY */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Vacation Mode Sanctuary */}
          <div className="border border-[#dedede] bg-white p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-[#111111] text-base">Sanctuary Shielding Protocol (Vacation Mode)</h3>
                <p className="text-xs text-[#666666] max-w-xl mt-1">
                  Protects all planetary colonies from incoming hostile raids and espionage probes. While sanctuary is active, production is paused.
                </p>
              </div>
              <button
                type="button"
                onClick={handleVacation}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  profile.vacationUntil
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-[#111111] text-white hover:bg-[#333333]'
                }`}
              >
                {profile.vacationUntil ? 'Deactivate Sanctuary' : 'Engage Sanctuary Mode'}
              </button>
            </div>
          </div>

          {/* Backup & Export */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-[#111111] text-base">Empire Backup & Data Management</h3>
            <p className="text-xs text-[#666666]">
              Export your civilization state and profile slots as a JSON file to transfer between devices, or restore a previous backup.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportState}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export Civilization Backup (.json)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 border border-[#cccccc] bg-white text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer">
                <Upload size={14} />
                <span>Import Civilization Backup (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportState}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
