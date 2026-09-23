import React, { useState, useEffect } from 'react';
import {
  Palette,
  Database,
  Terminal,
  Play,
  FileCode,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { THEMES, getActiveThemeId, setActiveThemeId, THEMES as ThemeList } from '../../config/themeConfig';
import { dbManager, SqlQueryResult } from '../../db/database_manager';
import { sound } from '../../sound';

export const DatabaseThemeManagerView: React.FC = () => {
  const [activeThemeId, setActiveThemeState] = useState<string>('theme_white_default');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM stargate_relics_vault;');
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'sql' | 'schema' | 'configs'>('themes');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const current = getActiveThemeId();
    setActiveThemeState(current);
    handleExecuteQuery('SELECT * FROM stargate_relics_vault;');
  }, []);

  const handleSelectTheme = (themeId: string) => {
    sound.play('click');
    setActiveThemeId(themeId);
    setActiveThemeState(themeId);
  };

  const handleExecuteQuery = async (sqlToRun?: string) => {
    const targetSql = sqlToRun || sqlQuery;
    setIsExecuting(true);
    sound.play('click');
    try {
      const res = await dbManager.executeSql(targetSql);
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    sound.play('success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const SAMPLE_SQL_QUERIES = [
    { label: 'View All Relics', sql: 'SELECT * FROM stargate_relics_vault;' },
    { label: 'View Imperial Resources', sql: 'SELECT * FROM imperial_resources;' },
    { label: 'View Warship Roster', sql: 'SELECT * FROM naval_shipyard ORDER BY tier_level DESC;' },
    { label: 'View User Profile', sql: 'SELECT * FROM users_profile;' },
  ];

  return (
    <div className="space-y-6" id="db-theme-manager-root">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl font-extrabold select-none">
          ⚙️
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                System Engine Config
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                Master CSS & Sub-CSS Engine
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              <Palette className="w-6 h-6 text-sky-400" />
              <span>Theme Studio & SQL Database Manager</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
              Configure system themes (Default White Background Theme vs Dark Navy Blue Theme), inspect modular Master/Sub CSS stylesheets, execute live SQL database queries, and inspect schema configs.
            </p>
          </div>

          <div className="bg-slate-900/90 p-3 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Active System Theme</span>
            <span className="text-sky-300 font-bold text-sm uppercase">
              {THEMES.find((t) => t.id === activeThemeId)?.name || 'Default White'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#dedede] pb-2">
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('themes');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'themes'
              ? 'bg-[#111] text-white border-[#111] shadow-md'
              : 'bg-white text-[#333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <Palette className="w-4 h-4 text-sky-400" />
          <span>1. Basic White & Navy Dark Themes</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('sql');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sql'
              ? 'bg-[#111] text-white border-[#111] shadow-md'
              : 'bg-white text-[#333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>2. SQL Database Terminal</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('schema');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-[#111] text-white border-[#111] shadow-md'
              : 'bg-white text-[#333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>3. SQL Schema & Seed DDL</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('configs');
          }}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'configs'
              ? 'bg-[#111] text-white border-[#111] shadow-md'
              : 'bg-white text-[#333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <FileCode className="w-4 h-4 text-purple-400" />
          <span>4. Master & Sub-CSS Architecture</span>
        </button>
      </div>

      {/* TAB 1: THEMES ENGINE */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="p-4 bg-sky-50 border border-sky-300 text-xs text-sky-950 font-mono flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-sky-900 mb-0.5">Instant Theme Engine Switcher:</strong>
              Selecting a theme instantly injects root CSS variables and applies utility classes across the application UI. The selection is saved in <code>localStorage</code>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THEMES.map((theme) => {
              const isSelected = activeThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  className={`p-5 border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#111] bg-white shadow-xl ring-2 ring-sky-500/20'
                      : 'border-[#dedede] bg-white hover:border-[#aaa]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase border"
                        style={{
                          backgroundColor: `${theme.badgeColor}20`,
                          color: theme.badgeColor,
                          borderColor: `${theme.badgeColor}40`,
                        }}
                      >
                        {theme.category}
                      </span>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-[#111] mb-1">{theme.name}</h3>
                    <p className="text-xs text-[#666] leading-relaxed mb-4">{theme.description}</p>

                    {/* Color Swatches Palette Preview */}
                    <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] mb-4 space-y-2 font-mono text-[10px]">
                      <span className="block text-[#777] font-bold uppercase">Color Tokens Preview</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 border border-[#ccc] shadow-sm"
                          style={{ backgroundColor: theme.previewColors.background }}
                          title="Background"
                        />
                        <div
                          className="w-6 h-6 border border-[#ccc] shadow-sm"
                          style={{ backgroundColor: theme.previewColors.surface }}
                          title="Surface"
                        />
                        <div
                          className="w-6 h-6 border border-[#ccc] shadow-sm"
                          style={{ backgroundColor: theme.previewColors.border }}
                          title="Border"
                        />
                        <div
                          className="w-6 h-6 border border-[#ccc] shadow-sm"
                          style={{ backgroundColor: theme.previewColors.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`w-full py-2 px-3 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border border-emerald-700'
                        : 'bg-[#111] text-white hover:bg-black'
                    }`}
                  >
                    {isSelected ? 'Currently Applied' : `Apply ${theme.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SQL DATABASE TERMINAL */}
      {activeTab === 'sql' && (
        <div className="space-y-5">
          {/* Quick Query Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#666] uppercase">Sample Queries:</span>
            {SAMPLE_SQL_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSqlQuery(preset.sql);
                  handleExecuteQuery(preset.sql);
                }}
                className="px-2.5 py-1 bg-[#fafafa] border border-[#ccc] text-[11px] font-mono text-[#333] hover:bg-[#111] hover:text-white transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Editor Input Box */}
          <div className="p-4 bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-sky-400">
                <Terminal className="w-4 h-4" /> SQL Console Query Editor
              </span>
              <span className="text-[10px] text-slate-400">Database: postgresql://admin@127.0.0.1:5432/universe_civilization_db</span>
            </div>

            <textarea
              rows={3}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 text-sky-300 font-mono text-xs focus:border-sky-500 outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Supports SELECT, INSERT, UPDATE, DDL, DML</span>

              <button
                onClick={() => handleExecuteQuery()}
                disabled={isExecuting}
                className="px-4 py-2 bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold uppercase font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Execute SQL</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          {queryResult && (
            <div className="p-4 border border-[#dedede] bg-white space-y-3">
              <div className="flex items-center justify-between font-mono text-xs border-b border-[#eee] pb-2">
                <span className="font-bold text-[#111] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Execution Output ({queryResult.rowCount} Rows Returned)</span>
                </span>
                <span className="text-[11px] text-[#666]">Time: {queryResult.executionTimeMs} ms</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-[#111] text-white text-[10px] uppercase">
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="p-2 border border-[#333]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                        {queryResult.columns.map((col, colIdx) => (
                          <td key={colIdx} className="p-2 border border-[#eee] text-[#333]">
                            {typeof row[col] === 'boolean'
                              ? row[col]
                                ? 'TRUE'
                                : 'FALSE'
                              : String(row[col] ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCHEMA DDL */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="p-4 border border-[#dedede] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#eee] pb-2">
              <span className="font-bold font-mono text-xs text-[#111] flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" />
                <span>PostgreSQL / SQLite Master DDL Schema (src/db/schema.sql)</span>
              </span>

              <button
                onClick={() =>
                  handleCopy(
                    `-- MASTER SQL SCHEMA\nCREATE TABLE users_profile (...);\nCREATE TABLE imperial_resources (...);\nCREATE TABLE naval_shipyard (...);\nCREATE TABLE stargate_relics_vault (...);`,
                    'schema'
                  )
                }
                className="px-2.5 py-1 bg-[#fafafa] border border-[#ccc] font-mono text-[10px] text-[#333] hover:bg-[#111] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'schema' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'schema' ? 'Copied' : 'Copy DDL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-sky-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS users_profile (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    commander_rank VARCHAR(50) DEFAULT 'Cadet Commander',
    rpg_level INT DEFAULT 1,
    active_theme VARCHAR(50) DEFAULT 'theme_white_default'
);

-- 2. IMPERIAL RESOURCES & BANKING TABLE
CREATE TABLE IF NOT EXISTS imperial_resources (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users_profile(id) ON DELETE CASCADE,
    turns INT DEFAULT 100,
    naquadah BIGINT DEFAULT 100000,
    crystal BIGINT DEFAULT 50000,
    banked_naquadah BIGINT DEFAULT 0
);

-- 3. STARGATE RELICS & ARTIFACTS VAULT TABLE
CREATE TABLE IF NOT EXISTS stargate_relics_vault (
    relic_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users_profile(id) ON DELETE CASCADE,
    relic_name VARCHAR(120) NOT NULL,
    origin_show_movie VARCHAR(100) NOT NULL,
    rarity VARCHAR(40) NOT NULL,
    is_socketed BOOLEAN DEFAULT FALSE
);`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: MASTER & SUB CSS ARCHITECTURE */}
      {activeTab === 'configs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 border border-[#dedede] bg-white space-y-2">
              <strong className="text-sky-700 block text-xs font-bold uppercase">1. Master CSS File</strong>
              <p className="text-[11px] text-[#666]">
                <code>src/styles/master.css</code>: Serves as the master stylesheet importing sub-CSS modules.
              </p>
              <pre className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] text-[#111]">
{`@import "./sub/themes.css";
@import "./sub/components.css";
@import "./sub/utilities.css";`}
              </pre>
            </div>

            <div className="p-4 border border-[#dedede] bg-white space-y-2">
              <strong className="text-amber-700 block text-xs font-bold uppercase">2. Themes Sub-CSS File</strong>
              <p className="text-[11px] text-[#666]">
                <code>src/styles/sub/themes.css</code>: Contains variables for White Default & Navy Dark themes.
              </p>
              <pre className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] text-[#111]">
{`:root, .theme-white-default { --bg-main: #ffffff; }
.theme-navy-dark { --bg-main: #030712; }`}
              </pre>
            </div>

            <div className="p-4 border border-[#dedede] bg-white space-y-2">
              <strong className="text-emerald-700 block text-xs font-bold uppercase">3. Components Sub-CSS File</strong>
              <p className="text-[11px] text-[#666]">
                <code>src/styles/sub/components.css</code>: Cards, tables, terminal boxes, and badges.
              </p>
              <pre className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] text-[#111]">
{`.master-panel-card { background-color: var(--bg-panel); }
.sql-terminal-box { background-color: #030712; }`}
              </pre>
            </div>

            <div className="p-4 border border-[#dedede] bg-white space-y-2">
              <strong className="text-purple-700 block text-xs font-bold uppercase">4. Utilities Sub-CSS File</strong>
              <p className="text-[11px] text-[#666]">
                <code>src/styles/sub/utilities.css</code>: Scrollbar overrides, glow utilities, glass effects.
              </p>
              <pre className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] text-[#111]">
{`.text-glow-navy { text-shadow: 0 0 12px rgba(56,189,248,0.5); }`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
