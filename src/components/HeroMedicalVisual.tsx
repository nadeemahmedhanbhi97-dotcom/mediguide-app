import React from 'react';
import doctorBgImg from '../assets/images/doctor_bg.jpg';
import {
  Pill, Camera, Stethoscope, Store, FolderHeart, TrendingUp,
  MapPin, Check, Sparkles, Plus, ShieldCheck
} from 'lucide-react';

interface HeroMedicalVisualProps {
  onNavigateToTab: (tab: string) => void;
  onOpenScan?: () => void;
}

export const HeroMedicalVisual: React.FC<HeroMedicalVisualProps> = ({
  onNavigateToTab,
  onOpenScan
}) => {
  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none py-2">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0E3B36]/10 via-[#0284C7]/10 to-emerald-400/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Visual Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F0F7F5] via-[#E6F0ED] to-[#DDECE8] border border-[#CDE1DA] shadow-xl">
        
        {/* 1. CLINICAL ROOM BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <img
            src={doctorBgImg}
            alt="Doctor in Consultation Room"
            className="w-full h-full object-cover object-center scale-105 filter brightness-105 contrast-[1.02]"
          />
          {/* Soft atmospheric overlay balancing light room and globe illumination */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
        </div>

        {/* 2. 3D GLOWING EARTH GLOBE (Positioned behind doctor on the left) */}
        <div className="absolute left-[8%] top-[14%] w-[210px] sm:w-[260px] h-[210px] sm:h-[260px] z-10 pointer-events-none">
          {/* Radial atmosphere glow */}
          <div className="absolute inset-0 rounded-full bg-radial from-cyan-400/40 via-blue-500/20 to-transparent blur-md" />
          
          {/* Globe Spherical SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            <defs>
              <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="45%" stopColor="#0284C7" />
                <stop offset="85%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#075985" />
              </radialGradient>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Sphere Base */}
            <circle cx="100" cy="100" r="92" fill="url(#globeGrad)" />
            {/* Subtle atmospheric rim highlight */}
            <circle cx="100" cy="100" r="92" stroke="#E0F2FE" strokeWidth="2.5" fill="none" opacity="0.6" />
            
            {/* Latitude / Longitude Grid Lines */}
            <ellipse cx="100" cy="100" rx="92" ry="32" stroke="url(#gridGrad)" strokeWidth="1" fill="none" opacity="0.45" />
            <ellipse cx="100" cy="100" rx="92" ry="64" stroke="url(#gridGrad)" strokeWidth="1" fill="none" opacity="0.45" />
            <ellipse cx="100" cy="100" rx="32" ry="92" stroke="url(#gridGrad)" strokeWidth="1" fill="none" opacity="0.45" />
            <ellipse cx="100" cy="100" rx="64" ry="92" stroke="url(#gridGrad)" strokeWidth="1" fill="none" opacity="0.45" />

            {/* Stylized Continents & Medical Network Nodes */}
            <g fill="#FFFFFF" fillOpacity="0.85">
              {/* Eurasia / Africa silhouette elements */}
              <path d="M70 65 Q85 55 105 60 Q120 70 135 65 Q145 75 140 90 Q125 95 110 88 Q95 95 80 85 Z" opacity="0.8" />
              <path d="M85 95 Q100 95 110 115 Q105 135 90 140 Q75 130 80 110 Z" opacity="0.75" />
              <path d="M125 100 Q145 105 155 125 Q140 135 120 120 Z" opacity="0.7" />
            </g>
          </svg>

          {/* Location Pins on Globe */}
          <div className="absolute top-[32%] left-[48%] animate-bounce duration-1000">
            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center">
              <MapPin className="w-3 h-3 text-stone-900 fill-stone-900" />
            </div>
          </div>
          <div className="absolute top-[48%] left-[45%]">
            <div className="w-4 h-4 rounded-full bg-amber-400 border border-white shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
            </div>
          </div>
        </div>

        {/* 3. SIX FLOATING INTERACTIVE FEATURE BADGES (Arranged as shown in reference) */}
        
        {/* Left Side Badges */}
        {/* Badge 1: Medicines Information */}
        <button
          type="button"
          onClick={() => onNavigateToTab('medicines')}
          className="absolute top-[16%] left-[3%] sm:left-[5%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center group-hover:bg-[#E8F3EE] transition">
            <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white">
              <Pill className="w-4 h-4 rotate-45" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-emerald-100/60 leading-tight">
            Medicines<br />Information
          </span>
        </button>

        {/* Badge 2: Scan & Identify Medicines */}
        <button
          type="button"
          onClick={() => onOpenScan ? onOpenScan() : onNavigateToTab('medicines')}
          className="absolute top-[44%] left-[4%] sm:left-[6%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition">
            <div className="w-7 h-7 rounded-full bg-[#0369A1] flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-blue-100/60 leading-tight">
            Scan & Identify<br />Medicines
          </span>
        </button>

        {/* Badge 3: Find Doctors */}
        <button
          type="button"
          onClick={() => onNavigateToTab('doctors')}
          className="absolute bottom-[22%] left-[9%] sm:left-[11%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-50 transition">
            <div className="w-7 h-7 rounded-full bg-[#0E3B36] flex items-center justify-center text-white">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-emerald-100/60 leading-tight">
            Find<br />Doctors
          </span>
        </button>

        {/* Right Side Badges */}
        {/* Badge 4: Medical Store Business */}
        <button
          type="button"
          onClick={() => onNavigateToTab('medical_store')}
          className="absolute top-[16%] right-[3%] sm:right-[5%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center group-hover:bg-[#E8F3EE] transition">
            <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-emerald-100/60 leading-tight">
            Medical Store<br />Business
          </span>
        </button>

        {/* Badge 5: Patient Records */}
        <button
          type="button"
          onClick={() => onNavigateToTab('patients')}
          className="absolute top-[44%] right-[3%] sm:right-[5%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition">
            <div className="w-7 h-7 rounded-full bg-[#0369A1] flex items-center justify-center text-white">
              <FolderHeart className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-blue-100/60 leading-tight">
            Patient<br />Records
          </span>
        </button>

        {/* Badge 6: DigiKhata Accounts */}
        <button
          type="button"
          onClick={() => onNavigateToTab('medical_store')}
          className="absolute bottom-[22%] right-[5%] sm:right-[7%] z-30 group flex flex-col items-center cursor-pointer transition transform hover:scale-105"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-50 transition">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0E3B36] mt-1 text-center bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-emerald-100/60 leading-tight">
            DigiKhata<br />Accounts
          </span>
        </button>

        {/* 4. FOREGROUND CLINICAL TABLE SHOWCASE (In front of doctor) */}
        <div className="absolute inset-x-0 bottom-0 h-[42%] z-20 pointer-events-none">
          {/* Glass clinical counter surface reflection */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-white/95 via-white/80 to-transparent" />

          {/* Table Items Flex Container */}
          <div className="relative w-full h-full flex items-end justify-between px-3 sm:px-6 pb-2">
            
            {/* Left Items: Medicine bottles & blister pills */}
            <div className="flex items-end gap-1.5 sm:gap-2">
              {/* Amber Dropper Bottle */}
              <div className="relative w-7 sm:w-9 h-14 sm:h-18 rounded-t-sm rounded-b-md bg-gradient-to-r from-amber-700 via-amber-600 to-amber-900 border border-amber-950/40 shadow-md flex flex-col items-center justify-between pb-1">
                {/* White Dropper Cap */}
                <div className="w-4 sm:w-5 h-3 -mt-2.5 rounded-t-sm bg-white border border-stone-300 shadow-xs" />
                {/* Label with Cross */}
                <div className="w-5 sm:w-7 h-6 sm:h-8 bg-white/95 rounded-xs p-0.5 shadow-xs flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-700 flex items-center justify-center text-white">
                    <Plus className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>

              {/* Smaller Amber Bottle */}
              <div className="relative w-6 sm:w-7 h-10 sm:h-13 rounded-t-sm rounded-b-md bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border border-amber-950/40 shadow-md hidden xs:flex flex-col items-center justify-end pb-1">
                <div className="w-3.5 h-2.5 -mt-2 rounded-t-sm bg-white border border-stone-300" />
                <div className="w-4 h-4 bg-white/90 rounded-xs" />
              </div>

              {/* Foil Blister Packs of Pills */}
              <div className="relative w-12 sm:w-16 h-8 sm:h-11 rounded-sm bg-gradient-to-br from-stone-200 via-slate-100 to-stone-300 border border-stone-300 shadow-md p-1 grid grid-cols-3 gap-0.5 rotate-[-6deg]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2.5 sm:w-3.5 h-2 sm:h-2.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-xs border border-blue-700/30" />
                ))}
              </div>
            </div>

            {/* Center Item: Phone showing 'Scan Medicine' */}
            <div className="relative -mb-1 sm:-mb-2 z-30 transform hover:scale-105 transition pointer-events-auto cursor-pointer" onClick={onOpenScan}>
              {/* Smartphone Frame */}
              <div className="w-[100px] sm:w-[130px] h-[135px] sm:h-[175px] rounded-2xl bg-stone-900 border-2 sm:border-[3px] border-stone-700 shadow-2xl p-1 sm:p-1.5 flex flex-col justify-between overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="w-10 sm:w-12 h-1 bg-stone-700 rounded-full mx-auto" />
                
                {/* Phone Screen Display */}
                <div className="w-full flex-1 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-1.5 flex flex-col justify-between relative overflow-hidden">
                  <div className="text-[8px] sm:text-[9px] font-bold text-center text-white/90 pt-0.5">
                    Scan Medicine
                  </div>

                  {/* Camera Viewfinder with Pill Blister Graphic */}
                  <div className="relative flex-1 my-1 rounded-lg border border-cyan-400/50 bg-black/40 flex items-center justify-center overflow-hidden">
                    {/* Viewfinder Corners */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                    
                    {/* Pill Blister Graphic Inside Scanner */}
                    <div className="w-12 sm:w-16 h-8 sm:h-10 rounded bg-white/20 backdrop-blur-xs border border-white/40 p-0.5 grid grid-cols-3 gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-full bg-cyan-300 shadow-xs" />
                      ))}
                    </div>
                  </div>

                  {/* Shutter Button */}
                  <div className="flex justify-center pb-0.5">
                    <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-cyan-500 border border-white shadow-xs flex items-center justify-center">
                      <Camera className="w-2.5 sm:w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Items: Stacked Medical Textbooks & Clipboard */}
            <div className="flex items-end gap-2">
              {/* Stacked Hardcover Books */}
              <div className="flex flex-col items-center shadow-lg rounded-sm overflow-hidden">
                {/* Book 1 (Top): Pharmacology */}
                <div className="w-28 sm:w-36 h-4 sm:h-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-amber-200 text-[7px] sm:text-[8px] font-bold font-mono tracking-wider flex items-center justify-center px-1 border-b border-emerald-950 shadow-xs">
                  PHARMACOLOGY
                </div>
                {/* Book 2 (Middle): Therapeutics */}
                <div className="w-30 sm:w-40 h-4 sm:h-5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white text-[7px] sm:text-[8px] font-bold font-mono tracking-wider flex items-center justify-center px-1 border-b border-emerald-900 shadow-xs">
                  THERAPEUTICS
                </div>
                {/* Book 3 (Bottom): Clinical Medicine */}
                <div className="w-32 sm:w-44 h-5 sm:h-6 bg-gradient-to-r from-blue-900 via-sky-800 to-blue-950 text-white text-[8px] sm:text-[9px] font-bold font-mono tracking-wider flex items-center justify-center px-1 shadow-md">
                  CLINICAL MEDICINE
                </div>
              </div>

              {/* Blue Clipboard with Cross Emblem */}
              <div className="w-10 sm:w-14 h-14 sm:h-20 rounded-t-md bg-sky-700 border-2 border-sky-800 shadow-md p-1 hidden sm:flex flex-col items-center">
                {/* Silver Clip */}
                <div className="w-6 h-2 bg-stone-300 rounded-t-xs -mt-2 border border-stone-400" />
                {/* White Patient Paper */}
                <div className="w-full flex-1 bg-white rounded-xs p-1 flex flex-col items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-700 flex items-center justify-center text-white">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
