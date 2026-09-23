import React from 'react';
import { Shield, Sparkles, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate?: (route: string) => void;
  onOpenPatchNotes?: () => void;
  onOpenSaveManager?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPatchNotes,
  onOpenSaveManager,
}) => {
  return (
    <footer
      id="app-footer"
      className="border-t border-[#dedede] bg-white px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] shrink-0 gap-3"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono font-bold text-[#111111]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>UNIVERSE CIVILIZATION: STELLAR DOMINION</span>
        </div>
        <span className="text-[#cccccc]">|</span>
        <span className="font-mono text-[11px] text-[#777777]">
          VER: <strong className="text-[#111111]">v3.5.0-RELEASE</strong>
        </span>
        <span className="text-[#cccccc]">|</span>
        <span className="font-mono text-[11px] text-[#777777]">
          BUILD: <strong className="text-[#111111]">#60-SYSTEMS-SYNCED</strong>
        </span>
        <span className="text-[#cccccc]">|</span>
        <span className="font-mono text-[11px] text-[#777777]">
          UID: <strong className="text-[#111111]">UC-88942-X9</strong>
        </span>
      </div>

      <div className="flex items-center gap-4 font-medium flex-wrap">
        <span className="text-xs text-[#444444] font-semibold">
          Lead Developer: <strong className="text-[#111111] font-bold">Stephen</strong>
        </span>
        {onOpenPatchNotes && (
          <button
            type="button"
            onClick={onOpenPatchNotes}
            className="text-amber-600 hover:text-amber-800 font-semibold cursor-pointer text-[11px] font-mono flex items-center gap-1"
          >
            <Sparkles size={12} />
            <span>v3.5 Patch Notes</span>
          </button>
        )}
        {onOpenSaveManager && (
          <button
            type="button"
            onClick={onOpenSaveManager}
            className="hover:text-[#111111] underline cursor-pointer text-[11px] font-mono"
          >
            Save / State Vault
          </button>
        )}
        {onNavigate && (
          <>
            <button
              type="button"
              onClick={() => onNavigate('codex-doc')}
              className="hover:text-[#111111] underline cursor-pointer text-[11px] font-mono"
            >
              Strategy Codex
            </button>
            <button
              type="button"
              onClick={() => onNavigate('cron-jobs')}
              className="hover:text-[#111111] underline cursor-pointer text-[11px] font-mono"
            >
              Server Cron
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
