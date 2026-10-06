import React, { useState } from 'react';
import {
  Search, Pill, Camera, Stethoscope, Store
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenScan?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onNavigateToTab,
  onOpenScan
}) => {
  const [localQuery, setLocalQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
      onNavigateToTab('medicines');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 my-2 sm:my-4">
      {/* ========================================================================= */}
      {/* DYNAMIC LUXURY HERO STAGE — PREMIUM DIGITAL PRODUCT / GUMROAD SHOWCASE     */}
      {/* ========================================================================= */}
      <div
        id="hero-section-container"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#061815] via-[#092622] to-[#041210] border border-emerald-500/25 shadow-[0_30px_90px_-20px_rgba(2,18,14,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] p-6 sm:p-10 lg:p-12 transition-all duration-500"
      >
        {/* Top Rim Specular Refinement Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

        {/* Dynamic Ambient Lighting & Specular Meshes */}
        <div
          className="absolute -top-32 -right-20 w-[550px] h-[550px] bg-gradient-to-br from-emerald-500/20 via-teal-400/12 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse"
          style={{ animationDuration: '7s' }}
        />
        <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-amber-400/10 via-emerald-600/15 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.07)_0%,transparent_70%)] pointer-events-none" />

        {/* Micro-dot Luxury Architectural Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        {/* Bottom subtle ambient floor light */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#020B09]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: HEADLINE, LUXURY COPY, GLASS SEARCH & DISCLAIMER */}
          <div className="w-full space-y-5 text-left flex flex-col justify-center">
            
            {/* Top Luxury Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs font-semibold shadow-inner backdrop-blur-md self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span>Global Medical Platform & Business Intelligence Suite</span>
            </div>

            {/* Main Headline in Fraunces Serif with Luminous Accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-serif font-bold text-white tracking-tight leading-[1.12]">
              Explore health<br />
              information<br />
              with <span className="italic font-serif font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">confidence.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal max-w-xl">
              Curated clinical drug reference, verified specialist directory, intelligent patient records, and medical store management engineered for healthcare excellence.
            </p>

            {/* Luxury Frosted Glass Search Console */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl pt-1">
              <div className="flex items-center bg-white/10 hover:bg-white/[0.14] rounded-xl border border-white/20 hover:border-emerald-400/50 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/25 transition">
                <div className="pl-3 pr-2 text-emerald-300/70">
                  <Search className="w-5 h-5 text-emerald-300/70" />
                </div>
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search medicine brand, generic formula, drug class..."
                  aria-label="Search medicine brand, generic formula, or drug class"
                  className="w-full py-2.5 px-2 bg-transparent text-xs sm:text-sm text-white placeholder-emerald-200/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search medicines"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs sm:text-sm font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-[0.98]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Educational Disclaimer Trust Line */}
            <div className="pt-0.5 text-xs text-emerald-200/60 flex items-start sm:items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold text-[10px]">
                i
              </div>
              <span>Licensed clinical reference — not a substitute for advice from a licensed physician or pharmacist.</span>
            </div>

          </div>

          {/* RIGHT COLUMN: UPLOADED HERO IMAGE NATURALLY INTEGRATED INTO LUXURY STAGE */}
          <div className="relative w-full flex justify-center items-center">
            {/* Luminous Volumetric Backlight behind the Doctor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_65%_45%,rgba(16,185,129,0.24)_0%,rgba(20,184,166,0.12)_35%,rgba(5,150,105,0.04)_60%,transparent_75%)] blur-2xl pointer-events-none" />

            {/* Specular Warm Champagne Accent Flare */}
            <div className="absolute top-8 right-12 w-48 h-48 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

            {/* Image Wrapper with Luxury Lighting */}
            <div className="relative w-full max-h-[520px] flex justify-center items-center">
              <img
                src="https://i.ibb.co/tG0vdWH/mediguide-hero-1920x1080.jpg"
                alt="Doctor"
                className="w-full h-auto object-cover rounded-2xl"
                onError={(e) => {
                  e.currentTarget.src = '/mediguide-approved-hero.png';
                }}
                loading="eager"
              />

              {/* High-End Studio Pedestal Glow Line */}
              <div className="absolute -bottom-2 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 FEATURE CARDS DIRECTLY BELOW HERO (REAL FUNCTIONAL SHORTCUTS)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Medicine Search */}
        <div
          onClick={() => onNavigateToTab('medicines')}
          className="bg-white border border-[#E2EBE7] hover:border-[#0E3B36] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#0E3B36] text-[#0E3B36] group-hover:text-white flex items-center justify-center shrink-0 transition">
            <Pill className="w-6 h-6 rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#0E3B36] transition truncate">
              Medicine Search
            </h3>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Brand, generic, uses, side effects
            </p>
          </div>
        </div>

        {/* Card 2: Scan Medicine */}
        <div
          onClick={() => {
            if (onOpenScan) {
              onOpenScan();
            } else {
              onNavigateToTab('medicines');
            }
          }}
          className="bg-white border border-[#E2EBE7] hover:border-[#0E3B36] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#0E3B36] text-[#0E3B36] group-hover:text-white flex items-center justify-center shrink-0 transition">
            <Camera className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#0E3B36] transition truncate">
              Scan Medicine
            </h3>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Identify medicines with camera
            </p>
          </div>
        </div>

        {/* Card 3: Find Doctors */}
        <div
          onClick={() => onNavigateToTab('doctors')}
          className="bg-white border border-[#E2EBE7] hover:border-[#0E3B36] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#0E3B36] text-[#0E3B36] group-hover:text-white flex items-center justify-center shrink-0 transition">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#0E3B36] transition truncate">
              Find Doctors
            </h3>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Search by location & specialty
            </p>
          </div>
        </div>

        {/* Card 4: Medical Store & DigiKhata */}
        <div
          onClick={() => onNavigateToTab('medical_store')}
          className="bg-white border border-[#E2EBE7] hover:border-[#0E3B36] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#0E3B36] text-[#0E3B36] group-hover:text-white flex items-center justify-center shrink-0 transition">
            <Store className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#0E3B36] transition truncate">
              Medical Store & DigiKhata
            </h3>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Manage stock, sales & accounts
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
