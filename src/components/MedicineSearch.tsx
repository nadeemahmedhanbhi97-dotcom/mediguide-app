import React, { useState, useMemo } from 'react';
import { Medicine, OCRResult } from '../types.ts';
import { SEED_MEDICINES } from '../data/seedMedicines.ts';
import { CameraCaptureModal } from './CameraCaptureModal.tsx';
import { MedicineDetailModal } from './MedicineDetailModal.tsx';
import { SmartMedicineIdentifier } from './SmartMedicineIdentifier.tsx';
import { processMedicineImageOCR } from '../services/ocrService.ts';
import {
  Search, Camera, Mic, MicOff, AlertTriangle, ShieldCheck, Pill,
  Sparkles, CheckCircle2, ChevronRight, X, AlertCircle, RefreshCw, FileText,
  Stethoscope, PackageCheck, Layers
} from 'lucide-react';

interface MedicineSearchProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigateToFormula?: (formulaQuery: string) => void;
  onNavigateToTab?: (tab: string) => void;
  initialQuery?: string;
  triggerCameraModal?: number;
}

export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  favorites,
  onToggleFavorite,
  onNavigateToFormula,
  onNavigateToTab,
  initialQuery,
  triggerCameraModal
}) => {
  // Sub-tabs: 'smart_identifier' (Default) | 'directory'
  const [activeMedicineView, setActiveMedicineView] = useState<'smart_identifier' | 'directory'>('smart_identifier');

  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Sync initial query from hero if passed
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Sync trigger camera modal from parent feature card / hero
  React.useEffect(() => {
    if (triggerCameraModal && triggerCameraModal > 0) {
      setIsCameraModalOpen(true);
    }
  }, [triggerCameraModal]);

  // Camera & OCR States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [capturedImageThumb, setCapturedImageThumb] = useState<string | null>(null);

  // Speech Recognition / Voice Search State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    SEED_MEDICINES.forEach((m) => set.add(m.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    let list = SEED_MEDICINES;

    if (selectedCategory !== 'All') {
      list = list.filter((m) => m.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((m) => {
        const inName = m.name.toLowerCase().includes(q);
        const inGeneric = m.genericName.toLowerCase().includes(q);
        const inBrands = m.brandNames.some((b) => b.toLowerCase().includes(q));
        const inIngredients = m.ingredients.some((i) => i.toLowerCase().includes(q));
        const inUses = m.uses.some((u) => u.toLowerCase().includes(q));
        const inCategory = m.category.toLowerCase().includes(q);
        return inName || inGeneric || inBrands || inIngredients || inUses || inCategory;
      });
    }

    return list;
  }, [searchQuery, selectedCategory]);

  // Voice Search Handler
  const toggleVoiceSearch = () => {
    setSpeechError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice search is not supported on this browser. Please type in the search bar.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setSpeechError(`Voice input error: ${event.error}. Please type manually.`);
        setIsListening(false);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setSpeechError('Could not start microphone. Please check browser permissions.');
      setIsListening(false);
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  // OCR Processing Handler
  const handleImageCaptured = async (imageDataUrl: string) => {
    setCapturedImageThumb(imageDataUrl);
    setIsProcessingOCR(true);
    setOcrError(null);
    setOcrResult(null);

    const res = await processMedicineImageOCR(imageDataUrl);
    setIsProcessingOCR(false);

    if (!res.success) {
      setOcrError(res.error || 'Failed to analyze medicine packaging image.');
      return;
    }

    if (res.result) {
      setOcrResult(res.result);
      // If matches were found and confidence is sufficient, update search query to first match
      if (!res.result.isUncertain && res.result.matchedMedicines && res.result.matchedMedicines.length > 0) {
        setSearchQuery(res.result.matchedMedicines[0].genericName);
      }
    }
  };

  const clearOcrScan = () => {
    setOcrResult(null);
    setOcrError(null);
    setCapturedImageThumb(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Educational Disclaimer Banner */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs flex items-start gap-3">
        <div className="p-2 rounded-[4px] bg-[#B08D57]/10 text-[#8E6D38] shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#101827] leading-relaxed">
          <strong className="font-semibold block sm:inline mb-0.5 sm:mb-0 text-[#0E3B36]">
            Clinical Safety & Reference Disclaimer:
          </strong>{' '}
          MediGuide by Usman provides educational pharmacological reference information. It is{' '}
          <strong className="underline">not a substitute</strong> for professional medical diagnosis, clinical advice, or a physician&apos;s prescription. Always verify medications directly with a licensed physician or registered pharmacist.
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#E8F3EE] rounded-xl border border-[#C4DFD3] w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setActiveMedicineView('smart_identifier')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMedicineView === 'smart_identifier'
              ? 'bg-[#0E3B36] text-white shadow-xs'
              : 'text-[#0E3B36] hover:bg-white/70'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Smart Medicine Identifier & Auto-Deduct</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-400 text-stone-950">
            AI / OCR
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMedicineView('directory')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMedicineView === 'directory'
              ? 'bg-[#0E3B36] text-white shadow-xs'
              : 'text-[#0E3B36] hover:bg-white/70'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>All Verified Medicines Directory</span>
        </button>
      </div>

      {/* TAB 1: SMART MEDICINE IDENTIFIER & AUTO-DEDUCT */}
      {activeMedicineView === 'smart_identifier' && (
        <SmartMedicineIdentifier
          onOpenStoreDashboard={() => onNavigateToTab && onNavigateToTab('medical_store')}
          initialMedicineName={searchQuery}
        />
      )}

      {/* TAB 2: ALL VERIFIED MEDICINES DIRECTORY */}
      {activeMedicineView === 'directory' && (
        <div className="space-y-6">
          {/* Hero & Search Controls */}
          <div className="p-5 sm:p-6 rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E3B36] flex items-center gap-2">
                  <Pill className="w-6 h-6 text-[#0E3B36]" />
                  <span>Verified Medicines Directory</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#5B6577] mt-1">
                  Search by brand, generic active ingredient, or chemical category.
                </p>
              </div>

              {/* Action: Switch to Smart Identifier */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMedicineView('smart_identifier')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#B08D57] hover:bg-[#8E6D38] text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Smart Photo / Text Scan</span>
                </button>
              </div>
            </div>

        {/* Search Input Bar with Voice & Clear */}
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-stone-400">
            <Search className="w-5 h-5 text-[#0E3B36]/60" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand, generic name, ingredient (e.g. Panadol, Augmentin, Metformin)..."
            className="w-full pl-11 pr-24 py-3 bg-[#FBF8F2] border border-[#E8E2D8] rounded-[4px] text-xs sm:text-sm text-[#101827] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] transition"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-2 text-stone-400 hover:text-stone-600 rounded hover:bg-stone-100 transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-2 rounded-[4px] transition ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-stone-400 hover:text-[#0E3B36] hover:bg-stone-100'
              }`}
              title={isListening ? 'Stop listening' : 'Search by voice'}
              aria-label="Voice search"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Speech Error Feedback */}
        {speechError && (
          <div className="p-2.5 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0E3B36] text-white'
                  : 'bg-[#FBF8F2] text-stone-700 border border-[#E8E2D8] hover:border-[#B08D57]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* OCR In-Progress Banner */}
      {isProcessingOCR && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Analyzing Medicine Package...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extracting label text, brand names, active ingredients, and matching against clinical database.
            </p>
          </div>
        </div>
      )}

      {/* OCR Result / Uncertainty / Error Card */}
      {(ocrResult || ocrError) && !isProcessingOCR && (
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
            ocrError
              ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
              : ocrResult?.isUncertain
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
              : 'bg-amber-50/60 dark:bg-stone-900 border-amber-200 dark:border-amber-800/50'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {capturedImageThumb && (
                <img
                  src={capturedImageThumb}
                  alt="Scanned Package"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                />
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {ocrError
                      ? 'OCR Scan Result'
                      : ocrResult?.isUncertain
                      ? '⚠️ Identification Uncertain'
                      : '✅ Medicine Identified'}
                  </h3>
                  {ocrResult && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ocrResult.isUncertain
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                          : 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                      }`}
                    >
                      Confidence: {ocrResult.confidence}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {ocrError ||
                    (ocrResult?.isUncertain
                      ? 'Text was blurry or could not be verified with high certainty. For patient safety, never guess.'
                      : 'Extracted text successfully matched against clinical medicine records.')}
                </p>
              </div>
            </div>

            <button
              onClick={clearOcrScan}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
              title="Dismiss scan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CRITICAL SAFETY BEHAVIOR: UNCERTAIN OCR ALERT */}
          {ocrResult?.isUncertain && (
            <div className="p-3.5 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Verification Warning & Guidance:</span>
              </div>
              <p>
                {ocrResult.uncertaintyReason ||
                  'Could not reliably identify medicine. Please verify with a doctor or pharmacist.'}
              </p>
            </div>
          )}

          {/* Extracted Details */}
          {ocrResult && (
            <div className="text-xs space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              {ocrResult.rawText && (
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Extracted Text:</span>{' '}
                  <span className="font-mono text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 inline-block max-w-full truncate">
                    {ocrResult.rawText}
                  </span>
                </div>
              )}

              {ocrResult.possibleMedicineNames && ocrResult.possibleMedicineNames.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Detected Names:</span>
                  {ocrResult.possibleMedicineNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}

              {/* Matched Medicines list from OCR */}
              {ocrResult.matchedMedicines && ocrResult.matchedMedicines.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Matching Database Records ({ocrResult.matchedMedicines.length}):
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {ocrResult.matchedMedicines.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => setSelectedMedicine(med)}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer flex items-center justify-between transition group shadow-xs"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-700 transition">
                            {med.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {med.strength} • {med.form}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Showing {filteredMedicines.length} verified medicines
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-amber-700 dark:text-amber-300 hover:underline font-medium"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Medicines Grid */}
      {filteredMedicines.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              onClick={() => setSelectedMedicine(medicine)}
              className="p-4 sm:p-5 rounded-[4px] bg-white border border-[#E8E2D8] hover:border-[#B08D57] shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#B08D57]/10 text-[#8E6D38] border border-[#B08D57]/30">
                    {medicine.category}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {medicine.strength}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#0E3B36] group-hover:text-[#B08D57] transition leading-snug">
                  {medicine.name}
                </h3>
                <p className="text-xs text-[#5B6577] mt-0.5 line-clamp-1">
                  Generic: {medicine.genericName}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {medicine.brandNames.slice(0, 3).map((brand, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-[3px] bg-[#FBF8F2] text-stone-600 border border-[#E8E2D8]"
                    >
                      {brand}
                    </span>
                  ))}
                  {medicine.brandNames.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[#FBF8F2] text-stone-400 border border-[#E8E2D8]">
                      +{medicine.brandNames.length - 3}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                  {medicine.uses[0]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery(medicine.name);
                    setActiveMedicineView('smart_identifier');
                  }}
                  className="px-2 py-1 rounded bg-[#E8F3EE] hover:bg-[#C4DFD3] text-[#0E3B36] font-bold text-[11px] flex items-center gap-1 transition"
                  title="Open Smart Identifier & Auto-Deduct Stock"
                >
                  <Sparkles className="w-3 h-3 text-[#0E3B36]" />
                  <span>Check Stock / Deduct</span>
                </button>

                <span className="font-semibold text-[#0E3B36] group-hover:text-[#B08D57] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs">
          <Pill className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-[#0E3B36]">
            No Medicines Match &quot;{searchQuery}&quot;
          </h3>
          <p className="text-xs text-[#5B6577] mt-1 max-w-md mx-auto">
            Try searching by chemical generic name, active ingredient, or clear the category filter to see all verified medicines.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-[4px] bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-semibold transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleImageCaptured}
        title="Scan Medicine (Camera / OCR)"
        description="Capture clear photo of packaging, brand title, or blister strip."
        guideText="Center medicine box inside box"
      />

      {/* Medicine Monograph Detail Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        isOpen={Boolean(selectedMedicine)}
        onClose={() => setSelectedMedicine(null)}
        isFavorite={selectedMedicine ? favorites.includes(selectedMedicine.id) : false}
        onToggleFavorite={onToggleFavorite}
        onSelectRelatedFormula={onNavigateToFormula}
      />
    </div>
  );
};
