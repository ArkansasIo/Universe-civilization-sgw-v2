import React, { useState } from 'react';
import { Shield, Sparkles, Terminal, Swords, Globe, User, Lock, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerProfile } from '../../types';

interface TitleScreenProps {
  profile: PlayerProfile;
  onLogin: (username: string, race: string) => void;
  onRegister: (username: string, race: string, gov: string) => void;
  onQuickStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  onLogin,
  onRegister,
  onQuickStart,
}) => {
  const [authMode, setAuthMode] = useState<'splash' | 'login' | 'register' | 'servers'>('splash');
  const [usernameInput, setUsernameInput] = useState<string>(profile.username || 'Commander_Stephen');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [selectedRace, setSelectedRace] = useState<string>('tauri');
  const [selectedGov, setSelectedGov] = useState<string>('democratic');
  const [selectedServer, setSelectedServer] = useState<string>('Alpha-Prime (US-East) - 12ms');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.play('success');
    onLogin(usernameInput, selectedRace);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.play('success');
    onRegister(usernameInput, selectedRace, selectedGov);
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Cinematic Grids & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,80,0.25)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black font-extrabold flex items-center justify-center text-lg tracking-tighter">
            UC
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-widest text-white">UNIVERSE CIVILIZATION</h1>
            <span className="text-[10px] text-white/50 font-mono">MMORPG STRATEGY ENGINE · v2.4.9</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SERVER: ONLINE (99.98% UPTIME)</span>
          </div>
          <span className="text-white/70">Lead Dev: <strong className="text-white">Stephen</strong></span>
        </div>
      </header>

      {/* Center Hero / Auth Modal Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {authMode === 'splash' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono text-white/90">
                <Sparkles size={14} className="text-amber-400" />
                <span>NEXT-GEN BROWSER MMORPG & OGAME STRATEGY</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none">
                Empire at Wars
              </h2>

              <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
                Command immortal fleets, colonize uncharted planetary biomes across 9 galaxies, construct Dyson megastructures, and dominate interstellar alliances.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    setAuthMode('login');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Commander Login →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    setAuthMode('register');
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Register New Empire
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('success');
                    onQuickStart();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  Quick Play (Guest)
                </button>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-xs font-mono text-white/60">
                <div>
                  <span className="block text-white font-bold text-sm">499+</span>
                  Solar Systems
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">10</span>
                  Planetary Biomes
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">100%</span>
                  Real-Time Fleet Sim
                </div>
              </div>
            </div>
          )}

          {authMode === 'login' && (
            <div className="bg-black/80 border border-white/20 p-8 space-y-6 backdrop-blur-xl animate-fade-in">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">MMORPG ACCOUNT SYSTEM</span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">Commander Authentication</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('splash')}
                  className="text-xs font-mono text-white/60 hover:text-white"
                >
                  ← Back
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
                    Commander Callsign / Username
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-white/40" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/20 px-10 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white"
                      placeholder="Commander Name..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
                    Access Passcode / Key
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-white/40" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/20 px-10 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
                    Select Realm Server
                  </label>
                  <select
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="w-full bg-[#111111] border border-white/20 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-white"
                  >
                    <option>Alpha-Prime (US-East) - 12ms</option>
                    <option>Beta-Centauri (EU-Central) - 45ms</option>
                    <option>Gamma-Orionis (Asia-Pacific) - 110ms</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer mt-2"
                >
                  Access Command Terminal →
                </button>
              </form>
            </div>
          )}

          {authMode === 'register' && (
            <div className="bg-black/80 border border-white/20 p-8 space-y-6 backdrop-blur-xl animate-fade-in">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">NEW EMPIRE REGISTRATION</span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">Establish Dynasty</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('splash')}
                  className="text-xs font-mono text-white/60 hover:text-white"
                >
                  ← Back
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
                    Commander Callsign
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/20 px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white"
                    placeholder="Enter commander name..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
                    Choose Faction Race
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'tauri', name: "Tau'ri (Human Fleet)", bonus: '+25% Attack' },
                      { id: 'asgard', name: 'Asgard (High Science)', bonus: '+30% Research' },
                      { id: 'goauld', name: "Go'auld (Slave Mines)", bonus: '+30% Income' },
                      { id: 'replicator', name: 'Replicators (Swarm)', bonus: '+40% Armor' },
                    ].map((rc) => (
                      <button
                        key={rc.id}
                        type="button"
                        onClick={() => setSelectedRace(rc.id)}
                        className={`p-3 text-left border cursor-pointer transition-colors ${
                          selectedRace === rc.id
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-white/5 text-white/80 border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="font-bold">{rc.name}</div>
                        <div className={`text-[10px] mt-0.5 ${selectedRace === rc.id ? 'text-neutral-700' : 'text-white/50'}`}>
                          {rc.bonus}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer mt-4"
                >
                  Found Empire & Begin →
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-mono">
        <div>
          <span>UNIVERSE CIVILIZATION: EMPIRE AT WARS</span>
          <span className="mx-2">|</span>
          <span>BUILD #9824-OG</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Lead Developer: <strong className="text-white">Stephen</strong></span>
          <span>UID: UC-88942-X9</span>
        </div>
      </footer>
    </div>
  );
};
