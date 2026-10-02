/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MedicineSearch } from './components/MedicineSearch.tsx';
import { MedicalStoreDashboard } from './components/MedicalStoreDashboard.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { DoctorSearch } from './components/DoctorSearch.tsx';
import { PatientRecords } from './components/PatientRecords.tsx';
import { FormulaLibrary } from './components/FormulaLibrary.tsx';
import { MedicalCalculators } from './components/MedicalCalculators.tsx';
import { HealthTopics } from './components/HealthTopics.tsx';
import { RemindersView } from './components/RemindersView.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { TRANSLATIONS, Language } from './utils/translations.ts';
import { Doctor } from './types.ts';
import doctorBgImage from './assets/images/doctor_bg.jpg';
import {
  Pill, Stethoscope, Users, FlaskConical, Calculator, HeartPulse,
  Bell, Cpu, Moon, Sun, Globe, Shield, Heart, UserCircle, Menu, X, Building2, MapPin
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'medicines' | 'medical_store' | 'pharmacies' | 'doctors' | 'patients' | 'formulas' | 'calculators' | 'health_topics' | 'reminders' | 'admin'
  >('medicines');

  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('user_primary');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDoctorForVisit, setSelectedDoctorForVisit] = useState<Doctor | null>(null);
  const [formulaSearchQuery, setFormulaSearchQuery] = useState<string>('');
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [triggerScanCounter, setTriggerScanCounter] = useState(0);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const activeTabBtnRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const t = TRANSLATIONS[language];

  const navTabs = [
    { id: 'medicines', label: t.navMedicines, icon: Pill },
    { id: 'medical_store', label: language === 'ur' ? 'میڈیکل اسٹور' : 'Medical Store', icon: Building2 },
    { id: 'doctors', label: t.navDoctors, icon: Stethoscope },
    { id: 'patients', label: t.navPatients, icon: Users },
    { id: 'formulas', label: t.navFormulas, icon: FlaskConical },
    { id: 'calculators', label: t.navCalculators, icon: Calculator },
    { id: 'health_topics', label: t.navHealthTopics, icon: HeartPulse },
    { id: 'reminders', label: language === 'ur' ? 'یاد دہانیاں' : 'Reminders', icon: Bell }
  ];

  const checkScroll = () => {
    if (mobileNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileNavRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = mobileNavRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('resize', checkScroll);
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    if (activeTabBtnRef.current) {
      activeTabBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
    const timer = setTimeout(checkScroll, 350);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Load favorites & settings
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('mediguide_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedLang = localStorage.getItem('mediguide_lang') as Language;
      if (savedLang) setLanguage(savedLang);

      const savedUser = localStorage.getItem('mediguide_current_user');
      if (savedUser) setCurrentUserId(savedUser);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Update HTML direction when language is Urdu
  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
    localStorage.setItem('mediguide_lang', language);
  }, [language]);

  // Dark mode class toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleFavorite = (medId: string) => {
    const updated = favorites.includes(medId)
      ? favorites.filter((id) => id !== medId)
      : [...favorites, medId];
    setFavorites(updated);
    localStorage.setItem('mediguide_favorites', JSON.stringify(updated));
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('mediguide_current_user', userId);
  };

  const handleBookOrVisitDoctor = (doctor: Doctor) => {
    setSelectedDoctorForVisit(doctor);
    setActiveTab('patients');
  };

  const handleNavigateToFormula = (ingredient: string) => {
    setFormulaSearchQuery(ingredient);
    setActiveTab('formulas');
  };

  return (
    <div className={`min-h-screen bg-[#FBF8F2] text-[#101827] flex flex-col font-sans transition-colors duration-200 ${language === 'ur' ? 'font-urdu' : ''}`}>
      {/* Tier 2 Quota Banner for Demo Key */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Universal Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E2D8] shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo & Brand on the Left */}
          <div
            onClick={() => setActiveTab('medicines')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0E3B36] flex items-center justify-center text-white shadow-xs group-hover:bg-[#092824] transition font-bold">
              <Pill className="w-5 h-5 rotate-45 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#0E3B36]">
                  {t.appName}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E8F3EE] text-[#0E3B36] border border-[#C4DFD3] shadow-xs">
                  by <strong className="font-bold">Usman</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#5B6577] block -mt-0.5 font-medium hidden sm:block">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs: Medicines, Medical Store, Find Doctors, Patient Records */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 overflow-x-auto no-scrollbar py-1">
            {navTabs.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'medical_store' && activeTab === 'pharmacies');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-3.5 py-1.5 inline-flex items-center whitespace-nowrap text-sm transition cursor-pointer ${
                    isActive
                      ? 'text-[#0E3B36] font-semibold border-b-2 border-[#B08D57] pb-1'
                      : 'text-[#5B6577] hover:text-[#0E3B36] font-medium border-b-2 border-transparent pb-1'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-1.5 shrink-0 ${isActive ? 'text-[#0E3B36]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Location Pin, Account Pill, Urdu Option */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Location Pin Shortcut */}
            <button
              type="button"
              onClick={() => setActiveTab('doctors')}
              className="p-2 text-[#0E3B36] hover:bg-[#E8F3EE] rounded-full transition cursor-pointer"
              title="Find Doctors & Clinics by Location"
            >
              <MapPin className="w-4 h-4 text-[#0E3B36]" />
            </button>

            {/* Primary Account Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-xs font-medium text-stone-800 shadow-xs hover:border-[#B08D57] transition">
              <UserCircle className="w-3.5 h-3.5 text-[#0E3B36]" />
              <select
                value={currentUserId}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-transparent text-stone-900 font-semibold focus:outline-none cursor-pointer pr-1"
                title="Active Patient Profile"
              >
                <option value="user_primary" className="text-stone-900">Primary Account</option>
                <option value="user_family" className="text-stone-900">Family Account</option>
                <option value="user_guest" className="text-stone-900">Guest Account</option>
              </select>
            </div>

            {/* Urdu Toggle Button */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="px-3.5 py-1.5 rounded-full border border-[#E8E2D8] bg-white hover:border-[#B08D57] text-stone-800 text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Toggle English / اردو"
            >
              {language === 'en' ? 'اردو' : 'English'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#0E3B36] hover:bg-stone-100 transition border border-[#E8E2D8]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#0E3B36]" /> : <Menu className="w-5 h-5 text-[#0E3B36]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E2D8] bg-white px-4 py-3 space-y-1 shadow-lg">
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'medical_store' && activeTab === 'pharmacies');
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                  className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#0E3B36]/10 text-[#0E3B36] font-semibold border-l-2 border-[#B08D57]'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-1.5 ${isActive ? 'text-[#0E3B36]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2.5 text-xs font-medium transition ${
                activeTab === 'admin'
                  ? 'bg-[#0E3B36]/10 text-[#0E3B36] font-semibold border-l-2 border-[#B08D57]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Cpu className="w-4 h-4 mr-1.5 text-stone-500" />
              <span>Admin & Diagnostics</span>
            </button>
          </div>
        )}
      </header>

      {/* Main View Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12 space-y-6">
        {activeTab === 'medicines' && (
          <>
            <HeroSection
              onSearch={(query) => setHeroSearchQuery(query)}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              onOpenScan={() => {
                setActiveTab('medicines');
                setTriggerScanCounter((prev) => prev + 1);
              }}
            />
            <MedicineSearch
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNavigateToFormula={handleNavigateToFormula}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              initialQuery={heroSearchQuery}
              triggerCameraModal={triggerScanCounter}
            />
          </>
        )}

        {(activeTab === 'medical_store' || activeTab === 'pharmacies') && (
          <MedicalStoreDashboard />
        )}

        {activeTab === 'doctors' && (
          <DoctorSearch onBookOrVisit={handleBookOrVisitDoctor} />
        )}

        {activeTab === 'patients' && (
          <PatientRecords
            currentUserId={currentUserId}
            selectedDoctorForVisit={selectedDoctorForVisit}
            onClearSelectedDoctor={() => setSelectedDoctorForVisit(null)}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaLibrary initialQuery={formulaSearchQuery} />
        )}

        {activeTab === 'calculators' && <MedicalCalculators />}

        {activeTab === 'health_topics' && <HealthTopics />}

        {activeTab === 'reminders' && <RemindersView currentUserId={currentUserId} />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md text-[#101827] border-t border-[#E8E2D8] shadow-md select-none"
      >
        <div className="relative max-w-full">
          {/* Scroll fade indicator - Left */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 sm:hidden" />
          )}

          {/* Scroll fade indicator - Right */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 sm:hidden" />
          )}

          <div
            ref={mobileNavRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-2.5 scroll-smooth touch-pan-x sm:justify-around"
          >
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'medical_store' && activeTab === 'pharmacies');
              return (
                <button
                  key={item.id}
                  ref={isActive ? activeTabBtnRef : null}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex flex-col items-center justify-center shrink-0 min-w-[70px] sm:min-w-[76px] px-2 py-1.5 transition ${
                    isActive
                      ? 'text-[#0E3B36] font-semibold border-t-2 border-[#B08D57] -mt-[1px]'
                      : 'text-stone-600 hover:text-[#0E3B36] font-medium'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#0E3B36]' : 'text-stone-500'}`} />
                  <span className={`text-[10px] sm:text-[11px] whitespace-nowrap leading-tight text-center ${isActive ? 'text-[#0E3B36] font-bold' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8E2D8] bg-[#FBF8F2] py-8 text-center text-xs text-[#5B6577] space-y-2">
        <div className="max-w-4xl mx-auto px-4 leading-relaxed">
          <p className="font-serif font-bold text-[#0E3B36] text-sm">
            MediGuide by Usman — Global Medical Platform & Business Tool
          </p>
          <p className="mt-1 text-[11px] text-[#5B6577]">
            {t.educationalDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}

