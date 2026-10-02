import React from 'react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#B08D57]/20 via-[#1E293B]/30 to-emerald-500/20 rounded-full blur-2xl opacity-70 pointer-events-none" />

      {/* Main SVG Vector Artwork */}
      <svg
        viewBox="0 0 540 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl relative z-10"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bgPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D8BA84" />
            <stop offset="100%" stopColor="#B08D57" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBF8F2" />
            <stop offset="100%" stopColor="#EDF1EA" />
          </linearGradient>

          <linearGradient id="phoneBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9CFB8" />
            <stop offset="50%" stopColor="#B08D57" />
            <stop offset="100%" stopColor="#3A534E" />
          </linearGradient>

          <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2A855" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#B87B2E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C4B0F" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B08D57" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#041816" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. GLOBAL HEALTHCARE GRID & ORBITAL NODES */}
        <g opacity="0.45">
          {/* Orbital rings */}
          <circle cx="270" cy="220" r="190" stroke="#D9CFB8" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <circle cx="270" cy="220" r="140" stroke="#B08D57" strokeWidth="1" strokeDasharray="6 8" opacity="0.5" />
          
          {/* Global network lat/long curves */}
          <ellipse cx="270" cy="220" rx="190" ry="70" stroke="#D9CFB8" strokeWidth="1" opacity="0.3" transform="rotate(-15 270 220)" />
          <ellipse cx="270" cy="220" rx="190" ry="70" stroke="#D9CFB8" strokeWidth="1" opacity="0.3" transform="rotate(25 270 220)" />

          {/* Connected world cities/clinics nodes */}
          <circle cx="110" cy="130" r="4" fill="#B08D57" filter="url(#softGlow)" />
          <line x1="110" y1="130" x2="160" y2="160" stroke="#B08D57" strokeWidth="1" strokeDasharray="3 3" />
          
          <circle cx="430" cy="120" r="5" fill="#10B981" filter="url(#softGlow)" />
          <line x1="430" y1="120" x2="380" y2="150" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />

          <circle cx="450" cy="310" r="4.5" fill="#B08D57" filter="url(#softGlow)" />
          <line x1="450" y1="310" x2="390" y2="280" stroke="#B08D57" strokeWidth="1" strokeDasharray="3 3" />

          <circle cx="90" cy="320" r="4" fill="#10B981" filter="url(#softGlow)" />
          <line x1="90" y1="320" x2="140" y2="290" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* 2. BASE CLINICAL PLATFORM PLATE */}
        <g filter="url(#cardShadow)">
          <rect x="50" y="320" width="440" height="90" rx="8" fill="url(#bgPlateGrad)" stroke="#B08D57" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Subtle reflections */}
          <line x1="52" y1="322" x2="488" y2="322" stroke="#FBF8F2" strokeWidth="1" strokeOpacity="0.25" />
          {/* Medical cross embossed on base plate */}
          <g opacity="0.2" fill="#D9CFB8">
            <rect x="75" y="355" width="20" height="6" rx="1" />
            <rect x="82" y="348" width="6" height="20" rx="1" />
          </g>
          {/* DigiKhata & Billing counter indicator on desk */}
          <rect x="360" y="345" width="110" height="48" rx="4" fill="#0F172A" stroke="#D9CFB8" strokeWidth="0.8" strokeOpacity="0.5" />
          <text x="370" y="362" fill="#B08D57" fontSize="8" fontWeight="bold" fontFamily="monospace">DIGIKHATA LEDGER</text>
          <text x="370" y="375" fill="#EDF1EA" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Sale: BIL-2026</text>
          <circle cx="455" cy="369" r="4" fill="#10B981" />
        </g>

        {/* 3. PATIENT RECORDS CLIPBOARD (LEFT BACK) */}
        <g transform="translate(65, 110) rotate(-6)" filter="url(#cardShadow)">
          {/* Clipboard body */}
          <rect x="0" y="0" width="135" height="185" rx="6" fill="#B08D57" stroke="#7A5D2E" strokeWidth="1.5" />
          {/* White paper */}
          <rect x="8" y="14" width="119" height="162" rx="4" fill="#FBF8F2" />
          {/* Metal clip */}
          <rect x="42" y="-6" width="50" height="16" rx="3" fill="#D9CFB8" stroke="#7A5D2E" strokeWidth="1" />
          <circle cx="67" cy="2" r="3" fill="#7A5D2E" />

          {/* Patient record lines & clinical ECG Pulse */}
          <text x="18" y="32" fill="#1E293B" fontSize="8.5" fontWeight="bold" fontFamily="serif">PATIENT RECORD</text>
          <line x1="18" y1="38" x2="115" y2="38" stroke="#D9CFB8" strokeWidth="1" />

          {/* Vital ECG Pulse Waveform */}
          <path
            d="M 18 58 L 40 58 L 45 48 L 50 68 L 56 42 L 62 65 L 67 58 L 115 58"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Record fields */}
          <rect x="18" y="74" width="97" height="6" rx="2" fill="#EDF1EA" />
          <rect x="18" y="86" width="80" height="6" rx="2" fill="#EDF1EA" />
          <rect x="18" y="98" width="90" height="6" rx="2" fill="#EDF1EA" />

          {/* Verified doctor stamp badge */}
          <circle cx="95" cy="140" r="16" fill="#1E293B" stroke="#B08D57" strokeWidth="1.5" />
          <path d="M 88 140 L 93 145 L 102 135" stroke="#D8BA84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="82" y="163" fill="#1E293B" fontSize="6" fontWeight="bold">VERIFIED</text>
        </g>

        {/* 4. DOCTOR STETHOSCOPE (LOOPING AROUND) */}
        <g filter="url(#cardShadow)">
          {/* Stethoscope rubber tubes (emerald dark teal) */}
          <path
            d="M 120 280 C 130 350, 240 370, 290 320 C 330 280, 390 330, 420 290"
            stroke="#0F172A"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 120 280 C 130 350, 240 370, 290 320 C 330 280, 390 330, 420 290"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Chestpiece / Diaphragm */}
          <circle cx="120" cy="275" r="22" fill="#D9CFB8" stroke="#B08D57" strokeWidth="2.5" />
          <circle cx="120" cy="275" r="16" fill="#FBF8F2" stroke="#7A5D2E" strokeWidth="1" />
          <circle cx="120" cy="275" r="6" fill="#B08D57" />
          
          {/* Metal binaural connection */}
          <path
            d="M 390 280 L 420 240 L 440 250"
            stroke="#D9CFB8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="442" cy="251" r="4" fill="#1E293B" />
        </g>

        {/* 5. SMARTPHONE WITH APP INTERFACE & CAMERA SCANNING (CENTERPIECE) */}
        <g transform="translate(195, 45)" filter="url(#cardShadow)">
          {/* Phone Outer Chassis */}
          <rect x="0" y="0" width="150" height="280" rx="24" fill="#0F172A" stroke="url(#phoneBorderGrad)" strokeWidth="3" />
          
          {/* Screen Glass */}
          <rect x="6" y="8" width="138" height="264" rx="18" fill="url(#screenGrad)" />

          {/* Notch / Speaker Ear */}
          <rect x="45" y="14" width="60" height="10" rx="5" fill="#0F172A" />
          <circle cx="85" cy="19" r="2" fill="#3A534E" />

          {/* App Header */}
          <rect x="14" y="34" width="122" height="24" rx="4" fill="#1E293B" />
          <text x="24" y="49" fill="#FBF8F2" fontSize="9" fontWeight="bold" fontFamily="serif">MediGuide Mobile</text>
          <circle cx="122" cy="46" r="3.5" fill="#10B981" />

          {/* Medicine Search Bar inside Phone */}
          <rect x="14" y="65" width="122" height="22" rx="4" fill="#FFFFFF" stroke="#D9CFB8" strokeWidth="1" />
          <circle cx="25" cy="76" r="4" stroke="#B08D57" strokeWidth="1.5" />
          <line x1="28" y1="79" x2="32" y2="83" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" />
          <text x="36" y="79" fill="#1E293B" fontSize="7.5" fontWeight="bold">Search medicines...</text>

          {/* Camera Scanning Viewfinder Box */}
          <rect x="16" y="96" width="118" height="110" rx="6" fill="#1E293B" fillOpacity="0.06" stroke="#B08D57" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Viewfinder Reticle Corners */}
          <path d="M 22 108 L 22 102 L 28 102" stroke="#B08D57" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 128 108 L 128 102 L 122 102" stroke="#B08D57" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 22 194 L 22 200 L 28 200" stroke="#B08D57" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 128 194 L 128 200 L 122 200" stroke="#B08D57" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pill packaging being scanned inside viewfinder */}
          <rect x="35" y="118" width="80" height="52" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <rect x="35" y="118" width="80" height="14" fill="#1E293B" />
          <text x="42" y="128" fill="#FBF8F2" fontSize="6.5" fontWeight="bold">AMOXICILLIN 500mg</text>
          <text x="42" y="142" fill="#7A5D2E" fontSize="5.5" fontWeight="bold">Active: Trihydrate</text>
          <text x="42" y="152" fill="#10B981" fontSize="5.5" fontWeight="bold">Clinical Verified</text>

          {/* Optical Scanning Laser Line */}
          <line x1="20" y1="145" x2="130" y2="145" stroke="#10B981" strokeWidth="2" filter="url(#softGlow)" />
          <polygon points="20,145 130,145 125,160 25,160" fill="url(#scanBeamGrad)" opacity="0.6" />

          {/* OCR Result Overlay Tag */}
          <rect x="22" y="180" width="106" height="18" rx="4" fill="#1E293B" stroke="#D8BA84" strokeWidth="1" />
          <circle cx="32" cy="189" r="3" fill="#10B981" />
          <text x="39" y="192" fill="#FBF8F2" fontSize="6.5" fontWeight="bold">OCR Match: 99.8% (Verified)</text>

          {/* Bottom Action Bar */}
          <rect x="35" y="220" width="80" height="20" rx="10" fill="#1E293B" />
          <text x="50" y="233" fill="#FBF8F2" fontSize="7.5" fontWeight="bold">Identify Pill</text>

          {/* Home indicator bar */}
          <rect x="52" y="258" width="46" height="4" rx="2" fill="#3A534E" />
        </g>

        {/* 6. MEDICINE BOTTLE (AMBER GLASS PHARMACY JAR) */}
        <g transform="translate(345, 170)" filter="url(#cardShadow)">
          {/* Cap */}
          <rect x="22" y="0" width="46" height="16" rx="3" fill="#FBF8F2" stroke="#D9CFB8" strokeWidth="1.5" />
          <line x1="26" y1="5" x2="64" y2="5" stroke="#D9CFB8" strokeWidth="1" />
          <line x1="26" y1="10" x2="64" y2="10" stroke="#D9CFB8" strokeWidth="1" />

          {/* Bottle Body */}
          <rect x="8" y="16" width="74" height="110" rx="8" fill="url(#bottleGrad)" stroke="#B08D57" strokeWidth="1" />

          {/* Pharmacy Prescription Label */}
          <rect x="14" y="32" width="62" height="78" rx="3" fill="#FBF8F2" stroke="#D9CFB8" strokeWidth="1" />
          
          {/* Label cross */}
          <rect x="20" y="40" width="14" height="4" rx="1" fill="#1E293B" />
          <rect x="25" y="35" width="4" height="14" rx="1" fill="#1E293B" />

          <text x="38" y="44" fill="#1E293B" fontSize="7" fontWeight="bold" fontFamily="serif">Rx ONLY</text>
          <text x="20" y="60" fill="#7A5D2E" fontSize="6" fontWeight="bold">VITAMIN C + ZINC</text>
          
          <rect x="20" y="67" width="48" height="3" rx="1" fill="#D9CFB8" />
          <rect x="20" y="73" width="38" height="3" rx="1" fill="#D9CFB8" />
          <rect x="20" y="79" width="42" height="3" rx="1" fill="#D9CFB8" />

          {/* Barcode representation */}
          <line x1="20" y1="94" x2="20" y2="104" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="24" y1="94" x2="24" y2="104" stroke="#1E293B" strokeWidth="1" />
          <line x1="27" y1="94" x2="27" y2="104" stroke="#1E293B" strokeWidth="2" />
          <line x1="32" y1="94" x2="32" y2="104" stroke="#1E293B" strokeWidth="1" />
          <line x1="36" y1="94" x2="36" y2="104" stroke="#1E293B" strokeWidth="2" />
          <line x1="41" y1="94" x2="41" y2="104" stroke="#1E293B" strokeWidth="1" />
          <line x1="44" y1="94" x2="44" y2="104" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="49" y1="94" x2="49" y2="104" stroke="#1E293B" strokeWidth="2.5" />
        </g>

        {/* 7. BLISTER PACK & SCATTERED TABLETS / CAPSULES */}
        <g transform="translate(390, 260)" filter="url(#cardShadow)">
          {/* Silver foil blister pack */}
          <rect x="0" y="0" width="85" height="55" rx="4" fill="#EDF1EA" stroke="#D9CFB8" strokeWidth="1.2" />
          <g fill="#B08D57" stroke="#7A5D2E" strokeWidth="0.8">
            <ellipse cx="18" cy="18" rx="8" ry="6" />
            <ellipse cx="42" cy="18" rx="8" ry="6" />
            <ellipse cx="66" cy="18" rx="8" ry="6" />
            <ellipse cx="18" cy="38" rx="8" ry="6" />
            <ellipse cx="42" cy="38" rx="8" ry="6" />
            <ellipse cx="66" cy="38" rx="8" ry="6" />
          </g>
        </g>

        {/* Scattered 3D Capsules & Tablets in Foreground */}
        {/* Capsule 1: Teal & Gold */}
        <g transform="translate(180, 345) rotate(25)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="14" height="28" rx="7" fill="#1E293B" />
          <path d="M 0 14 L 14 14 L 14 21 A 7 7 0 0 1 0 21 Z" fill="#B08D57" />
          <line x1="2" y1="4" x2="5" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Capsule 2: White & Emerald */}
        <g transform="translate(325, 355) rotate(-35)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="13" height="26" rx="6.5" fill="#FBF8F2" stroke="#D9CFB8" strokeWidth="0.5" />
          <path d="M 0 13 L 13 13 L 13 19.5 A 6.5 6.5 0 0 1 0 19.5 Z" fill="#10B981" />
          <line x1="2" y1="3" x2="4" y2="10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Round Tablet 1 */}
        <g transform="translate(300, 365)" filter="url(#cardShadow)">
          <circle cx="10" cy="10" r="10" fill="#FBF8F2" stroke="#D9CFB8" strokeWidth="1" />
          <line x1="4" y1="10" x2="16" y2="10" stroke="#B08D57" strokeWidth="1.2" />
        </g>

        {/* Round Tablet 2 */}
        <g transform="translate(155, 360)" filter="url(#cardShadow)">
          <circle cx="8" cy="8" r="8" fill="#EDF1EA" stroke="#D9CFB8" strokeWidth="1" />
          <line x1="3" y1="8" x2="13" y2="8" stroke="#1E293B" strokeWidth="1" />
        </g>

        {/* 8. FLOATING CLINICAL STATUS CHIP (BOTTOM RIGHT) */}
        <g transform="translate(320, 20)" filter="url(#cardShadow)">
          <rect x="0" y="0" width="180" height="42" rx="6" fill="#1E293B" stroke="#B08D57" strokeWidth="1.5" />
          {/* Stethoscope / Shield Icon */}
          <circle cx="22" cy="21" r="12" fill="#B08D57" />
          <path d="M 17 21 L 20 24 L 27 17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="42" y="18" fill="#FBF8F2" fontSize="9" fontWeight="bold" fontFamily="serif">Global Health Cloud</text>
          <text x="42" y="30" fill="#D9CFB8" fontSize="7.5">Medicines • Doctors • Khata</text>
        </g>
      </svg>
    </div>
  );
};
