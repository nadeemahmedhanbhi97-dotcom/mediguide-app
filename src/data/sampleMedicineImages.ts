/**
 * Pre-rendered SVG Data URIs representing medicine packages for quick testing of Camera / OCR.
 * Enables deterministic testing across browsers, iFrames, and headless environments.
 */

function createMedicinePackageSvg(title: string, subtitle: string, strength: string, color: string, isBlurry: boolean = false): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
      </linearGradient>
      ${isBlurry ? '<filter id="blurFilter"><feGaussianBlur stdDeviation="8" /></filter>' : ''}
    </defs>
    <rect width="640" height="420" fill="#0f172a" />
    <g ${isBlurry ? 'filter="url(#blurFilter)"' : ''}>
      <!-- Package box -->
      <rect x="70" y="40" width="500" height="340" rx="16" fill="url(#grad)" stroke="#cbd5e1" stroke-width="4"/>
      <!-- Top banner strip -->
      <rect x="70" y="40" width="500" height="70" rx="16" fill="${color}" />
      <rect x="70" y="80" width="500" height="30" fill="${color}" />
      <text x="95" y="85" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="1">PHARMACEUTICAL SPECIMEN</text>
      <!-- Medicine Name -->
      <text x="95" y="170" font-family="Arial, sans-serif" font-size="44" font-weight="900" fill="#0f172a">${title}</text>
      <!-- Strength -->
      <rect x="95" y="190" width="160" height="40" rx="8" fill="${color}" fill-opacity="0.15" />
      <text x="110" y="218" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${color}">${strength}</text>
      <!-- Subtitle / Active Ingredient -->
      <text x="95" y="265" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#334155">${subtitle}</text>
      <text x="95" y="295" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Oral Administration • 20 Film-Coated Tablets • Rx Only</text>
      <text x="95" y="325" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">Mfg Lic. No. 000412 • Batch: MG-2026-X • Reg: DRAP-PK-88910</text>
      <!-- Barcode simulation -->
      <rect x="420" y="270" width="120" height="45" fill="#e2e8f0" rx="4"/>
      <line x1="430" y1="275" x2="430" y2="305" stroke="#0f172a" stroke-width="3"/>
      <line x1="438" y1="275" x2="438" y2="305" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="446" y1="275" x2="446" y2="305" stroke="#0f172a" stroke-width="4"/>
      <line x1="456" y1="275" x2="456" y2="305" stroke="#0f172a" stroke-width="2"/>
      <line x1="466" y1="275" x2="466" y2="305" stroke="#0f172a" stroke-width="3.5"/>
      <line x1="478" y1="275" x2="478" y2="305" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="488" y1="275" x2="488" y2="305" stroke="#0f172a" stroke-width="4"/>
      <line x1="500" y1="275" x2="500" y2="305" stroke="#0f172a" stroke-width="2"/>
      <line x1="512" y1="275" x2="512" y2="305" stroke="#0f172a" stroke-width="3"/>
      <line x1="524" y1="275" x2="524" y2="305" stroke="#0f172a" stroke-width="2"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface SampleMedicinePackage {
  id: string;
  name: string;
  subtitle: string;
  dataUrl: string;
  isUncertainTest?: boolean;
}

export const SAMPLE_MEDICINE_PACKAGES: SampleMedicinePackage[] = [
  {
    id: 'panadol',
    name: 'Panadol 500mg',
    subtitle: 'Paracetamol 500mg • Analgesic',
    dataUrl: createMedicinePackageSvg('Panadol', 'Paracetamol (Acetaminophen)', '500 mg', '#0284c7')
  },
  {
    id: 'augmentin',
    name: 'Augmentin 625mg',
    subtitle: 'Amoxicillin / Clavulanate • Antibiotic',
    dataUrl: createMedicinePackageSvg('Augmentin', 'Amoxicillin + Clavulanic Acid', '625 mg', '#059669')
  },
  {
    id: 'glucophage',
    name: 'Glucophage 500mg',
    subtitle: 'Metformin HCl • Antidiabetic',
    dataUrl: createMedicinePackageSvg('Glucophage', 'Metformin Hydrochloride', '500 mg', '#7c3aed')
  },
  {
    id: 'brufen',
    name: 'Brufen 400mg',
    subtitle: 'Ibuprofen • NSAID Anti-inflammatory',
    dataUrl: createMedicinePackageSvg('Brufen', 'Ibuprofen USP', '400 mg', '#ea580c')
  },
  {
    id: 'blurry-sample',
    name: 'Blurry / Unclear Pack',
    subtitle: 'Demonstrates safety uncertainty alert',
    dataUrl: createMedicinePackageSvg('Blurry Meds', 'Illegible Active Compound', '?? mg', '#64748b', true),
    isUncertainTest: true
  }
];
