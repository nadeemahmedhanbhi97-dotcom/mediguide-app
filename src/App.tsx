import React, { useState } from 'react';
import SearchHeader from './components/SearchHeader';
import DoctorSearch from './components/DoctorSearch';
import CameraCaptureModal from './components/CameraCaptureModal';
import HealthChatbot from './components/HealthChatbot';

export default function App() {
  const [scannedMedicine, setScannedMedicine] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleScanComplete = (medicineName: string) => {
    setScannedMedicine(medicineName);
    setIsCameraOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <SearchHeader onOpenScanner={() => setIsCameraOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {scannedMedicine && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Scanned Medicine</p>
              <h2 className="text-lg font-bold text-emerald-900">{scannedMedicine}</h2>
            </div>
            <button 
              onClick={() => setScannedMedicine(null)}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* AI Assistant Chatbot */}
        <HealthChatbot scannedMedicine={scannedMedicine || undefined} />

        {/* Doctor Search & Directory */}
        <DoctorSearch />
      </main>

      {/* OCR Camera Modal */}
      {isCameraOpen && (
        <CameraCaptureModal 
          onClose={() => setIsCameraOpen(false)} 
          onScanComplete={handleScanComplete} 
        />
      )}
    </div>
  );
}
