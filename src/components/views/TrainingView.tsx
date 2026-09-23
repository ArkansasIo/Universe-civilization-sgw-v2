import React, { useState } from 'react';
import { Users, Pickaxe, Shield, Crosshair, Eye, ShieldAlert, Zap } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface TrainingViewProps {
  resources: PlayerResources;
  onTrainUnits: (type: 'attack' | 'defense' | 'miners' | 'spies' | 'antiSpies' | 'superUnits', count: number) => {
    success: boolean;
    message: string;
  };
  onUpgradeProduction: () => { success: boolean; message: string };
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  resources,
  onTrainUnits,
  onUpgradeProduction,
}) => {
  const [trainAmounts, setTrainAmounts] = useState<Record<string, number>>({
    attack: 50,
    defense: 50,
    miners: 50,
    spies: 20,
    antiSpies: 20,
    superUnits: 5,
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const upgradeCost = resources.unitProduction * 5000 + 10000;

  const handleTrain = (type: 'attack' | 'defense' | 'miners' | 'spies' | 'antiSpies' | 'superUnits') => {
    const count = trainAmounts[type] || 1;
    const res = onTrainUnits(type, count);
    if (res.success) {
      sound.play('confirm');
      setFeedback({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleUpgradeProd = () => {
    const res = onUpgradeProduction();
    if (res.success) {
      sound.play('research');
      setFeedback({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const setAmount = (type: string, val: number) => {
    setTrainAmounts((prev) => ({ ...prev, [type]: Math.max(1, val) }));
  };

  return (
    <div id="training-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          PERSONNEL ACADEMY · TROOP DRILL & ENLISTMENT
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Troop Training & Facilities</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
          Recruit civilian citizens into trained combat roles, specialized espionage divisions, or Naquadah
          mining crews. Upgrade your academy cloning facilities to boost population generation.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            feedback.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Production Upgrade Banner */}
      <div className="border border-[#dedede] bg-[#fafafa] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
            Population Growth Centers
          </span>
          <h3 className="text-lg font-bold text-[#111111] font-mono mt-0.5">
            Generating +{resources.unitProduction} Untrained Population / Turn
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            Upgrade cloning facilities to receive +2 additional civilians every 30 minutes.
          </p>
        </div>

        <button
          type="button"
          id="upgrade-production-btn"
          onClick={handleUpgradeProd}
          disabled={resources.naquadah < upgradeCost}
          className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          Upgrade Facility ({upgradeCost.toLocaleString()} NQ) →
        </button>
      </div>

      {/* Training Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attack Troops */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <Crosshair size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Attack Troops</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.attackUnits} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Frontline shock troops that pilot boarding craft and execute ground invasions on enemy worlds.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={resources.untrainedUnits}
              value={trainAmounts.attack}
              onChange={(e) => setAmount('attack', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('attack')}
              disabled={resources.untrainedUnits < trainAmounts.attack}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train
            </button>
          </div>
        </div>

        {/* Defense Troops */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Defense Troops</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.defenseUnits} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Stationary garrison guards defending bunker perimeters and stargate blast doors.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={resources.untrainedUnits}
              value={trainAmounts.defense}
              onChange={(e) => setAmount('defense', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('defense')}
              disabled={resources.untrainedUnits < trainAmounts.defense}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train
            </button>
          </div>
        </div>

        {/* Industrial Miners */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <Pickaxe size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Naquadah Miners</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.miners} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Specialized drill engineers extracting raw Naquadah ore (+80 Naquadah per turn).
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={resources.untrainedUnits}
              value={trainAmounts.miners}
              onChange={(e) => setAmount('miners', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('miners')}
              disabled={resources.untrainedUnits < trainAmounts.miners}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train
            </button>
          </div>
        </div>

        {/* Spies */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Covert Spies</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.spies} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Espionage operatives trained in phase disguise, signal tapping, and deep sabotage.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={resources.untrainedUnits}
              value={trainAmounts.spies}
              onChange={(e) => setAmount('spies', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('spies')}
              disabled={resources.untrainedUnits < trainAmounts.spies}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train
            </button>
          </div>
        </div>

        {/* Anti-Spies */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Counter-Intel</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.antiSpies} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Homeland security officers screening stargate traversals to intercept enemy operatives.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={resources.untrainedUnits}
              value={trainAmounts.antiSpies}
              onChange={(e) => setAmount('antiSpies', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('antiSpies')}
              disabled={resources.untrainedUnits < trainAmounts.antiSpies}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train
            </button>
          </div>
        </div>

        {/* Super Units */}
        <div className="border border-[#dedede] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#111111]" />
              <strong className="text-xs font-bold text-[#111111] uppercase">Super Units</strong>
            </div>
            <span className="font-mono text-xs text-[#666666]">{resources.superUnits} active</span>
          </div>
          <p className="text-[11px] text-[#666666]">
            Elite warriors (Kull hybrids / Asgard battle drones) providing formidable combat multipliers.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={Math.floor(resources.untrainedUnits / 5)}
              value={trainAmounts.superUnits}
              onChange={(e) => setAmount('superUnits', parseInt(e.target.value, 10) || 1)}
              className="w-24 border border-[#cccccc] px-2 py-1 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleTrain('superUnits')}
              disabled={resources.untrainedUnits < trainAmounts.superUnits * 5}
              className="flex-1 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] disabled:opacity-50"
            >
              Train (5 pop/ea)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
