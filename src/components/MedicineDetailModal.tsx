import React, { useState, useEffect } from 'react';
import { Medicine } from '../types.ts';
import {
  X, AlertTriangle, ShieldAlert, Pill, Sparkles, BookOpen, Clock, Heart,
  Building, CheckCircle2, Info, ArrowRight, Share2, Printer, PackageCheck, Minus, Plus
} from 'lucide-react';
import {
  getInventoryByMedicine,
  deductMedicineStock,
  MedicineInventoryItem
} from '../services/medicineInventoryService.ts';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (medicineId: string) => void;
  onSelectRelatedFormula?: (ingredientName: string) => void;
  onOpenStoreDashboard?: () => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onSelectRelatedFormula,
  onOpenStoreDashboard
}) => {
  const [stockItem, setStockItem] = useState<MedicineInventoryItem | null>(null);
  const [deductQty, setDeductQty] = useState<number>(1);
  const [deductMsg, setDeductMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (medicine) {
      const inv = getInventoryByMedicine(medicine.name);
      setStockItem(inv || null);
    }
  }, [medicine]);

  if (!isOpen || !medicine) return null;

  const handleDeduct = () => {
    if (!medicine) return;
    const res = deductMedicineStock(medicine.name, deductQty, `Detail Modal Dispense (${medicine.name})`);
    if (res.success && res.updatedItem) {
      setStockItem(res.updatedItem);
      setDeductMsg({ text: `Auto-deducted ${deductQty} unit(s)! Remaining stock: ${res.updatedItem.stockQuantity} units.` });
      setTimeout(() => setDeductMsg(null), 4000);
    } else {
      setDeductMsg({ text: res.error || 'Failed to deduct stock.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-stone-900 text-amber-800 dark:text-amber-300">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {medicine.name}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300">
                  {medicine.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generic: <span className="font-medium text-slate-700 dark:text-slate-300">{medicine.genericName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(medicine.id)}
                className={`p-2 rounded-xl transition ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                aria-label="Toggle Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Clinical Educational Disclaimer Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
              <strong className="font-semibold">Educational Reference Only:</strong> MediGuide does not replace a doctor’s consultation, clinical judgment, or prescription. Never alter your dosage or initiate medication without consulting a certified physician or pharmacist.
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Strength</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{medicine.strength}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Dosage Form</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{medicine.form}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Manufacturer</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate" title={medicine.manufacturer}>{medicine.manufacturer}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Status</span>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 mt-0.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Active Ingredients & Brand Names */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Active Chemical Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {medicine.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-stone-900 text-amber-900 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800/40"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Common Equivalent Brand Names
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {medicine.brandNames.map((brand, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Store Inventory & Auto-Deduct Panel */}
          {stockItem && (
            <div className="p-4 rounded-xl bg-[#E8F3EE]/70 border border-[#C4DFD3] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0E3B36] tracking-wider block">
                    Medical Store Live Inventory Status
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-sm text-[#0E3B36]">
                      {stockItem.stockQuantity > 0 ? `🟢 ${stockItem.stockQuantity} Units in Stock` : '🔴 Out of Stock'}
                    </span>
                    <span className="text-xs text-stone-500">• {stockItem.locationRack}</span>
                    <span className="text-xs font-mono font-bold text-[#0E3B36]">Rs {stockItem.unitPrice}</span>
                  </div>
                </div>

                {/* Auto-Deduct Quick Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setDeductQty((prev) => Math.max(1, prev - 1))}
                      aria-label="Decrease deduct quantity"
                      className="p-1 hover:bg-stone-100 rounded text-stone-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-stone-800">{deductQty}</span>
                    <button
                      type="button"
                      onClick={() => setDeductQty((prev) => prev + 1)}
                      aria-label="Increase deduct quantity"
                      className="p-1 hover:bg-stone-100 rounded text-stone-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeduct}
                    disabled={stockItem.stockQuantity < deductQty}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Auto-Deduct {deductQty} {deductQty === 1 ? 'Unit' : 'Units'}</span>
                  </button>
                </div>
              </div>

              {deductMsg && (
                <div className={`p-2 rounded-lg text-xs font-medium ${
                  deductMsg.isError ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-900 font-bold'
                }`}>
                  {deductMsg.text}
                </div>
              )}
            </div>
          )}

          {/* Primary Uses & Indications */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              Uses & Clinical Indications
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {medicine.uses.map((use, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dosage & Administration */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Standard Dosage & Administration Guideline
            </h4>
            <p className="text-xs text-blue-900/90 dark:text-blue-200/90 leading-relaxed font-medium">
              {medicine.dosage}
            </p>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80 italic mt-1">
              * Exact dosage must be determined by a healthcare provider based on renal function, weight, and clinical condition.
            </p>
          </div>

          {/* Serious Warnings & Precautions */}
          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Critical Warnings & Black Box Precautions
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
              {medicine.seriousWarnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Drug Interactions & Contraindications */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Key Drug Interactions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {medicine.interactions.map((interaction, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">›</span>
                    <span>{interaction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Contraindications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {medicine.contraindications.map((contra, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Side Effects */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Common Side Effects
            </h4>
            <div className="flex flex-wrap gap-2">
              {medicine.sideEffects.map((sideEffect, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700/60"
                >
                  {sideEffect}
                </span>
              ))}
            </div>
          </div>

          {/* Pregnancy & Storage */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {medicine.pregnancySafety && (
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <span className="text-[11px] font-semibold text-purple-900 dark:text-purple-300 block mb-0.5">Pregnancy & Lactation</span>
                <span className="text-purple-950 dark:text-purple-200">{medicine.pregnancySafety}</span>
              </div>
            )}
            {medicine.storage && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Storage Conditions</span>
                <span className="text-slate-700 dark:text-slate-300">{medicine.storage}</span>
              </div>
            )}
          </div>

          {/* Monograph Reference & Last Reviewed */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Source: <span className="font-medium text-slate-600 dark:text-slate-400">British National Formulary / USP Monographs</span>
            </div>
            <div>
              Last Clinical Review: <span className="font-medium text-slate-600 dark:text-slate-400">{medicine.lastReviewed}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          {onSelectRelatedFormula && (
            <button
              onClick={() => {
                onSelectRelatedFormula(medicine.ingredients[0] || medicine.genericName);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 hover:underline"
            >
              <span>Explore Chemical Formula & Pharmacology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold shadow transition"
          >
            Close Monograph
          </button>
        </div>
      </div>
    </div>
  );
};
