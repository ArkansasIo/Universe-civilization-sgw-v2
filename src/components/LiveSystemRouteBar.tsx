import React from 'react';
import { Globe, Pickaxe, Coins, Atom, Wrench, Rocket, Swords, Crown, ChevronRight } from 'lucide-react';
import { sound } from '../sound';

interface LiveSystemRouteBarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export const LiveSystemRouteBar: React.FC<LiveSystemRouteBarProps> = ({ activeRoute, onNavigate }) => {
  const STEPS = [
    { id: 'overview', label: '1. Planet', icon: Globe, route: 'overview' },
    { id: 'buildings', label: '2. Production', icon: Pickaxe, route: 'buildings' },
    { id: 'resources', label: '3. Resources', icon: Coins, route: 'resources' },
    { id: 'research', label: '4. Research', icon: Atom, route: 'research' },
    { id: 'shipyard', label: '5. Shipyard', icon: Wrench, route: 'shipyard' },
    { id: 'fleet', label: '6. Fleet', icon: Rocket, route: 'fleet' },
    { id: 'combat', label: '7. Combat', icon: Swords, route: 'combat' },
    { id: 'universe', label: '8. Expansion', icon: Crown, route: 'universe' },
  ];

  return (
    <div className="bg-white border-b border-[#dedede] px-4 py-1.5 flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono select-none" id="live-system-route-bar">
      <div className="flex items-center gap-1 min-w-max">
        <span className="text-[10px] font-bold uppercase text-[#888] mr-2">CORE 8-STEP CYCLE:</span>
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeRoute === step.route;
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  sound.play('click');
                  onNavigate(step.route);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#555555] hover:bg-[#f0f0f0] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#ccc] shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
