import React, { useState, useEffect } from 'react';
import {
  Database,
  Terminal,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Server,
  Layers,
  FileCode,
  HardDrive,
  ShieldCheck,
  Zap,
  Table as TableIcon,
  Download,
  Upload,
  Cpu,
} from 'lucide-react';
import { dbManager, SqlQueryResult } from '../../../db/database_manager';
import { DATABASE_CONFIG } from '../../../config/databaseConfig';
import { checkAdminPermission, getAdminAuthSession } from '../../../config/adminAuthConfig';
import { AdminAuthSession } from '../../../types';
import { sound } from '../../../sound';

interface AdminSqlDatabaseTabProps {
  currentSession?: AdminAuthSession;
}

export const AdminSqlDatabaseTab: React.FC<AdminSqlDatabaseTabProps> = ({ currentSession }) => {
  const activeSession = currentSession || getAdminAuthSession();
  const hasSqlPermission = checkAdminPermission(activeSession, 'EXECUTE_SQL');

  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM stargate_relics_vault;');
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeSubView, setActiveSubView] = useState<'terminal' | 'tables' | 'schema' | 'config'>('terminal');
  const [selectedTable, setSelectedTable] = useState<string>('stargate_relics_vault');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    handleRunQuery('SELECT * FROM stargate_relics_vault;');
  }, []);

  const handleRunQuery = async (queryToRun?: string) => {
    const targetSql = queryToRun || sqlQuery;
    if (!targetSql.trim()) return;

    setIsExecuting(true);
    sound.play('click');
    try {
      const res = await dbManager.executeSql(targetSql);
      setQueryResult(res);
      setStatusNotification(`Query executed in ${res.executionTimeMs} ms (${res.rowCount} rows returned)`);
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (err: any) {
      console.error(err);
      sound.play('warning');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    sound.play('confirm');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectTable = (table: string) => {
    sound.play('click');
    setSelectedTable(table);
    const query = `SELECT * FROM ${table} LIMIT 50;`;
    setSqlQuery(query);
    handleRunQuery(query);
  };

  const SAMPLE_QUERIES = [
    { label: 'Relics Vault', sql: 'SELECT * FROM stargate_relics_vault;' },
    { label: 'Imperial Resources', sql: 'SELECT * FROM imperial_resources;' },
    { label: 'Naval Shipyard Roster', sql: 'SELECT * FROM naval_shipyard ORDER BY tier_level DESC;' },
    { label: 'User Profiles', sql: 'SELECT * FROM users_profile;' },
    { label: 'Colonies & Mines', sql: 'SELECT * FROM colonies_mines;' },
    { label: 'System Configurations', sql: 'SELECT * FROM system_configs;' },
  ];

  return (
    <div className="space-y-6" id="admin-sql-database-tab">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
              DATABASE CONTROL CENTER
            </span>
            <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-bold uppercase tracking-widest">
              PostgreSQL 16.2 Engine
            </span>
          </div>

          <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>Admin SQL Database Terminal & DDL Inspector</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct database administration, custom SQL query execution, schema DDL inspection, and database connection metrics.
          </p>
        </div>

        {/* Database Quick Health Card */}
        <div className="p-3 bg-slate-950 border border-slate-800 text-xs flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Database Dialect</span>
            <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
              <Server size={12} /> {DATABASE_CONFIG.dialect.toUpperCase()}
            </span>
          </div>

          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Tables Count</span>
            <span className="text-sky-300 font-bold font-mono">{DATABASE_CONFIG.tables.length} Active Tables</span>
          </div>
        </div>
      </div>

      {/* Permission Warning if not authorized */}
      {!hasSqlPermission && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="block font-bold uppercase text-amber-200">Restricted Permission Warning</strong>
            Your current active admin session does not have the <code>EXECUTE_SQL</code> permission. Query execution is limited to read-only simulated preview.
          </div>
        </div>
      )}

      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#dedede] pb-2 font-mono text-xs">
        <button
          onClick={() => {
            sound.play('click');
            setActiveSubView('terminal');
          }}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeSubView === 'terminal'
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white text-[#333333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <Terminal size={14} className="text-emerald-400" />
          <span>1. Live SQL Query Terminal</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveSubView('tables');
          }}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeSubView === 'tables'
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white text-[#333333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <TableIcon size={14} className="text-sky-400" />
          <span>2. Live Tables Browser ({DATABASE_CONFIG.tables.length})</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveSubView('schema');
          }}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeSubView === 'schema'
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white text-[#333333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <FileCode size={14} className="text-amber-400" />
          <span>3. Schema DDL & Seed Script</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveSubView('config');
          }}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeSubView === 'config'
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-white text-[#333333] border-[#ccc] hover:bg-[#fafafa]'
          }`}
        >
          <HardDrive size={14} className="text-purple-400" />
          <span>4. Connection Pool & Config</span>
        </button>
      </div>

      {/* SUBVIEW 1: LIVE SQL TERMINAL */}
      {activeSubView === 'terminal' && (
        <div className="space-y-5">
          {/* Preset Sample Queries */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="font-bold text-[#666666] uppercase text-[11px]">Quick Query Presets:</span>
            {SAMPLE_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSqlQuery(preset.sql);
                  handleRunQuery(preset.sql);
                }}
                className="px-2.5 py-1 bg-[#fafafa] border border-[#ccc] text-[#333333] hover:bg-[#111111] hover:text-white transition-all text-[11px] cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Editor Terminal Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Terminal className="w-4 h-4" /> Admin SQL Console Terminal
              </span>
              <span className="text-[10px] text-slate-400">
                URI: <code>{DATABASE_CONFIG.connectionString}</code>
              </span>
            </div>

            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-3 text-sky-300 font-mono text-xs focus:border-emerald-500 outline-none leading-relaxed"
              placeholder="Enter SQL query (SELECT, INSERT, UPDATE, DDL)..."
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Supports standard PostgreSQL / SQLite DQL and DML syntax
              </span>

              <button
                onClick={() => handleRunQuery()}
                disabled={isExecuting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Execute SQL Statement</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          {queryResult && (
            <div className="p-4 border border-[#dedede] bg-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#eee] pb-2">
                <span className="font-bold text-[#111111] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Execution Output ({queryResult.rowCount} Rows Returned)</span>
                </span>
                <span className="text-[11px] text-[#666666]">
                  Execution Time: <strong>{queryResult.executionTimeMs} ms</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-[#111111] text-white text-[10px] uppercase">
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="p-2 border border-[#333333]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                        {queryResult.columns.map((col, colIdx) => (
                          <td key={colIdx} className="p-2 border border-[#eee] text-[#333333]">
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

      {/* SUBVIEW 2: LIVE TABLES BROWSER */}
      {activeSubView === 'tables' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DATABASE_CONFIG.tables.map((table) => {
              const isSelected = selectedTable === table;
              return (
                <div
                  key={table}
                  onClick={() => handleSelectTable(table)}
                  className={`p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#111111] bg-white shadow-lg ring-1 ring-emerald-500/30'
                      : 'border-[#dedede] bg-white hover:border-[#aaa]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[10px] uppercase">
                        Table
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-[#111111] text-sm">{table}</h3>
                    <p className="text-[11px] text-[#666666]">
                      Primary Key: <code>id</code> / <code>user_id</code>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTable(table);
                    }}
                    className="mt-3 w-full py-1.5 bg-[#111111] text-white hover:bg-black font-bold uppercase text-[10px] cursor-pointer"
                  >
                    Query Table Content
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: SCHEMA DDL */}
      {activeSubView === 'schema' && (
        <div className="p-4 border border-[#dedede] bg-white space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#eee] pb-2">
            <span className="font-bold text-[#111111] flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>Master SQL DDL Schema (src/db/schema.sql)</span>
            </span>

            <button
              onClick={() =>
                handleCopy(
                  `CREATE TABLE users_profile (...);\nCREATE TABLE imperial_resources (...);\nCREATE TABLE naval_shipyard (...);`,
                  'ddl-copy'
                )
              }
              className="px-2.5 py-1 bg-[#fafafa] border border-[#ccc] text-[#333333] hover:bg-[#111111] hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-bold uppercase"
            >
              {copiedKey === 'ddl-copy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'ddl-copy' ? 'Copied' : 'Copy DDL'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-sky-300 text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`-- UNIVERSE CIVILIZATION MASTER SQL DDL SCHEMA
CREATE TABLE IF NOT EXISTS users_profile (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    commander_rank VARCHAR(50) DEFAULT 'Cadet Commander',
    rpg_level INT DEFAULT 1,
    active_theme VARCHAR(50) DEFAULT 'theme_white_default'
);

CREATE TABLE IF NOT EXISTS imperial_resources (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users_profile(id) ON DELETE CASCADE,
    turns INT DEFAULT 100,
    naquadah BIGINT DEFAULT 100000,
    crystal BIGINT DEFAULT 50000,
    banked_naquadah BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS naval_shipyard (
    ship_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users_profile(id) ON DELETE CASCADE,
    ship_name VARCHAR(120) NOT NULL,
    ship_class VARCHAR(80) NOT NULL,
    tier_level INT NOT NULL,
    attack_power BIGINT NOT NULL,
    quantity_owned INT DEFAULT 0
);`}
          </pre>
        </div>
      )}

      {/* SUBVIEW 4: CONFIGURATION */}
      {activeSubView === 'config' && (
        <div className="p-4 border border-[#dedede] bg-white space-y-4 font-mono text-xs">
          <span className="font-extrabold text-[#111111] uppercase block border-b border-[#eee] pb-2">
            Database Connection & Pool Configuration (src/config/databaseConfig.ts)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-[#fafafa] border border-[#ccc] space-y-1.5">
              <span className="text-[#666666] text-[10px] font-bold uppercase block">Database Name</span>
              <span className="font-bold text-[#111111] text-sm">{DATABASE_CONFIG.databaseName}</span>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#ccc] space-y-1.5">
              <span className="text-[#666666] text-[10px] font-bold uppercase block">Connection Pool Size</span>
              <span className="font-bold text-[#111111] text-sm">{DATABASE_CONFIG.maxPoolConnections} Connections</span>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#ccc] space-y-1.5">
              <span className="text-[#666666] text-[10px] font-bold uppercase block">Idle Timeout</span>
              <span className="font-bold text-[#111111] text-sm">{DATABASE_CONFIG.idleTimeoutMs} ms</span>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#ccc] space-y-1.5">
              <span className="text-[#666666] text-[10px] font-bold uppercase block">Migrations Path</span>
              <span className="font-bold text-[#111111] text-sm">{DATABASE_CONFIG.migrationsPath}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
