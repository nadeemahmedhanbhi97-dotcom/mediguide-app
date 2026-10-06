import React, { useState } from 'react';
import { FormulaItem } from '../types.ts';
import { SEED_FORMULAS } from '../data/seedFormulas.ts';
import {
  FlaskConical, Sparkles, BookOpen, AlertTriangle, ShieldCheck,
  Search, ArrowRight, RefreshCw, CheckCircle2
} from 'lucide-react';

interface FormulaLibraryProps {
  initialQuery?: string;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({ initialQuery = '' }) => {
  const [selectedFormula, setSelectedFormula] = useState<FormulaItem | null>(SEED_FORMULAS[0]);
  const [customQuery, setCustomQuery] = useState(initialQuery);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  const handleExplainFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsExplaining(true);
    setExplainError(null);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/explain-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formula: customQuery.trim(), name: customQuery.trim() })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiExplanation(resData.data);
      } else {
        throw new Error(resData.error || 'Failed to explain formula.');
      }
    } catch (err: any) {
      console.warn('Explain formula error:', err);
      // Fallback matching against local seed formulas
      const q = customQuery.toLowerCase();
      const localMatch = SEED_FORMULAS.find(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.chemicalFormula.toLowerCase().includes(q) ||
          f.commonUses.some((u) => u.toLowerCase().includes(q))
      );

      if (localMatch) {
        setAiExplanation({
          name: localMatch.name,
          chemicalFormula: localMatch.chemicalFormula,
          category: localMatch.category,
          molecularWeight: localMatch.molecularWeight,
          overview: localMatch.description,
          mechanismOfAction: localMatch.mechanismOfAction,
          indications: localMatch.commonUses,
          safetyWarnings: localMatch.safetyWarnings,
          disclaimer: 'Educational pharmacological reference from MediGuide clinical monograph database.'
        });
      } else {
        setExplainError(
          'Could not retrieve pharmacological explanation for this compound. Try one from the formula library below.'
        );
      }
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 sm:p-6 rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E3B36] flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-[#0E3B36]" />
          <span>Active Formula Library & Chemical Pharmacology</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6577] mt-1">
          Explore empirical chemical formulas, molecular mechanisms of action, pharmacokinetics, and clinical drug classes.
        </p>

        {/* Explain My Formula Search Input */}
        <form onSubmit={handleExplainFormula} className="mt-5 space-y-2">
          <label htmlFor="formula-search" className="text-xs font-bold text-stone-700 block">
            Explain My Formula / Chemical Compound:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FlaskConical className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="formula-search"
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Enter formula or drug name (e.g. C8H9NO2, Paracetamol, Amoxicillin, Metformin)..."
                aria-label="Search chemical formula or drug name"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D8] rounded-[4px] text-xs sm:text-sm text-[#101827] focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57]"
              />
            </div>
            <button
              type="submit"
              disabled={isExplaining}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[4px] bg-[#0E3B36] hover:bg-[#092824] text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Formula...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#B08D57]" />
                  <span>Explain Formula</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {explainError && (
          <div className="mt-3 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {explainError}
          </div>
        )}
      </div>

      {/* AI Explanation Result Card */}
      {aiExplanation && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/60 shadow-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {aiExplanation.name}
                </h3>
                {aiExplanation.chemicalFormula && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-stone-900 text-amber-900 dark:text-amber-300">
                    {aiExplanation.chemicalFormula}
                  </span>
                )}
                {aiExplanation.molecularWeight && (
                  <span className="text-xs text-slate-400 font-mono">
                    {aiExplanation.molecularWeight}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                Class: {aiExplanation.category}
              </p>
            </div>

            <button
              onClick={() => setAiExplanation(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {aiExplanation.overview}
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Pharmacological Mechanism of Action:
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {aiExplanation.mechanismOfAction}
            </p>
          </div>

          {aiExplanation.safetyWarnings && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Clinical Pharmacology Safety Warnings:</span>
              </h4>
              <ul className="space-y-1">
                {Array.isArray(aiExplanation.safetyWarnings) ? (
                  aiExplanation.safetyWarnings.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <li>{aiExplanation.safetyWarnings}</li>
                )}
              </ul>
            </div>
          )}

          <div className="text-[11px] text-slate-400 italic">
            {aiExplanation.disclaimer || 'Educational pharmacological reference only.'}
          </div>
        </div>
      )}

      {/* FORMULA LIBRARY LIST */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Pharmaceutical Compounds ({SEED_FORMULAS.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
            {SEED_FORMULAS.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedFormula(f);
                  setAiExplanation(null);
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  selectedFormula?.id === f.id
                    ? 'bg-amber-50 dark:bg-stone-900 border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {f.name}
                  </h4>
                  <span className="font-mono text-[11px] text-amber-700 dark:text-amber-300 font-semibold block mt-0.5">
                    {f.chemicalFormula}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {f.category.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedFormula && (
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedFormula.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-900 text-amber-900 dark:text-amber-300">
                    {selectedFormula.chemicalFormula}
                  </span>
                  {selectedFormula.molecularWeight && (
                    <span className="text-xs text-slate-400 font-mono">
                      MW: {selectedFormula.molecularWeight}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCustomQuery(selectedFormula.name);
                }}
                className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>Load in Explain Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-1">
                Description
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedFormula.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1.5">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Mechanism of Action (MOA)</span>
              </h4>
              <p className="text-blue-950 dark:text-blue-200 leading-relaxed">
                {selectedFormula.mechanismOfAction}
              </p>
            </div>

            <div className="text-xs space-y-1.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                Primary Clinical Uses & Indications
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                {selectedFormula.commonUses.map((use, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1.5">
              <h4 className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Toxicology & Pharmacology Precautions</span>
              </h4>
              <ul className="space-y-1 text-rose-950 dark:text-rose-200">
                {selectedFormula.safetyWarnings.map((warn, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{warn}</span>
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
