import React, { useState } from 'react';

export default function MediGuideApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'doctors' | 'medicines' | 'ai-chat'>('home');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [viewDegreeUrl, setViewDegreeUrl] = useState<string | null>(null);

  // Sample Live Data
  const cityData = [
    { city: 'Karachi', count: 5000 },
    { city: 'Lahore', count: 100 },
    { city: 'Sibi', count: 10 },
  ];

  const doctorsList = [
    { id: 1, name: 'Dr. Ahmad Khan', specialty: 'Cardiologist', hospital: 'DHQ Hospital Sibi', city: 'Sibi', phone: '+923001234567', pmdc: 'PMDC-8921-P', degree: 'https://via.placeholder.com/600x800?text=Scanned+MBBS+Degree' },
    { id: 2, name: 'Dr. Fatima Zahra', specialty: 'Gynecologist', hospital: 'Civil Hospital Karachi', city: 'Karachi', phone: '+923009876543', pmdc: 'PMDC-4321-K', degree: 'https://via.placeholder.com/600x800?text=Scanned+Degree' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      {/* Top Header */}
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-2xl font-black text-emerald-800 tracking-wide">MediGuide</span>
        </div>

        {activeTab !== 'home' && (
          <nav className="flex gap-2 bg-gray-100 p-1 rounded-full">
            <button onClick={() => setActiveTab('doctors')} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeTab === 'doctors' ? 'bg-emerald-700 text-white shadow' : 'text-gray-600'}`}>Doctors</button>
            <button onClick={() => setActiveTab('medicines')} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeTab === 'medicines' ? 'bg-emerald-700 text-white shadow' : 'text-gray-600'}`}>Medicines</button>
            <button onClick={() => setActiveTab('ai-chat')} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeTab === 'ai-chat' ? 'bg-emerald-700 text-white shadow' : 'text-gray-600'}`}>Voice AI</button>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <a href="tel:1122" className="bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-red-200">🚨 1122 Emergency</a>
          <button className="text-xs border px-3 py-1.5 rounded-md font-medium">Eng / Urdu</button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-emerald-900 text-white p-8 rounded-2xl shadow-xl flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">Explore Health Information with Confidence.</h1>
                <p className="text-emerald-200 text-sm max-w-xl">Verified doctor directories, degree inspection, auto-city breakdown, and multi-lingual voice AI guidance.</p>
              </div>
              <button onClick={() => setShowRegModal(true)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl shadow-lg">
                + Register as Doctor
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div onClick={() => setActiveTab('doctors')} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition">
                <div className="text-2xl mb-2">🩺</div>
                <h3 className="font-bold text-lg">Find Doctors (Country/City)</h3>
                <p className="text-xs text-gray-500 mb-4">Pakistan (5,110 Doctors) • Sibi (10) • Karachi (5,000)</p>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Explore Directory &rarr;</span>
              </div>

              <div onClick={() => setActiveTab('medicines')} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition">
                <div className="text-2xl mb-2">💊</div>
                <h3 className="font-bold text-lg">Medicine Guide & Search</h3>
                <p className="text-xs text-gray-500 mb-4">Search formulas, dosage, warnings & camera scan.</p>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Search Medicines &rarr;</span>
              </div>

              <div onClick={() => setActiveTab('doctors')} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition">
                <div className="text-2xl mb-2">📜</div>
                <h3 className="font-bold text-lg">Verify Doctor Credentials</h3>
                <p className="text-xs text-gray-500 mb-4">Inspect high-res PMDC certificates & MBBS degrees online.</p>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Inspect Credentials &rarr;</span>
              </div>

              <div onClick={() => setActiveTab('ai-chat')} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition">
                <div className="text-2xl mb-2">🎙️</div>
                <h3 className="font-bold text-lg">Multi-Lingual Voice AI Chat</h3>
                <p className="text-xs text-gray-500 mb-4">Ask in Urdu, Pashto, Balochi, Sindhi, or English via voice or text.</p>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">Open Voice Assistant &rarr;</span>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Directory Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Country Directory: Pakistan</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button onClick={() => setSelectedCity(null)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedCity === null ? 'bg-emerald-800 text-white' : 'bg-white'}`}>
                All Cities (5,110)
              </button>
              {cityData.map(c => (
                <button key={c.city} onClick={() => setSelectedCity(c.city)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedCity === c.city ? 'bg-emerald-800 text-white' : 'bg-white'}`}>
                  {c.city} ({c.count})
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {doctorsList.filter(d => !selectedCity || d.city === selectedCity).map(doc => (
                <div key={doc.id} className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-base">{doc.name}</h4>
                      <p className="text-xs text-emerald-700 font-medium">{doc.specialty}</p>
                      <p className="text-xs text-gray-500">{doc.hospital} ({doc.city})</p>
                      <p className="text-[10px] text-gray-400 mt-1">PMDC: {doc.pmdc}</p>
                    </div>
                    <button onClick={() => setViewDegreeUrl(doc.degree)} className="h-fit text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded border border-blue-200">
                      📜 View Degree
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t text-xs">
                    <a href={`tel:${doc.phone}`} className="flex-1 text-center bg-gray-100 py-1.5 rounded font-semibold">📞 Call</a>
                    <a href={`https://wa.me/${doc.phone}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-emerald-100 text-emerald-800 py-1.5 rounded font-semibold">💬 WhatsApp</a>
                    <a href={`https://maps.google.com/?q=${doc.hospital}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-gray-100 py-1.5 rounded font-semibold">🗺️ Route</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Voice Assistant Tab */}
        {activeTab === 'ai-chat' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-2xl mx-auto space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">🎙️ Multi-Lingual Voice Health Assistant</h2>
            <p className="text-xs text-gray-500">Urdu, Balochi, Pashto, Sindhi, Roman Urdu, ya English mein dawai ke bare mein poochne ke liye mic button dabayein.</p>

            <div className="h-64 border rounded-xl p-4 bg-slate-50 text-xs text-gray-500 flex items-center justify-center">
              AI Chat Ready. Press Mic to Speak...
            </div>

            <div className="flex gap-2">
              <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold animate-pulse">🎤 Hold to Speak</button>
              <input type="text" placeholder="Ya text mein type karein..." className="flex-1 border px-3 text-xs rounded-xl" />
              <button className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold">Send</button>
            </div>
          </div>
        )}
      </main>

      {/* Degree View Modal */}
      {viewDegreeUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded-2xl max-w-md w-full space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Verified Scanned MBBS / PMDC Degree</h3>
              <button onClick={() => setViewDegreeUrl(null)} className="text-gray-400 font-bold">✕</button>
            </div>
            <img src={viewDegreeUrl} alt="Degree" className="w-full h-80 object-cover rounded-lg border" />
            <button onClick={() => alert('Profile Flagged for Review.')} className="w-full text-center text-xs text-red-600 font-bold py-1">⚠️ Report Fake Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}
