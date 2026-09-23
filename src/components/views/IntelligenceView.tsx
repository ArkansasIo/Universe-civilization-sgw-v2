import React from 'react';
import { Eye, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { CovertMissionRecord } from '../../types';

interface IntelligenceViewProps {
  missions: CovertMissionRecord[];
  onNavigate: (route: string) => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({ missions, onNavigate }) => {
  return (
    <div id="intelligence-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          INTELLIGENCE BUREAU · CLASSIFIED DOSSIERS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Espionage Logs & Enemy Intel</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
          Subspace reconnaissance records and captured enemy telemetry gathered from infiltration missions.
          Cross-reference target garrison sizes before committing fleet invasions.
        </p>
      </div>

      <div className="border border-[#dedede] bg-white p-6">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
          <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
            Reconnaissance Mission History
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('spy')}
            className="text-xs font-bold text-[#111111] hover:underline"
          >
            Launch New Covert Mission →
          </button>
        </div>

        {missions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#777777]">
            <FileText size={28} className="mx-auto text-[#cccccc] mb-2" />
            No intelligence missions conducted yet. Infiltrate a hostile realm to populate archives.
          </div>
        ) : (
          <div className="divide-y divide-[#eeeeee]">
            {missions.map((m) => (
              <div key={m.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.success ? (
                      <CheckCircle2 size={16} className="text-[#111111]" />
                    ) : (
                      <ShieldAlert size={16} className="text-[#dc2626]" />
                    )}
                    <strong className="text-xs font-bold text-[#111111]">
                      Target: {m.targetName}
                    </strong>
                    <span className="px-1.5 py-0.5 border border-[#dedede] text-[10px] text-[#666666] uppercase">
                      {m.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#888888]">{m.timestamp}</span>
                </div>

                <p className="text-xs text-[#555555]">{m.resultText}</p>

                {m.intel && (
                  <div className="grid grid-cols-3 gap-3 bg-[#fafafa] border border-[#dedede] p-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#777777] block uppercase font-bold">Defense Garrison</span>
                      <b className="font-mono text-[#111111]">{m.intel.defenseUnits.toLocaleString()} troops</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#777777] block uppercase font-bold">Strike Force</span>
                      <b className="font-mono text-[#111111]">{m.intel.attackUnits.toLocaleString()} troops</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#777777] block uppercase font-bold">Liquid Reserves</span>
                      <b className="font-mono text-[#111111]">{m.intel.naquadah.toLocaleString()} NQ</b>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
