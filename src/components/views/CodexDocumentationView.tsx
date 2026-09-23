import React, { useState } from 'react';
import { BookOpen, Calculator, Compass, Shield, Swords, Layers, Zap, Info } from 'lucide-react';
import { sound } from '../../sound';

export const CodexDocumentationView: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('loop');

  const SECTIONS = [
    { id: 'loop', title: '60-System Master Loop', icon: '🌌' },
    { id: 'formulas', title: 'Combat & Income Formulas', icon: '🧮' },
    { id: 'ogame_stellaris', title: 'OGame & Stellaris Mechanics', icon: '🪐' },
    { id: 'fitting_eve', title: 'EVE-Inspired Fitting & 6 Armors', icon: '🛡' },
    { id: 'rpg_progression', title: '999 Levels & RPG Progression', icon: '👑' },
  ];

  return (
    <div className="space-y-6" id="codex-documentation-root">
      {/* Header */}
      <div className="p-6 bg-white border border-[#dedede] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#777777] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#111111]" />
            <span>FEATURE 56 · IN-GAME STRATEGIC CODEX & GDD DOCUMENTATION</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Galactic Strategy Codex & Design Manual</h1>
          <p className="text-xs text-[#555555] mt-1">
            Official operational documentation explaining game engine mathematical formulas, multi-layered armor mitigation, and OGame/Stellaris/EVE hybrid systems.
          </p>
        </div>
      </div>

      {/* Grid with Left Nav & Right Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="space-y-1">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => { sound.play('click'); setSelectedSection(sec.id); }}
              className={`w-full text-left p-3 border text-xs font-bold transition-colors cursor-pointer flex items-center gap-2.5 ${
                selectedSection === sec.id
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#dedede] bg-white text-[#333] hover:bg-[#fafafa]'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 p-6 bg-white border border-[#dedede] space-y-4">
          {selectedSection === 'loop' && (
            <div className="space-y-4 text-xs text-[#444] leading-relaxed">
              <h2 className="text-base font-bold text-[#111111]">The Integrated 60-Feature Game Loop (Feature 60)</h2>
              <div className="p-4 bg-[#fafafa] border border-[#eee] font-mono text-xs text-[#222]">
                <strong>Explore</strong> → Scan Systems → Claim & Colonize Planets → Develop Infrastructure → Extract Metal / Crystal / Deuterium → Research Technology Trees → Construct 90+ Ship Classes → Fit Hardpoints & Armor Plates → Assemble Armadas → Fight Tactical Battles → Salvage Debris → Enact Civilization Traditions → Expand Federation Alliances → Build Megastructures.
              </div>
              <p>
                Every sub-system is authoritatively linked: higher planet happiness boosts mine throughput; scientific lab specialization reduces shipyard cycle times; and tactical commander officers provide fleet-wide aura multipliers.
              </p>
            </div>
          )}

          {selectedSection === 'formulas' && (
            <div className="space-y-4 text-xs text-[#444] leading-relaxed">
              <h2 className="text-base font-bold text-[#111111]">Core Mathematical Formulas</h2>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#fafafa] border border-[#eee]">
                  <strong className="text-[#111111] block mb-1">Gross Natural Income:</strong>
                  <code>Gross = ((Untrained × 20) + ((Miners + Lifers) × 80) + PlanetBonuses) × RaceModifier × DefconMultiplier</code>
                </div>
                <div className="p-3 bg-[#fafafa] border border-[#eee]">
                  <strong className="text-[#111111] block mb-1">Effective Hit Points (EHP):</strong>
                  <code>EHP = (Base Hull HP + Total Shield Buffer + Total Armor Plating) / (1 - AverageResist%)</code>
                </div>
                <div className="p-3 bg-[#fafafa] border border-[#eee]">
                  <strong className="text-[#111111] block mb-1">Bank Vault Capacity:</strong>
                  <code>Vault Capacity = Max(350,000, GrossIncome × 72)</code>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'ogame_stellaris' && (
            <div className="space-y-4 text-xs text-[#444] leading-relaxed">
              <h2 className="text-base font-bold text-[#111111]">OGame & Stellaris Hybrid Mechanics (Features 57 & 58)</h2>
              <p>
                <strong>OGame Foundations:</strong> Rapid fire tables, metal/crystal/deuterium mine exponential cost scaling (Base × 1.5^Level), sensor phalanx fleet scanning across galaxies, moon creation upon catastrophic fleet destruction debris fields.
              </p>
              <p>
                <strong>Stellaris Expansions:</strong> Deep civilization ethics, demographic job strata, planetary unrest and revolts, multi-stage Megastructures (Dyson Sphere, Science Nexus), and dynamic bilateral diplomacy treaties.
              </p>
            </div>
          )}

          {selectedSection === 'fitting_eve' && (
            <div className="space-y-4 text-xs text-[#444] leading-relaxed">
              <h2 className="text-base font-bold text-[#111111]">EVE-Inspired Ship Fitting & Six-Type Armor (Features 11 & 12)</h2>
              <p>
                Combat vessels require careful powergrid (MW) and CPU (Teraflops) loadout budgeting. The six armor damage types determine penetration:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                <li><strong>Kinetic:</strong> High against shields and structural bulkheads.</li>
                <li><strong>Thermal:</strong> Coherent energy melting armor layers.</li>
                <li><strong>Explosive:</strong> High alpha blast radius against swarms.</li>
                <li><strong>Corrosive:</strong> Acidic bio-degradation dissolving defense ratings.</li>
                <li><strong>Graviton:</strong> Space-time shear piercing kinetic deflectors.</li>
                <li><strong>Neutron:</strong> Sub-atomic radiation neutralizing active shield matrices.</li>
              </ul>
            </div>
          )}

          {selectedSection === 'rpg_progression' && (
            <div className="space-y-4 text-xs text-[#444] leading-relaxed">
              <h2 className="text-base font-bold text-[#111111]">999 Levels & RPG Progression (Features 25, 26, 27)</h2>
              <p>
                Commanders progress through 999 discrete experience levels across 99 prestige tiers. Every milestone awards talent specialization points to allocate into Fleet Command, Covert Black Ops, Industrial Nanomanufacturing, and Megastructure Engineering.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
