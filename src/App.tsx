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
      {/* Top Navigation Bar */}
      <SearchHeader onOpenScanner={() => setIsCameraOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Floating Quick Scanner Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium shadow hover:bg-emerald-700 flex items-center gap-2"
          >
            📷 Scan Medicine Packaging
          </button>
        </div>

        {/* Scanned Result Banner */}
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

        {/* Always Visible AI Assistant Chatbot */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <HealthChatbot scannedMedicine={scannedMedicine || undefined} />
        </section>

        {/* Sibi Doctors Directory */}
        <section>
          <DoctorSearch />
        </section>
      </main>

      {/* Camera Modal */}
      {isCameraOpen && (
        <CameraCaptureModal 
          onClose={() => setIsCameraOpen(false)} 
          onScanComplete={handleScanComplete} 
        />
      )}
    </div>
  );
}
