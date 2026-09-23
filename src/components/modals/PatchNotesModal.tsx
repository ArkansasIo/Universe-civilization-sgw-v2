import React from 'react';
import { X, Sparkles, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { sound } from '../../sound';

interface PatchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatchNotesModal: React.FC<PatchNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="patch-notes-modal">
      <div className="bg-white border border-[#dedede] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#dedede] flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Stellar Dominion v3.5.0 Master Patch Notes
            </h2>
          </div>
          <button
            onClick={() => { sound.play('click'); onClose(); }}
            className="p-1 hover:bg-[#eee] cursor-pointer"
          >
            <X className="w-5 h-5 text-[#666]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#444] leading-relaxed">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Client & Server Protocol v3.5.0 Synchronized · 60 System Core Features Operational</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#111111] mb-2">⭐ Major System Additions</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Homeworld [1:204:8] & Sovereign World Dropdown System:</strong> Interactive header dropdown button menu displaying all owned worlds with coordinate tags (e.g. Homeworld Earth <code>[1:204:8]</code>, Alpha Site <code>[1:12:4]</code>, Chulak <code>[1:44:8]</code>, Abydos <code>[2:5:3]</code>), building field usages, attached moon indicators, income stats, and instant sub-menu jump triggers.</li>
              <li><strong>Planetary Sub-Menus & Deep Colonial Pages:</strong> 7 comprehensive colonial management sub-systems: (1) Overview & Biosphere Astrometry, (2) Mines & Subterranean Energy Grid (Metal, Crystal, Deut, Naquadah Core Tap, Solar, Fusion), (3) High-Tech Planetary Facilities (Robotics, Shipyard, Research Labs, Nanite Factory, Terraformer), (4) Hardened Defense Grid Matrix (Rocket Pods, Lasers, Gauss, Plasma Turrets, Shield Domes, ABM/IPM Silos), (5) Lunar Base, Sensor Phalanx & Instant Jump Gates, (6) Governance Directives & Specializations, and (7) All Empire Worlds Macro Comparison Matrix.</li>
              <li><strong>30 Multiverse Universes & 90 Galaxies per Universe (2,700 Total Galaxies):</strong> Complete inter-universal travel via Dimensional Supergates across 30 distinct cosmic realities (each with unique physics, cosmic modifiers, and ruling hegemonic factions), each housing exactly 90 unique galaxies and 89,910 star systems with full [U:G:S:P] coordinate navigation.</li>
              <li><strong>1 to 999,999 Procedural Planets Planetary Conquest Engine:</strong> Dial and explore any of the 999,999 procedural celestial worlds with deterministic seed hashing, Stargate 7-chevron addresses, orbital flagship lance strikes, covert Stargate sabotage, ground assault dropships, diplomatic protectorate annexation, 6 colonial infrastructure facilities, tax directives, bookmark registry, and 1-click Imperial Tribute collection.</li>
              <li><strong>Mothership Hull Themes & Livery Studio:</strong> 7 aesthetic visual doctrines (Imperial Obsidian, Neon Cyberpunk, Precursor Xenotech, Void Stealth, Solar Paladin, Asgard Crystalline, and Chrono-Temporal Singularity) with interactive blueprint schematic visualizer, custom conduit pulse modes, and combat stat multipliers.</li>
              <li><strong>Expanded Mothership Titan & Flagship Nexus:</strong> 6-tier capital drydock chassis hierarchy, 12 modular subsystems, bridge officer promotions, carrier strike wings, deep space void recon with interactive branching anomaly events, and spinal Doomsday Lance.</li>
              <li><strong>60-System Feature Matrix:</strong> Implemented all 60 systems from Stellar Dominion 3.5 architecture.</li>
              <li><strong>EVE-Style Modular Ship Fitting (Feature 10 & 12):</strong> High, Medium, Low & Rig slot customizer with real-time CPU / Powergrid metrics.</li>
              <li><strong>Six-Type Armor Resistance Engine (Feature 11):</strong> Kinetic, Thermal, Explosive, Corrosive, Graviton, and Neutron damage absorption matrices.</li>
              <li><strong>Civilization, Population & Happiness (Features 18, 19, 20):</strong> Full demographic pop distribution, cultural traditions, stability meters, and empire welfare edicts.</li>
              <li><strong>Diplomacy, Treaties & Federations (Features 21 & 22):</strong> Bilateral agreements, embassy envoy assignments, and shared federation vaults.</li>
              <li><strong>Missions, Campaigns & Achievements (Features 28, 29, 30):</strong> Narrative chapter quests, active galactic countdown events, and title rewards.</li>
              <li><strong>Live 8-Step System Route Bar (Feature 40):</strong> Direct 1-click jumps across the entire game loop.</li>
              <li><strong>Strategic Codex & GDD Manual (Feature 56):</strong> Full in-game mathematical formulas, OGame/Stellaris mechanics, and fitting guides.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#dedede] bg-[#fafafa] flex justify-end">
          <button
            onClick={() => { sound.play('confirm'); onClose(); }}
            className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333] cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
