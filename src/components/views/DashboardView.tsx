import React, { useMemo } from 'react';
import { ArrowRight, Shield, Target, Users, Zap, Globe, Coins } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerProfile, PlayerResources, Race, PlanetColony } from '../../types';
import { RACES } from '../../gameData';
import { getEmpireColonialSummary } from '../../utils/colonyCalculations';

interface DashboardViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onNavigate: (route: string) => void;
  naturalIncome: number;
  bankCapacity: number;
  planets?: PlanetColony[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  resources,
  onNavigate,
  naturalIncome,
  bankCapacity,
  planets = [],
}) => {
  const currentRace = RACES.find((r) => r.id === profile.race);

  const bankPercentage = Math.min(100, Math.round((resources.bankedNaquadah / bankCapacity) * 100));
  const turnsPercentage = Math.min(100, Math.round((resources.attackTurns / 100) * 100));

  const colonialSummary = useMemo(() => {
    return getEmpireColonialSummary(planets);
  }, [planets]);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Intro Banner */}
      <div className="border border-[#dedede] bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
            REALM STATUS · {currentRace?.name.toUpperCase()} FACTION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Welcome back, {profile.displayName}.
          </h2>
          <p className="text-sm text-[#666666] mt-2 max-w-xl leading-relaxed">
            Make your next move carefully. Your realm is extracting vital Naquadah reserves while rival
            empires watch across the stargate network.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            id="choose-target-btn"
            onClick={() => {
              sound.play('click');
              onNavigate('targets');
            }}
            className="px-5 py-3 bg-[#111111] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#333333] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Choose a Target</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            id="train-units-shortcut-btn"
            onClick={() => {
              sound.play('click');
              onNavigate('units');
            }}
            className="px-5 py-3 border border-[#111111] text-[#111111] text-xs font-bold tracking-wide uppercase hover:bg-[#f5f5f5] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Train Troops</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Economy & Production */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-5">
              <div>
                <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                  ECONOMY & LOGISTICS
                </div>
                <h3 className="text-base font-bold text-[#111111] mt-0.5">Resource Capacity</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  onNavigate('resources');
                }}
                className="text-xs font-semibold text-[#555555] hover:text-[#111111] transition-colors"
              >
                Vault Details →
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-[#555555] mb-1.5 font-medium">
                  <span>Net Natural Income / Turn</span>
                  <b className="text-[#111111] font-mono font-bold">+{naturalIncome.toLocaleString()} Naquadah</b>
                </div>
                <div className="w-full h-2 bg-[#eeeeee]">
                  <div className="h-full bg-[#111111]" style={{ width: '75%' }} />
                </div>
              </div>

              {planets.length > 0 && (
                <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666] flex items-center gap-1.5">
                      <Globe size={12} className="text-[#777777]" />
                      Colonial Maintenance ({planets.length} worlds):
                    </span>
                    <strong className="font-mono text-rose-700 font-bold">
                      -{colonialSummary.totalMaintenanceCost.toLocaleString()} NQ/turn
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#888888]">Expansion Efficiency:</span>
                    <span className={`font-mono font-bold ${
                      colonialSummary.expansionEfficiencyRating === 'Optimal'
                        ? 'text-emerald-700'
                        : colonialSummary.expansionEfficiencyRating === 'Sustainable'
                        ? 'text-blue-700'
                        : colonialSummary.expansionEfficiencyRating === 'Strained'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}>
                      {colonialSummary.expansionEfficiencyRating} ({colonialSummary.expansionEfficiencyPercent}% Margin)
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs text-[#555555] mb-1.5 font-medium">
                  <span>Bank Vault Storage</span>
                  <b className="text-[#111111] font-mono font-bold">
                    {resources.bankedNaquadah.toLocaleString()} / {bankCapacity.toLocaleString()} ({bankPercentage}%)
                  </b>
                </div>
                <div className="w-full h-2 bg-[#eeeeee]">
                  <div className="h-full bg-[#111111]" style={{ width: `${bankPercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#555555] mb-1.5 font-medium">
                  <span>Attack Turn Storage</span>
                  <b className="text-[#111111] font-mono font-bold">{resources.attackTurns} / 100 Turns</b>
                </div>
                <div className="w-full h-2 bg-[#eeeeee]">
                  <div className="h-full bg-[#111111]" style={{ width: `${turnsPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Checklist */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="border-b border-[#eeeeee] pb-4 mb-4">
              <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                STRATEGIC CHECKLIST
              </div>
              <h3 className="text-base font-bold text-[#111111] mt-0.5">Recommended Operations</h3>
            </div>

            <div className="divide-y divide-[#eeeeee]">
              <div
                className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] transition-colors -mx-2 px-2"
                onClick={() => {
                  sound.play('click');
                  onNavigate('units');
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#999999] font-bold">01</span>
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">
                      Train Population into Specialized Units
                    </strong>
                    <small className="block text-[11px] text-[#777777]">
                      Convert {resources.untrainedUnits} untrained population into miners, troops, or spies.
                    </small>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#111111]">Open Training →</span>
              </div>

              <div
                className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] transition-colors -mx-2 px-2"
                onClick={() => {
                  sound.play('click');
                  onNavigate('spy');
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#999999] font-bold">02</span>
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">
                      Dispatch Covert Espionage Probes
                    </strong>
                    <small className="block text-[11px] text-[#777777]">
                      Scout rival enemy realms before committing attack turns.
                    </small>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#111111]">Recon Missions →</span>
              </div>

              <div
                className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafafa] transition-colors -mx-2 px-2"
                onClick={() => {
                  sound.play('click');
                  onNavigate('tech-offense');
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#999999] font-bold">03</span>
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">
                      Upgrade Offensive & Shield Technologies
                    </strong>
                    <small className="block text-[11px] text-[#777777]">
                      Invest surplus Naquadah into permanent combat multipliers.
                    </small>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#111111]">Research Tree →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Military Strength & Personnel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
              <div>
                <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                  PERSONNEL & FLEET
                </div>
                <h3 className="text-base font-bold text-[#111111] mt-0.5">Military Breakdown</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  onNavigate('military-stats');
                }}
                className="text-xs font-semibold text-[#555555] hover:text-[#111111] transition-colors"
              >
                Stats →
              </button>
            </div>

            <div className="divide-y divide-[#eeeeee] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Active Attack Units</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.attackUnits.toLocaleString()}
                </strong>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Active Defense Units</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.defenseUnits.toLocaleString()}
                </strong>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Covert Espionage Agents</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.spies.toLocaleString()}
                </strong>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Counter-Intelligence Agents</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.antiSpies.toLocaleString()}
                </strong>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Mining Workforce</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.miners.toLocaleString()}
                </strong>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#666666]">Elite Super Units</span>
                <strong className="text-[#111111] font-mono font-bold">
                  {resources.superUnits.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Nav Card */}
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-2">
              GALACTIC REPUTATION
            </div>
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs text-[#555555]">Rank Standing</span>
              <span className="text-sm font-bold text-[#111111]">{profile.rankName} (Level {profile.rankLevel})</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center mb-4">
              <div className="bg-white border border-[#dedede] p-3">
                <span className="block text-[10px] text-[#777777] uppercase font-bold">Glory</span>
                <strong className="text-base font-bold text-[#111111] font-mono">{profile.glory}</strong>
              </div>
              <div className="bg-white border border-[#dedede] p-3">
                <span className="block text-[10px] text-[#777777] uppercase font-bold">Reputation</span>
                <strong className="text-base font-bold text-[#111111] font-mono">{profile.reputation}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onNavigate('rankings');
              }}
              className="w-full py-2.5 bg-white border border-[#dedede] text-[#111111] font-bold text-xs hover:border-[#111111] transition-colors"
            >
              View Galactic Leaderboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
