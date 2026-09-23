import React, { useState } from 'react';
import {
  OGameShip,
  OGameShipCategory,
  PlayerResources,
  ShipyardQueueItem,
  FleetFormation,
  FleetFormationType,
  FleetFormationPreset,
} from '../../types';
import { FLEET_FORMATIONS } from '../../ogameData';
import { sound } from '../../sound';

interface ShipyardViewProps {
  ships: OGameShip[];
  resources: PlayerResources;
  shipyardQueue: ShipyardQueueItem[];
  selectedFormation: FleetFormationType;
  onSelectFormation: (formation: FleetFormationType) => void;
  fleetPresets?: FleetFormationPreset[];
  activePresetId?: string | null;
  onSelectPreset?: (presetId: string) => void;
  onSavePreset?: (preset: FleetFormationPreset) => void;
  onDeletePreset?: (presetId: string) => void;
  onBuildShips: (shipId: string, quantity: number) => void;
  onCancelShipyardQueue: (queueId: string) => void;
  onNavigate?: (route: string) => void;
}

const CATEGORIES: { id: OGameShipCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Vessels', icon: '✦' },
  { id: 'civilian', label: 'Civilian & Haulers', icon: '📦' },
  { id: 'combat', label: 'Escorts & Cruisers', icon: '⚔' },
  { id: 'carrier', label: 'Carrier Wings', icon: '🛫' },
  { id: 'capital', label: 'Capital & Titans', icon: '👑' },
];

const PRESET_CODENAMES = [
  'Vanguard Strike Squadron',
  'Aegis Interceptor Flotilla',
  'Deep Space Survey Taskforce',
  'Solar Siege Dreadnought Wing',
  'Eclipse Planetary Raider',
  'Starlight Hauler Convoy',
  'Titan Omega Fleet',
  'Ghost Recon Vanguard',
  'Hydra Swarm Battleline',
  'Apex Dominion Armada',
];

