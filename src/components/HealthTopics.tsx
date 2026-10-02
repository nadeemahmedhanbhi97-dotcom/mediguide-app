import React, { useState } from 'react';
import { HealthTopic } from '../types.ts';
import { SEED_HEALTH_TOPICS } from '../data/seedHealthTopics.ts';
import {
  HeartPulse, AlertCircle, ShieldAlert, CheckCircle2, ChevronRight,
  BookOpen, Search, X, Activity, AlertTriangle
} from 'lucide-react';

export const HealthTopics: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<HealthTopic | null>(SEED_HEALTH_TOPICS[0]);

  const filteredTopics = SEED_HEALTH_TOPICS.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.urduTitle && t.urduTitle.includes(q)) ||
      t.category.toLowerCase().includes(q) ||
      t.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-amber-700 dark:text-amber-300" />
          <span>Clinical Health Topics & Disease Prevention</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Medical guides on chronic conditions, common infections, early warning symptoms, lifestyle prevention, and emergency red flags.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health topic or symptom (e.g. Hypertension, Blood Pressure, Diabetes, Asthma)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Topics List */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Health Guides ({filteredTopics.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  selectedTopic?.id === topic.id
                    ? 'bg-amber-50 dark:bg-stone-900 border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {topic.title}
                  </h4>
                  {topic.urduTitle && (
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 block mt-0.5">
                      {topic.urduTitle}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {topic.category}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Monograph */}
        {selectedTopic && (
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-900 text-amber-900 dark:text-amber-300">
                {selectedTopic.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2">
                {selectedTopic.title}
              </h2>
              {selectedTopic.urduTitle && (
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                  {selectedTopic.urduTitle}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTopic.overview}
            </p>

            {/* Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-700" />
                <span>Common Clinical Symptoms</span>
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                {selectedTopic.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Preventive Measures & Lifestyle Management</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {selectedTopic.prevention.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to see a doctor */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>When to Consult a Physician:</span>
              </h4>
              <ul className="space-y-1">
                {selectedTopic.whenToSeeDoctor.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Red Flags */}
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1.5 text-rose-950 dark:text-rose-200">
              <h4 className="font-bold flex items-center gap-1.5 text-rose-900 dark:text-rose-100">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Emergency Red Flag Warning Signs (Seek Urgent Care Immediately):</span>
              </h4>
              <ul className="space-y-1">
                {selectedTopic.emergencySigns.map((e, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-medium">
                    <span className="text-rose-600 font-bold">!</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
