import React, { useState, useEffect } from 'react';
import { SEED_MEDICINES } from '../data/seedMedicines.ts';
import { SEED_DOCTORS } from '../data/seedDoctors.ts';
import { SEED_FORMULAS } from '../data/seedFormulas.ts';
import { SEED_HEALTH_TOPICS } from '../data/seedHealthTopics.ts';
import {
  ShieldCheck, Database, Server, RefreshCw, CheckCircle2,
  AlertTriangle, Trash2, Cpu, Activity, Globe, Pill, Stethoscope
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [serverHealth, setServerHealth] = useState<any | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerHealth(data);
      } else {
        setServerHealth({ status: 'error', code: res.status });
      }
    } catch (e: any) {
      setServerHealth({ status: 'offline', error: e.message });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleResetDemoData = () => {
    if (window.confirm('Reset all local storage cache to initial clean state?')) {
      localStorage.clear();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            <span>Admin Diagnostics & Seed Integrity</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            System status monitoring, live OCR endpoint verification, and clinical seed database statistics.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={healthLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
          <span>Refresh API Health</span>
        </button>
      </div>

      {/* Live Server & OCR Health Status */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-700" />
          <span>Backend Server & OCR Status (/api/health)</span>
        </h3>

        {serverHealth ? (
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Server State</span>
              <span className="font-bold text-amber-700 dark:text-amber-300 text-sm mt-0.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {serverHealth.status === 'ok' ? 'Online (HTTP 200)' : serverHealth.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Gemini OCR Engine</span>
              <span className={`font-bold text-sm mt-0.5 inline-flex items-center gap-1 ${
                serverHealth.hasGeminiKey ? 'text-amber-700 dark:text-amber-300' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {serverHealth.hasGeminiKey ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Configured & Active
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Unconfigured (GEMINI_API_KEY missing)
                  </>
                )}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block truncate">
                {serverHealth.appName || 'MediGuide by Usman'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 animate-pulse">
            Testing server connection...
          </div>
        )}
      </div>

      {/* Verified Seed Database Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Medicines</span>
            <Pill className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {SEED_MEDICINES.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Verified clinical monographs
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Demo Doctors</span>
            <Stethoscope className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {SEED_DOCTORS.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Across Pakistan, UK, USA, UAE, Canada
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Formulas</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {SEED_FORMULAS.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Active pharmaceutical molecules
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Health Guides</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {SEED_HEALTH_TOPICS.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Clinical disease profiles
          </span>
        </div>
      </div>

      {/* Cache & Data Reset Tool */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Storage & State Maintenance</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clear local session patient records, reminders, and cached search states to reset applet to fresh installation state.
        </p>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold">
            Storage reset complete. Reloading applet...
          </div>
        )}

        <button
          type="button"
          onClick={handleResetDemoData}
          className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          Reset Local Storage to Clean State
        </button>
      </div>
    </div>
  );
};
