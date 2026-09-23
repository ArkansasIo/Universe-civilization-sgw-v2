import React from 'react';
import { PlayerResources } from '../types';
import { TrendingUp, ShieldAlert, Users, Landmark } from 'lucide-react';

interface HudMetricsProps {
  resources: PlayerResources;
  netIncome?: number;
  militaryUpkeep?: number;
  defconLevel?: number;
}

export const HudMetrics: React.FC<HudMetricsProps> = ({
  resources,
  netIncome = 18500,
  militaryUpkeep = 2400,
  defconLevel = 0,
}) => {
  const totalWorkforce = (resources.miners ?? 0) + (resources.lifers ?? 0);
  const totalMilitary = (resources.attackUnits ?? 0) + (resources.defenseUnits ?? 0) + (resources.superUnits ?? 0);

  return (
    <div
      id="hud-metrics-grid"
      className="grid grid-cols-2 md:grid-cols-4 border border-[#dedede] bg-white mb-6 divide-y md:divide-y-0 md:divide-x divide-[#dedede]"
    >
      <div className="p-3 sm:p-4">
        <span className="block text-[10px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp size={12} className="text-emerald-600" />
          <span>Net Colonial Revenue</span>
        </span>
        <strong className="block text-xl sm:text-2xl font-bold tracking-tight text-[#111111] my-0.5 font-mono">
          +{netIncome.toLocaleString()}{' '}
          <span className="text-xs text-[#666666] font-normal">NQ / Turn</span>
        </strong>
        <small className="block text-[10px] text-[#888888]">
          Gross natural yield minus military upkeep
        </small>
      </div>

      <div className="p-3 sm:p-4">
        <span className="block text-[10px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={12} className="text-rose-600" />
          <span>Fleet Maintenance</span>
        </span>
        <strong className="block text-xl sm:text-2xl font-bold tracking-tight text-[#111111] my-0.5 font-mono">
          -{militaryUpkeep.toLocaleString()}{' '}
          <span className="text-xs text-[#666666] font-normal">NQ / Turn</span>
        </strong>
        <small className="block text-[10px] text-[#888888]">
          Supporting {totalMilitary.toLocaleString()} active combat forces
        </small>
      </div>

      <div className="p-3 sm:p-4">
        <span className="block text-[10px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
          <Users size={12} className="text-blue-600" />
          <span>Workforce & Recruits</span>
        </span>
        <strong className="block text-xl sm:text-2xl font-bold tracking-tight text-[#111111] my-0.5 font-mono">
          {(resources.untrainedUnits ?? 0).toLocaleString()}{' '}
          <span className="text-xs text-[#666666] font-normal">
            (+{resources.unitProduction ?? 10}/t)
          </span>
        </strong>
        <small className="block text-[10px] text-[#888888]">
          Workforce: {totalWorkforce.toLocaleString()} miners & engineers
        </small>
      </div>

      <div className="p-3 sm:p-4">
        <span className="block text-[10px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
          <Landmark size={12} className="text-amber-600" />
          <span>Bank Security Vault</span>
        </span>
        <strong className="block text-xl sm:text-2xl font-bold tracking-tight text-[#111111] my-0.5 font-mono">
          {resources.bankedNaquadah.toLocaleString()}{' '}
          <span className="text-xs text-[#666666] font-normal">NQ</span>
        </strong>
        <small className="block text-[10px] text-[#888888]">
          Protected from plundering · 2% daily interest
        </small>
      </div>
    </div>
  );
};
