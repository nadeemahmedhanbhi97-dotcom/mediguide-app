import React, { useState } from 'react';
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
      {/* Clean Single Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-gray-900">MediGuide</h1>
              <p className="text-xs text-gray-500">Sibi Medical Directory & AI Assistant</p>
            </div>
          </div>

          {/* Single Action Button for Camera Scan */}
          <button
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition flex items-center gap-2"
          >
            📷 Scan Medicine
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Scanned Result Banner */}
        {scannedMedicine && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Scanned Medicine</p>
              <h2 className="text-lg font-bold text-emerald-900">{scannedMedicine}</h2>
            </div>
            <button 
              onClick={() => setScannedMedicine(null)}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* Section 1: AI Health Chatbot */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <HealthChatbot scannedMedicine={scannedMedicine || undefined} />
        </section>

        {/* Section 2: Doctors Directory & Search */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <DoctorSearch />
        </section>
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
