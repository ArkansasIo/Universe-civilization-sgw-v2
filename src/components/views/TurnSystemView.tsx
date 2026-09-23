import React, { useState } from 'react';
import { RotateCw, Clock, Zap, Shield, ArrowUpRight, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface TurnSystemViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onProcessTurn: () => void;
}

export const TurnSystemView: React.FC<TurnSystemViewProps> = ({
  resources,
  onUpdateResources,
  onProcessTurn,
}) => {
  const [turnCap, setTurnCap] = useState<number>(5000);
  const [turnsPerMinute, setTurnsPerMinute] = useState<number>(6); // 6 turns per minute (Stargatewars standard)
  const [autoRegenEnabled, setAutoRegenEnabled] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuyTurns = (amount: number, costNaquadah: number) => {
    if (resources.naquadah < costNaquadah) {
      sound.play('warning');
      setFeedback('Insufficient liquid Naquadah to purchase additional turns.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      naquadah: resources.naquadah - costNaquadah,
      attackTurns: Math.min(turnCap, resources.attackTurns + amount),
    });
    setFeedback(`Successfully purchased ${amount.toLocaleString()} attack turns for ${costNaquadah.toLocaleString()} NQ!`);
  };

  const handleBoostRegen = () => {
    if (resources.crystal < 20000) {
      sound.play('warning');
      setFeedback('Insufficient Crystal (20,000) to upgrade Subspace Turn Accelerator.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      crystal: resources.crystal - 20000,
    });
    setTurnsPerMinute(turnsPerMinute + 2);
    setFeedback(`Subspace Turn Accelerator upgraded! Turn generation now +${turnsPerMinute + 2} turns/min.`);
  };

  return (
    <div id="turn-system-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          GAME & STARGATEWARS TURN ENGINE · 6 TURNS/MIN REGENERATION & STRATEGIC ACTIONS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Stargatewars & Game Turn Management</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Monitor automated Stargatewars 6-turns-per-minute regeneration cycles, allocate attack turns for fleet strikes and espionage, and upgrade subspace chronometers.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-[#fafafa] border border-[#111111] border-l-4 text-xs font-semibold flex justify-between items-center">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Turn Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Current Attack Turns</span>
          <strong className="text-2xl font-mono text-[#111111] block mt-1">
            {resources.attackTurns.toLocaleString()}
          </strong>
          <span className="text-[10px] text-[#777777] block mt-1">Max Turn Cap: {turnCap.toLocaleString()}</span>
        </div>
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Turn Regeneration Rate</span>
          <div className="flex items-center gap-2 mt-1">
            <Zap size={18} className="text-emerald-600" />
            <strong className="text-xl font-mono text-emerald-700">{turnsPerMinute} Turns / Minute</strong>
          </div>
          <span className="text-[10px] text-[#777777] block mt-1">Stargatewars Standard Speed</span>
        </div>
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Turn Regeneration Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-3 h-3 rounded-full ${autoRegenEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-400'}`} />
            <strong className="text-base font-mono text-[#111111]">
              {autoRegenEnabled ? 'Active (60s Tick)' : 'Paused'}
            </strong>
          </div>
        </div>
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Manual Turn Process</span>
          <button
            type="button"
            onClick={() => {
              sound.play('confirm');
              onProcessTurn();
            }}
            className="w-full mt-1 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCw size={12} />
            <span>Process Turn Now</span>
          </button>
        </div>
      </div>

      {/* Turn Purchase & Subspace Accelerators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchase Turns */}
        <div className="border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">Acquire Turn Packages</h3>
            <span className="text-xs text-[#777777]">Exchange Naquadah reserves for immediate operational turns</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#fafafa] border border-[#dedede]">
              <div>
                <strong className="text-xs font-bold text-[#111111] block">+100 Attack Turns</strong>
                <span className="text-[10px] text-[#777777]">Cost: 50,000 Naquadah</span>
              </div>
              <button
                type="button"
                onClick={() => handleBuyTurns(100, 50000)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Purchase →
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#fafafa] border border-[#dedede]">
              <div>
                <strong className="text-xs font-bold text-[#111111] block">+500 Attack Turns</strong>
                <span className="text-[10px] text-[#777777]">Cost: 220,000 Naquadah</span>
              </div>
              <button
                type="button"
                onClick={() => handleBuyTurns(500, 220000)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Purchase →
              </button>
            </div>
          </div>
        </div>

        {/* Subspace Turn Accelerator */}
        <div className="border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">Subspace Chronometer Accelerator</h3>
            <span className="text-xs text-[#777777]">Upgrade turn generation rate per minute</span>
          </div>

          <div className="space-y-3 text-xs text-[#555555]">
            <p className="leading-relaxed">
              By warping local subspace curvature, your empire's atomic clocks regenerate attack turns faster than standard galactic units.
            </p>
            <div className="p-3 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#111111] block">Current Regen: {turnsPerMinute} turns/min</span>
                <span className="text-[10px] text-[#777777]">Upgrade Cost: 20,000 Crystal Silicate</span>
              </div>
              <button
                type="button"
                onClick={handleBoostRegen}
                className="px-4 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Upgrade Regen →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
