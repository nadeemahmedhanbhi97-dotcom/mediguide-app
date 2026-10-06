import React, { useState } from 'react';
import {
  Search,
  Camera,
  X,
  Pill,
  ShieldCheck,
  AlertCircle,
  FileText,
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosage: string;
  uses: string[];
  sideEffects: string[];
  warnings: string;
  verifiedStatus: boolean;
}

const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Panadol Extra',
    genericName: 'Paracetamol / Caffeine',
    manufacturer: 'GSK Consumer Healthcare',
    category: 'Analgesic / Pain Relief',
    dosage: '500mg / 65mg',
    uses: ['Headache relief', 'Fever reduction', 'Toothache', 'Muscle pain'],
    sideEffects: ['Nausea (rare)', 'Insomnia if taken late (due to caffeine)'],
    warnings: 'Do not exceed 8 tablets in 24 hours. Avoid taking with other paracetamol products.',
    verifiedStatus: true
  },
  {
    id: 'med-2',
    name: 'Augmentin 625mg',
    genericName: 'Amoxicillin / Clavulanic Acid',
    manufacturer: 'GSK',
    category: 'Antibiotic',
    dosage: '500mg / 125mg',
    uses: ['Bacterial infections', 'Respiratory tract infections', 'Sinusitis'],
    sideEffects: ['Diarrhea', 'Mild stomach upset'],
    warnings: 'Complete full prescribed course. Take with meals to avoid stomach irritation.',
    verifiedStatus: true
  }
];

export const MedicineSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Search filter logic
  const filteredMedicines = SAMPLE_MEDICINES.filter(
    (med) =>
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.genericName.toLowerCase().includes(query.toLowerCase()) ||
      med.category.toLowerCase().includes(query.toLowerCase())
  );

  // Simulated scan trigger (camera integration placeholder)
  const handleSimulatedScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Auto select sample medicine post-scan
      setSelectedMedicine(SAMPLE_MEDICINES[0]);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-serif font-bold text-[#0E3B36]">
          Medicine Directory & Scanner
        </h2>
        <p className="text-xs text-stone-600">
          Search medicines by name, generic formula, or scan your prescription package.
        </p>
      </div>

      {/* MERGED SEARCH BAR & CAMERA SCANNER */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm space-y-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine name, formula, or use..."
            aria-label="Search medicines by name, formula, or use"
            className="w-full pl-10 pr-24 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20 focus:border-[#0E3B36]"
          />

          {/* Integrated Scanner Trigger Button */}
          <button
            type="button"
            onClick={handleSimulatedScan}
            className="absolute right-2.5 px-3 py-1.5 rounded-lg bg-[#0E3B36] hover:bg-[#092824] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Scan Medicine Box / Prescription"
            aria-label="Scan medicine box or prescription"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
          <span>Tip: You can search generic names like Paracetamol or Amoxicillin</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Camera AI Ready
          </span>
        </div>
      </div>

      {/* CAMERA SCANNER MODAL / OVERLAY */}
      {isScanning && (
        <div className="p-6 rounded-2xl bg-stone-900 text-white text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Scanning Package...</h4>
            <p className="text-xs text-stone-300">Point your camera at the medicine name or barcode</p>
          </div>
          <button
            type="button"
            onClick={() => setIsScanning(false)}
            aria-label="Cancel medicine scan"
            className="px-4 py-1.5 rounded-lg bg-stone-800 text-xs font-medium hover:bg-stone-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* SEARCH RESULTS DISPLAY */}
      {!selectedMedicine && (
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-sm text-[#0E3B36]">
            Available Medicines ({filteredMedicines.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                onClick={() => setSelectedMedicine(med)}
                className="p-4 rounded-xl bg-white border border-[#E8E2D8] hover:border-[#0E3B36] transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#0E3B36]">
                      {med.name}
                    </h4>
                    <p className="text-xs font-medium text-emerald-700">{med.genericName}</p>
                  </div>
                  <span className="p-1.5 rounded-lg bg-stone-100 text-stone-600">
                    <Pill className="w-4 h-4" />
                  </span>
                </div>

                <div className="text-xs text-stone-500 space-y-0.5">
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Category:</strong> {med.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED MEDICINE VIEW MODAL / CARD */}
      {selectedMedicine && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#0E3B36]">
                  {selectedMedicine.name}
                </h3>
                {selectedMedicine.verifiedStatus && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Medical Information" />
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-700">
                {selectedMedicine.genericName} ({selectedMedicine.dosage})
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMedicine(null)}
              aria-label="Close medicine details"
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#0E3B36]" /> Primary Uses:
              </span>
              <ul className="list-disc list-inside text-stone-600 pl-1 space-y-0.5">
                {selectedMedicine.uses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#0E3B36]" /> Manufacturer:
              </span>
              <p className="text-stone-600">{selectedMedicine.manufacturer}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">Important Safety Warning:</strong>
              {selectedMedicine.warnings}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
