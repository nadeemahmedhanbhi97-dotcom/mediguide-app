import React, { useState } from 'react';
import DoctorSearch from './components/DoctorSearch';
import MedicineSearch from './components/MedicineSearch';
import CameraCaptureModal from './components/CameraCaptureModal';
import HealthChatbot from './components/HealthChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'doctors' | 'medicine'>('doctors');
  const [scannedMedicine, setScannedMedicine] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleScanComplete = (medicineName: string) => {
    setScannedMedicine(medicineName);
    setIsCameraOpen(false);
    setActiveTab('medicine');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-gray-900">MediGuide</h1>
              <p className="text-xs text-gray-500">Sibi Medical Directory & AI Assistant</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            aria-label="Scan medicine with camera"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            📷 Scan Medicine
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-4xl mx-auto px-4 flex border-t border-gray-100 gap-2 pt-2 pb-1 overflow-x-auto">
          <button
            type="button"
            aria-label="Find doctors"
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'doctors'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👨‍⚕️ Find Doctors
          </button>

          <button
            type="button"
            aria-label="Medicine directory and scanner"
            onClick={() => setActiveTab('medicine')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'medicine'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💊 Medicine Directory & Scanner
          </button>

          <button
            type="button"
            aria-label="AI health chat"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'chat'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🤖 AI Health Chat
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {scannedMedicine && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Scanned Medicine</p>
              <h2 className="text-lg font-bold text-emerald-900">{scannedMedicine}</h2>
            </div>
            <button 
              type="button"
              onClick={() => setScannedMedicine(null)}
              aria-label="Clear scanned medicine"
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* Navigation Tab Views */}
        {activeTab === 'doctors' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <DoctorSearch />
          </section>
        )}

        {activeTab === 'medicine' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <MedicineSearch />
          </section>
        )}

        {activeTab === 'chat' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <HealthChatbot scannedMedicine={scannedMedicine || undefined} />
          </section>
        )}
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