export const ShipyardView: React.FC<ShipyardViewProps> = ({
  ships,
  resources,
  shipyardQueue,
  selectedFormation,
  onSelectFormation,
  fleetPresets = [],
  activePresetId = null,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
  onBuildShips,
  onCancelShipyardQueue,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'drydocks' | 'formations'>('drydocks');
  const [selectedCategory, setSelectedCategory] = useState<OGameShipCategory | 'all'>('all');
  const [buildQuantities, setBuildQuantities] = useState<Record<string, number>>({});
  const [selectedShip, setSelectedShip] = useState<OGameShip>(ships[0] || null);

  // Preset Management State
  const [presetFilter, setPresetFilter] = useState<'all' | 'attack' | 'expedition' | 'custom'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');
  const [presetFormation, setPresetFormation] = useState<FleetFormationType>('standard');
  const [presetComposition, setPresetComposition] = useState<Record<string, number>>({});
  const [presetTags, setPresetTags] = useState<('expedition' | 'attack' | 'defense' | 'custom')[]>(['attack', 'custom']);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredShips = ships.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  const getQuantityToBuild = (shipId: string) => buildQuantities[shipId] || 1;

  const handleSetQuantity = (shipId: string, qty: number) => {
    setBuildQuantities((prev) => ({
      ...prev,
      [shipId]: Math.max(1, qty),
    }));
  };

  const calculateMaxAffordable = (ship: OGameShip): number => {
    const maxM = ship.cost.metal > 0 ? Math.floor((resources.metal ?? 0) / ship.cost.metal) : 9999;
    const maxC = ship.cost.crystal > 0 ? Math.floor((resources.crystal ?? 0) / ship.cost.crystal) : 9999;
    const maxD = ship.cost.deuterium > 0 ? Math.floor((resources.deuterium ?? 0) / ship.cost.deuterium) : 9999;
    return Math.max(0, Math.min(maxM, maxC, maxD));
  };

  const canAfford = (ship: OGameShip, qty: number): boolean => {
    return (
      (resources.metal ?? 0) >= ship.cost.metal * qty &&
      (resources.crystal ?? 0) >= ship.cost.crystal * qty &&
      (resources.deuterium ?? 0) >= ship.cost.deuterium * qty
    );
  };

  const totalFleetSize = ships.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalFleetAttack = ships.reduce((sum, s) => sum + (s.weaponPower * (s.quantity || 0)), 0);
  const totalFleetShield = ships.reduce((sum, s) => sum + (s.shield * (s.quantity || 0)), 0);

  const activeFormation = FLEET_FORMATIONS.find((f) => f.id === selectedFormation) || FLEET_FORMATIONS[0];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Preset Editor Helpers
  const handleOpenNewPreset = () => {
    const randomName = PRESET_CODENAMES[Math.floor(Math.random() * PRESET_CODENAMES.length)];
    setEditingPresetId(null);
    setPresetName(randomName);
    setPresetDesc('Custom tactical taskforce configuration.');
    setPresetFormation(selectedFormation);
    // Seed with current ship counts or sensible defaults
    const initialComp: Record<string, number> = {};
    ships.forEach((s) => {
      if (s.quantity > 0) {
        initialComp[s.id] = Math.min(s.quantity, 10);
      }
    });
    setPresetComposition(initialComp);
    setPresetTags(['attack', 'custom']);
    setIsEditorOpen(true);
    sound.play('click');
  };

  const handleEditPreset = (preset: FleetFormationPreset) => {
    setEditingPresetId(preset.id);
    setPresetName(preset.name);
    setPresetDesc(preset.description || '');
    setPresetFormation(preset.formation);
    setPresetComposition({ ...preset.composition });
    setPresetTags(preset.tags || ['custom']);
    setIsEditorOpen(true);
    sound.play('click');
  };

  const handleSavePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) {
      alert('Please enter a name for the Fleet Formation Preset.');
      return;
    }

    const totalAssigned = Object.values(presetComposition).reduce((sum, v) => sum + (v || 0), 0);
    if (totalAssigned <= 0) {
      alert('Please assign at least 1 ship to this Fleet Formation Preset.');
      return;
    }

    const newPreset: FleetFormationPreset = {
      id: editingPresetId || `preset_${Date.now()}`,
      name: presetName.trim(),
      description: presetDesc.trim(),
      formation: presetFormation,
      composition: { ...presetComposition },
      createdAt: Date.now(),
      tags: presetTags.length > 0 ? presetTags : ['custom'],
    };

    if (onSavePreset) {
      onSavePreset(newPreset);
    }
    setIsEditorOpen(false);
    showNotification(`Fleet Formation Preset "${newPreset.name}" successfully saved!`);
  };

  const handleSaveCurrentHangarAsPreset = () => {
    const comp: Record<string, number> = {};
    let totalCount = 0;
    ships.forEach((s) => {
      if (s.quantity > 0) {
        comp[s.id] = s.quantity;
        totalCount += s.quantity;
      }
    });

    if (totalCount === 0) {
      alert('Your hangar currently has no ships to snapshot into a preset!');
      return;
    }

    const newPreset: FleetFormationPreset = {
      id: `preset_hangar_${Date.now()}`,
      name: `Hangar Snapshot (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      description: 'Snapshot of all active vessels in orbital hangar.',
      formation: selectedFormation,
      composition: comp,
      createdAt: Date.now(),
      tags: ['custom', 'attack', 'expedition'],
    };

    if (onSavePreset) {
      onSavePreset(newPreset);
    }
    showNotification(`Saved entire active hangar (${totalCount} hulls) as a new preset!`);
  };

  const handleApplyPreset = (preset: FleetFormationPreset) => {
    onSelectFormation(preset.formation);
    if (onSelectPreset) {
      onSelectPreset(preset.id);
    }
    sound.play('confirm');
    showNotification(`Formation doctrine set to "${preset.name}" (${preset.formation.toUpperCase()} formation active).`);
  };

  const handleBatchBuildMissing = (preset: FleetFormationPreset) => {
    let queuedBatches = 0;
    Object.entries(preset.composition).forEach(([shipId, targetQty]) => {
      const ship = ships.find((s) => s.id === shipId);
      if (!ship) return;
      const missing = Math.max(0, targetQty - ship.quantity);
      if (missing > 0 && canAfford(ship, missing)) {
        onBuildShips(shipId, missing);
        queuedBatches++;
      }
    });

    if (queuedBatches > 0) {
      showNotification(`Queued missing vessels for "${preset.name}" into the orbital shipyard!`);
    } else {
      showNotification('Either all ships are already built or insufficient resources for batch order.');
    }
  };

  // Preset Stats Calculations
  const getPresetStats = (preset: FleetFormationPreset) => {
    let totalHulls = 0;
    let totalAtk = 0;
    let totalShield = 0;
    let totalCargo = 0;
    let totalFuel = 0;
    let minSpeed = 999999;
    let missingCount = 0;

    const formationDef = FLEET_FORMATIONS.find((f) => f.id === preset.formation) || FLEET_FORMATIONS[0];

    Object.entries(preset.composition).forEach(([shipId, qty]) => {
      if (qty <= 0) return;
      const ship = ships.find((s) => s.id === shipId);
      if (ship) {
        totalHulls += qty;
        totalAtk += ship.weaponPower * qty;
        totalShield += ship.shield * qty;
        totalCargo += ship.cargoCapacity * qty;
        totalFuel += ship.fuelConsumption * qty;
        minSpeed = Math.min(minSpeed, ship.speed);
        if (ship.quantity < qty) {
          missingCount += (qty - ship.quantity);
        }
      }
    });

    if (minSpeed === 999999) minSpeed = 0;

    const effectiveAtk = Math.round(totalAtk * formationDef.attackModifier);
    const effectiveShield = Math.round(totalShield * formationDef.defenseModifier);
    const effectiveSpeed = Math.round(minSpeed * formationDef.speedModifier);

    return {
      totalHulls,
      effectiveAtk,
      effectiveShield,
      effectiveSpeed,
      totalCargo,
      totalFuel,
      missingCount,
      formationDef,
      isFullyReady: missingCount === 0 && totalHulls > 0,
    };
  };

  const filteredPresets = fleetPresets.filter((p) => {
    if (presetFilter === 'all') return true;
    if (presetFilter === 'custom') return p.tags?.includes('custom');
    if (presetFilter === 'attack') return p.tags?.includes('attack');
    if (presetFilter === 'expedition') return p.tags?.includes('expedition');
    return true;
  });

  return (
    <div id="shipyard-view" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-white p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-wider">ORBITAL SHIPYARD & NAVAL COMMAND</span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-[#f8fafc]">
                GAME SPEC §17-21, 25
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1">
              Zero-g drydocks constructing civilian transports, heavy capital cruisers, fighter carriers,
              and planet-breaker Titan flagships. Configure fleet combat doctrines and tactical formations.
            </p>
          </div>

          {/* Fleet Readiness Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="border border-[#111111] bg-[#f8fafc] p-2.5 min-w-[120px]">
              <div className="text-[10px] text-[#666666]">ACTIVE FLEET</div>
              <div className="font-bold text-[#111111]">{totalFleetSize.toLocaleString()} Hulls</div>
            </div>
            <div className="border border-[#111111] bg-[#f8fafc] p-2.5 min-w-[120px]">
              <div className="text-[10px] text-[#666666]">ALPHA ATTACK</div>
              <div className="font-bold text-[#22c55e]">
                {Math.round(totalFleetAttack * activeFormation.attackModifier).toLocaleString()}
              </div>
            </div>
            <div className="border border-[#111111] bg-[#f8fafc] p-2.5 min-w-[120px]">
              <div className="text-[10px] text-[#666666]">DEFLECTOR RATING</div>
              <div className="font-bold text-[#2563eb]">
                {Math.round(totalFleetShield * activeFormation.defenseModifier).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Fleet Formation Selector & Preset Quickbar */}
        <div className="mt-4 pt-3 border-t border-[#e2e8f0] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111111]">Tactical Fleet Formation Doctrine:</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#111111] text-white">
                {activeFormation.name.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#666666]">
              Atk: x{activeFormation.attackModifier} | Def: x{activeFormation.defenseModifier} | Spd: x{activeFormation.speedModifier} | Flagship Guard: x{activeFormation.flagshipProtection}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {FLEET_FORMATIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    onSelectFormation(f.id);
                  }}
                  className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border ${
                    selectedFormation === f.id
                      ? 'border-[#111111] bg-[#111111] text-white font-bold'
                      : 'border-[#cccccc] hover:border-[#111111] bg-white text-[#111111]'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveCurrentHangarAsPreset}
              className="px-3 py-1 text-xs font-mono border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white font-semibold transition-colors cursor-pointer"
            >
              + Save Current Hangar as Preset
            </button>
          </div>
        </div>
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div className="p-3 border border-[#22c55e] bg-[#f0fdf4] text-[#166534] text-xs font-mono font-bold flex items-center justify-between animate-fade-in">
          <span>✓ {statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main View Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#111111] pb-2">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('drydocks');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors cursor-pointer border ${
            activeTab === 'drydocks'
              ? 'border-[#111111] bg-[#111111] text-white'
              : 'border-[#cccccc] bg-white text-[#111111] hover:border-[#111111]'
          }`}
        >
          ⚙ Drydocks & Hull Construction
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('formations');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
            activeTab === 'formations'
              ? 'border-[#111111] bg-[#111111] text-white'
              : 'border-[#cccccc] bg-white text-[#111111] hover:border-[#111111]'
          }`}
        >
          <span>❖ Fleet Formations & Saved Presets</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded bg-amber-500 text-white font-mono">
            {fleetPresets.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DRYDOCKS & SHIP CONSTRUCTION */}
      {/* ========================================================================= */}
      {activeTab === 'drydocks' && (
        <div className="space-y-6">
          {/* Active Shipyard Production Queue */}
          {shipyardQueue.length > 0 && (
            <div className="border border-[#111111] bg-white p-4">
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
                  ORBITAL SHIPYARD PRODUCTION QUEUE ({shipyardQueue.length} Batches)
                </span>
              </div>

              <div className="space-y-3">
                {shipyardQueue.map((item) => {
                  const progressPercent = Math.min(
                    100,
                    Math.max(
                      5,
                      ((item.totalTimeSeconds - item.remainingSeconds) / item.totalTimeSeconds) * 100
                    )
                  );

                  return (
                    <div key={item.id} className="p-3 border border-[#e2e8f0] bg-[#f8fafc]">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-bold text-[#111111]">
                          {item.shipName} × {item.quantity} units ({item.completedQuantity}/{item.quantity} built)
                        </span>
                        <span className="text-[#666666]">
                          Time remaining: {formatSeconds(item.remainingSeconds)}
                        </span>
                      </div>

                      <div className="w-full bg-[#e2e8f0] h-2 mb-2 overflow-hidden">
                        <div
                          className="bg-[#111111] h-full transition-all duration-1000"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onCancelShipyardQueue(item.id)}
                          className="text-[11px] font-mono text-[#dc2626] hover:underline cursor-pointer"
                        >
                          [Cancel Construction Order]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Grid: Category filter + Ship cards (8 cols) + Detail Dossier (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'border-[#111111] bg-[#111111] text-white font-bold'
                        : 'border-[#cccccc] hover:border-[#111111] bg-white text-[#111111]'
                    }`}
                  >
                    <span>{cat.icon}</span> <span className="ml-1">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShips.map((ship) => {
                  const qty = getQuantityToBuild(ship.id);
                  const affordable = canAfford(ship, qty);
                  const maxAfford = calculateMaxAffordable(ship);
                  const isSelected = selectedShip?.id === ship.id;

                  return (
                    <div
                      key={ship.id}
                      onClick={() => setSelectedShip(ship)}
                      className={`border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#111111] bg-white ring-2 ring-[#111111]'
                          : 'border-[#cccccc] hover:border-[#111111] bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#666666]">
                              {ship.category} Class
                            </span>
                            <h4 className="text-sm font-bold text-[#111111]">{ship.name}</h4>
                          </div>

                          <span className="px-2 py-0.5 text-xs font-mono font-bold border border-[#111111] bg-[#f8fafc]">
                            In Hangar: {ship.quantity}
                          </span>
                        </div>

                        <p className="text-xs text-[#555555] line-clamp-2 mb-3">
                          {ship.description}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono mb-3 bg-[#f8fafc] p-2 border border-[#e2e8f0]">
                          <div>
                            <span className="text-[#666666] block text-[9px]">Hull</span>
                            <span className="font-semibold text-[#111111]">{ship.structure.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[9px]">Shield</span>
                            <span className="font-semibold text-[#111111]">{ship.shield.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[9px]">Attack</span>
                            <span className="font-semibold text-[#111111]">{ship.weaponPower.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[9px]">Cargo</span>
                            <span className="font-semibold text-[#111111]">{ship.cargoCapacity.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[9px]">Speed</span>
                            <span className="font-semibold text-[#111111]">{ship.speed.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] block text-[9px]">Build Time</span>
                            <span className="font-semibold text-[#111111]">{ship.buildTimeSeconds}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Order Bar */}
                      <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#666666]">
                          <span>
                            Cost (×{qty}): M {(ship.cost.metal * qty).toLocaleString()} | C{' '}
                            {(ship.cost.crystal * qty).toLocaleString()}
                            {ship.cost.deuterium > 0 && ` | D ${(ship.cost.deuterium * qty).toLocaleString()}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-[#cccccc] bg-white">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetQuantity(ship.id, Math.max(1, qty - 1));
                              }}
                              className="px-2 py-1 text-xs font-mono hover:bg-[#f1f5f9] cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="9999"
                              value={qty}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleSetQuantity(ship.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center text-xs font-mono outline-none"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetQuantity(ship.id, qty + 1);
                              }}
                              className="px-2 py-1 text-xs font-mono hover:bg-[#f1f5f9] cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetQuantity(ship.id, Math.max(1, maxAfford));
                            }}
                            className="px-2 py-1 text-[10px] font-mono border border-[#cccccc] hover:border-[#111111] bg-[#f8fafc] cursor-pointer"
                          >
                            Max ({maxAfford})
                          </button>

                          <button
                            type="button"
                            disabled={!affordable || qty <= 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBuildShips(ship.id, qty);
                            }}
                            className={`flex-1 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer border ${
                              !affordable
                                ? 'border-[#cccccc] bg-[#f8fafc] text-[#888888] cursor-not-allowed'
                                : 'border-[#111111] bg-[#111111] text-white hover:bg-black'
                            }`}
                          >
                            {affordable ? `Construct ×${qty}` : 'Need Ore'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Dossier (4 cols) */}
            <div className="lg:col-span-4">
              {selectedShip && (
                <div className="border border-[#111111] bg-white p-5 sticky top-6 space-y-4 font-mono text-xs">
                  <div className="border-b border-[#111111] pb-3">
                    <span className="text-[10px] text-[#666666] uppercase">NAVAL SPECIFICATION</span>
                    <h3 className="text-base font-bold text-[#111111] mt-0.5">{selectedShip.name}</h3>
                    <div className="text-xs text-[#666666] mt-1">
                      Active in Hangar: <span className="font-bold text-[#111111]">{selectedShip.quantity} units</span>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[#111111] mb-1">Combat Doctrine:</div>
                    <p className="text-[#444444] leading-relaxed">{selectedShip.description}</p>
                  </div>

                  {/* Rapid-Fire Matrix */}
                  {Object.keys(selectedShip.rapidfireAgainst).length > 0 && (
                    <div className="border border-[#e2e8f0] bg-[#f8fafc] p-3">
                      <div className="font-bold text-[#111111] mb-1.5 flex items-center gap-1.5">
                        <span>⚡</span> RAPID-FIRE MULTIPLIERS
                      </div>
                      <div className="space-y-1 text-[11px]">
                        {Object.entries(selectedShip.rapidfireAgainst).map(([target, rate]) => (
                          <div key={target} className="flex justify-between">
                            <span className="capitalize">{target.replace('_', ' ')}:</span>
                            <span className="font-bold text-[#22c55e]">{rate} shots / round</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Specifications */}
                  <div className="border-t border-[#e2e8f0] pt-3">
                    <div className="font-bold text-[#111111] mb-2">Technical Telemetry:</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Hull Structural Points:</span>
                        <span className="font-bold">{selectedShip.structure.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Deflector Shielding:</span>
                        <span className="font-bold">{selectedShip.shield.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Weapon Cannon Damage:</span>
                        <span className="font-bold">{selectedShip.weaponPower.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Cargo Bay Capacity:</span>
                        <span className="font-bold">{selectedShip.cargoCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Subspace Velocity:</span>
                        <span className="font-bold">{selectedShip.speed.toLocaleString()} km/s</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                        <span className="text-[#666666]">Fuel Burn Rate:</span>
                        <span className="font-bold">{selectedShip.fuelConsumption} Deuterium</span>
                      </div>
                      {selectedShip.hangarCapacity && (
                        <div className="flex justify-between py-1 border-b border-[#f1f5f9] text-[#2563eb]">
                          <span>Fighter Hangar Capacity:</span>
                          <span className="font-bold">{selectedShip.hangarCapacity} craft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FLEET FORMATIONS & PRESETS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'formations' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="border border-[#111111] bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#111111] tracking-wider uppercase">
                SAVED FLEET FORMATION PRESETS
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Save bespoke fleet compositions and tactical doctrines for rapid one-click deployment in Deep Space Expeditions and Planetary Attack strikes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewPreset}
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-white hover:bg-black transition-colors cursor-pointer"
              >
                + Create New Preset
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentHangarAsPreset}
                className="px-3 py-2 text-xs font-mono border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Snapshot Hangar
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#666666] mr-1">Filter:</span>
            {[
              { id: 'preset_all', label: 'All Presets' },
              { id: 'preset_attack', label: '⚔ Attack Armadas' },
              { id: 'preset_expedition', label: '🌌 Expedition Vanguards' },
              { id: 'preset_custom', label: '★ Custom Saved' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setPresetFilter((f.id === 'preset_all' ? 'all' : f.id.replace('preset_', '')) as any)}
                className={`px-3 py-1 text-xs font-mono border cursor-pointer transition-colors ${
                  presetFilter === (f.id === 'preset_all' ? 'all' : f.id.replace('preset_', ''))
                    ? 'border-[#111111] bg-[#111111] text-white font-bold'
                    : 'border-[#cccccc] bg-white text-[#111111] hover:border-[#111111]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPresets.map((preset) => {
              const stats = getPresetStats(preset);
              const isActive = activePresetId === preset.id || selectedFormation === preset.formation;

              return (
                <div
                  key={preset.id}
                  className={`border p-5 bg-white flex flex-col justify-between transition-all ${
                    isActive
                      ? 'border-[#111111] ring-2 ring-[#111111] shadow-sm'
                      : 'border-[#cccccc] hover:border-[#111111]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#e2e8f0] pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#111111]">{preset.name}</h4>
                          {isActive && (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#22c55e] text-white uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-[#f8fafc] font-semibold uppercase">
                            {stats.formationDef.name}
                          </span>
                          {preset.tags?.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#f1f5f9] text-[#475569]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#111111] block">
                          {stats.totalHulls} Hulls
                        </span>
                        {stats.isFullyReady ? (
                          <span className="text-[10px] font-mono text-[#22c55e] font-bold">● Hangar Ready</span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#eab308] font-bold">
                            Missing {stats.missingCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {preset.description && (
                      <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>
                    )}

                    {/* Tactical Telemetry */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono p-2 border border-[#e2e8f0] bg-[#f8fafc]">
                      <div>
                        <span className="text-[#666666] block text-[9px]">Alpha Strike</span>
                        <span className="font-bold text-[#22c55e]">{stats.effectiveAtk.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[9px]">Shields</span>
                        <span className="font-bold text-[#2563eb]">{stats.effectiveShield.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[9px]">Formation Speed</span>
                        <span className="font-bold text-[#111111]">{stats.effectiveSpeed.toLocaleString()} km/s</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[9px]">Cargo Bay</span>
                        <span className="font-bold text-[#111111]">{stats.totalCargo.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[9px]">Fuel Burn</span>
                        <span className="font-bold text-[#111111]">{stats.totalFuel.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[9px]">Doctrine Bonus</span>
                        <span className="font-bold text-[#7c3aed]">x{stats.formationDef.attackModifier} Atk</span>
                      </div>
                    </div>

                    {/* Ship Composition Breakdown */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#666666] block">
                        Composition Roster:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {Object.entries(preset.composition).map(([shipId, qty]) => {
                          if (qty <= 0) return null;
                          const ship = ships.find((s) => s.id === shipId);
                          const inHangar = ship?.quantity || 0;
                          const isShort = inHangar < qty;

                          return (
                            <span
                              key={shipId}
                              className={`px-2 py-0.5 text-[11px] font-mono border flex items-center gap-1 ${
                                isShort
                                  ? 'border-[#fca5a5] bg-[#fff1f2] text-[#991b1b]'
                                  : 'border-[#e2e8f0] bg-white text-[#111111]'
                              }`}
                            >
                              <span className="font-bold">{ship?.name || shipId}</span>
                              <span className="text-[10px] text-[#666666]">
                                ×{qty} ({inHangar}/{qty})
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#e2e8f0] space-y-2 mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="py-1.5 text-xs font-mono font-bold bg-[#111111] text-white hover:bg-black transition-colors cursor-pointer text-center"
                      >
                        Apply Doctrine
                      </button>

                      {stats.missingCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleBatchBuildMissing(preset)}
                          className="py-1.5 text-xs font-mono font-bold border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer text-center"
                        >
                          Build Missing ({stats.missingCount})
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyPreset(preset);
                            if (onNavigate) onNavigate('expeditions');
                          }}
                          className="py-1.5 text-xs font-mono font-bold border border-[#22c55e] bg-[#f0fdf4] text-[#15803d] hover:bg-[#22c55e] hover:text-white transition-colors cursor-pointer text-center"
                        >
                          Launch Expedition →
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#666666]">
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyPreset(preset);
                          if (onNavigate) onNavigate('targets');
                        }}
                        className="hover:text-[#111111] underline cursor-pointer"
                      >
                        [Deploy to Combat Raid]
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditPreset(preset)}
                          className="hover:text-[#111111] underline cursor-pointer"
                        >
                          Edit
                        </button>
                        {onDeletePreset && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete Fleet Preset "${preset.name}"?`)) {
                                onDeletePreset(preset.id);
                              }
                            }}
                            className="text-[#dc2626] hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRESET CREATOR / EDITOR STUDIO */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#111111] max-w-2xl w-full p-6 space-y-5 animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-[#111111] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#666666] uppercase">FLEET FORMATION WORKSHOP</span>
                <h3 className="text-base font-bold text-[#111111]">
                  {editingPresetId ? 'Edit Fleet Formation Preset' : 'Create & Name Fleet Formation Preset'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-lg font-bold hover:text-[#dc2626] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePresetSubmit} className="space-y-4">
              {/* Preset Name & Tactical Codename Generator */}
              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                  Preset Name / Tactical Fleet Call-Sign:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="e.g. 7th Strike Armada"
                    className="flex-1 px-3 py-2 border border-[#cccccc] focus:border-[#111111] outline-none text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const rand = PRESET_CODENAMES[Math.floor(Math.random() * PRESET_CODENAMES.length)];
                      setPresetName(rand);
                    }}
                    className="px-3 py-2 text-xs font-mono border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white cursor-pointer"
                  >
                    🎲 Codename
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                  Tactical Operational Role & Description:
                </label>
                <input
                  type="text"
                  value={presetDesc}
                  onChange={(e) => setPresetDesc(e.target.value)}
                  placeholder="e.g. Heavy siege fleet with long-range broadside artillery"
                  className="w-full px-3 py-2 border border-[#cccccc] focus:border-[#111111] outline-none text-xs font-mono"
                />
              </div>

              {/* Tactical Formation Selection */}
              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1">
                  Formation Combat Doctrine:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FLEET_FORMATIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setPresetFormation(f.id)}
                      className={`p-2.5 text-left border cursor-pointer transition-all ${
                        presetFormation === f.id
                          ? 'border-[#111111] bg-[#111111] text-white font-bold'
                          : 'border-[#cccccc] hover:border-[#111111] bg-white text-[#111111]'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.name}</div>
                      <div
                        className={`text-[10px] font-mono mt-1 ${
                          presetFormation === f.id ? 'text-neutral-300' : 'text-[#666666]'
                        }`}
                      >
                        Atk: x{f.attackModifier} | Def: x{f.defenseModifier} | Spd: x{f.speedModifier}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ships Composition Allocation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-[#111111]">
                    Assign Ship Quantities:
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const comp: Record<string, number> = {};
                        ships.forEach((s) => {
                          if (s.quantity > 0) comp[s.id] = s.quantity;
                        });
                        setPresetComposition(comp);
                      }}
                      className="px-2 py-0.5 border border-[#cccccc] bg-[#f8fafc] hover:border-[#111111] cursor-pointer"
                    >
                      Max Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetComposition({})}
                      className="px-2 py-0.5 border border-[#cccccc] bg-[#f8fafc] hover:border-[#111111] text-[#dc2626] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto border border-[#e2e8f0] p-2 space-y-1.5 bg-[#f8fafc]">
                  {ships.map((ship) => {
                    const currentQty = presetComposition[ship.id] || 0;

                    return (
                      <div
                        key={ship.id}
                        className="p-2 bg-white border border-[#e2e8f0] flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <span className="font-bold text-[#111111]">{ship.name}</span>
                          <span className="text-[#666666] ml-2 text-[10px]">
                            (In Hangar: {ship.quantity} | Atk: {ship.weaponPower} | Shield: {ship.shield})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPresetComposition((prev) => ({
                                ...prev,
                                [ship.id]: Math.max(0, currentQty - 1),
                              }))
                            }
                            className="w-6 h-6 border border-[#cccccc] bg-[#f8fafc] flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            value={currentQty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setPresetComposition((prev) => ({
                                ...prev,
                                [ship.id]: val,
                              }));
                            }}
                            className="w-14 text-center px-1 py-0.5 border border-[#cccccc] text-xs font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPresetComposition((prev) => ({
                                ...prev,
                                [ship.id]: currentQty + 1,
                              }))
                            }
                            className="w-6 h-6 border border-[#cccccc] bg-[#f8fafc] flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPresetComposition((prev) => ({
                                ...prev,
                                [ship.id]: currentQty + 5,
                              }))
                            }
                            className="px-1.5 py-0.5 text-[10px] border border-[#cccccc] bg-[#f8fafc] hover:bg-slate-200 cursor-pointer"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPresetComposition((prev) => ({
                                ...prev,
                                [ship.id]: ship.quantity,
                              }))
                            }
                            className="px-1.5 py-0.5 text-[10px] border border-[#cccccc] bg-[#f8fafc] hover:bg-slate-200 cursor-pointer"
                          >
                            All
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-mono border border-[#cccccc] hover:border-[#111111] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-mono font-bold bg-[#111111] text-white hover:bg-black cursor-pointer"
                >
                  Save Fleet Formation Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
