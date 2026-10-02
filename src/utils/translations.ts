export type Language = 'en' | 'ur';

export interface Translations {
  appName: string;
  appSubtitle: string;
  byUsman: string;
  educationalDisclaimer: string;
  disclaimerShort: string;
  navMedicines: string;
  navPharmacies: string;
  navDoctors: string;
  navPatients: string;
  navFormulas: string;
  navCalculators: string;
  navHealthTopics: string;
  navAdmin: string;
  scanMedicine: string;
  searchMedicinesPlaceholder: string;
  searchDoctorsPlaceholder: string;
  filterAll: string;
  nearMe: string;
  country: string;
  worldwide: string;
  specialty: string;
  clearFilters: string;
  foundResults: string;
  demoDoctorNotice: string;
  cameraAccessDenied: string;
  capturePhoto: string;
  uploadDocument: string;
  uncertaintyWarning: string;
  addPatient: string;
  patientDetails: string;
  saveRecord: string;
  takePatientPhoto: string;
  calculatorsTitle: string;
  formulaTitle: string;
  explainFormula: string;
  languageToggle: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'MediGuide',
    appSubtitle: 'Clinical Pharmacology & Medical Directory',
    byUsman: 'by Usman',
    educationalDisclaimer: 'Educational & Clinical Reference Only. MediGuide does not replace professional medical advice, clinical diagnosis, or a doctor\'s prescription. Always consult a licensed healthcare practitioner or registered pharmacist.',
    disclaimerShort: 'For medical education reference only. Not a diagnostic tool.',
    navMedicines: 'Medicines',
    navPharmacies: 'Medical Store',
    navDoctors: 'Find Doctors',
    navPatients: 'Patient Records',
    navFormulas: 'Formula & AI',
    navCalculators: 'Calculators',
    navHealthTopics: 'Health Guide',
    navAdmin: 'Diagnostics',
    scanMedicine: 'Scan Medicine (Camera / OCR)',
    searchMedicinesPlaceholder: 'Search brand, generic name, ingredient (e.g. Panadol, Metformin, Augmentin)...',
    searchDoctorsPlaceholder: 'Search doctor by name or specialty (e.g. Cardiology, Dr. Ayesha, Pediatrics)...',
    filterAll: 'All',
    nearMe: 'Near Me',
    country: 'Country',
    worldwide: 'Worldwide',
    specialty: 'Specialty',
    clearFilters: 'Clear Filters',
    foundResults: 'results found',
    demoDoctorNotice: 'DEMO DIRECTORY NOTICE: All doctor listings are unverified seed demo records for platform simulation and testing. They do not represent real clinic appointments or endorsed practitioners.',
    cameraAccessDenied: 'Camera permission denied or camera device unavailable. You can still select or upload a medicine package photo or document from your device.',
    capturePhoto: 'Take Photo with Camera',
    uploadDocument: 'Upload Image / Document',
    uncertaintyWarning: 'Identification Uncertain: Text on this medicine package could not be identified with high confidence. For patient safety, never guess medicines. Please verify the box directly with a doctor or pharmacist.',
    addPatient: 'Add Patient Record',
    patientDetails: 'Patient Medical Profile',
    saveRecord: 'Save Patient Record',
    takePatientPhoto: 'Take Patient Photo',
    calculatorsTitle: 'Clinical Calculators & Converters',
    formulaTitle: 'Active Formula Library',
    explainFormula: 'Explain My Formula',
    languageToggle: 'اردو'
  },
  ur: {
    appName: 'میڈی گائیڈ',
    appSubtitle: 'طبی رہنما و ادویات ڈائریکٹری',
    byUsman: 'از عثمان',
    educationalDisclaimer: 'صرف تعلیمی اور طبی معلوماتی حوالہ۔ میڈی گائیڈ ڈاکٹر کے نسخے یا معائنے کا متبادل نہیں ہے۔ ادویات کے استعمال سے قبل مستند معالج یا فارماسسٹ سے مشورہ لیں۔',
    disclaimerShort: 'صرف طبی معلومات کے لیے۔ تشخیصی آلہ نہیں ہے۔',
    navMedicines: 'ادویات',
    navPharmacies: 'میڈیکل اسٹور',
    navDoctors: 'ڈاکٹرز تلاش کریں',
    navPatients: 'مریضوں کا ریکارڈ',
    navFormulas: 'فارمولا اور اے آئی',
    navCalculators: 'کیلکولیٹرز',
    navHealthTopics: 'صحت کی معلومات',
    navAdmin: 'سسٹم اور ٹیسٹنگ',
    scanMedicine: 'دوا اسکین کریں (کیمرہ / او سی آر)',
    searchMedicinesPlaceholder: 'دوا، فارمولا یا برانڈ تلاش کریں (مثلاً پیناڈول، اگمینٹن، میٹفارمن)...',
    searchDoctorsPlaceholder: 'ڈاکٹر کا نام یا شعبہ تلاش کریں (مثلاً کارڈیالوجی، ڈاکٹر عائشہ)...',
    filterAll: 'تمام',
    nearMe: 'میرے قریب',
    country: 'ملک',
    worldwide: 'پوری دنیا (ورلڈ وائڈ)',
    specialty: 'طبی شعبہ / اسپیشلٹی',
    clearFilters: 'فلٹرز ختم کریں',
    foundResults: 'نتائج ملے',
    demoDoctorNotice: 'ڈیمو ڈائریکٹری انتباہ: یہ تمام ریکارڈز صرف آزمائشی / ڈیمو پروفائلز ہیں۔ یہ کسی حقیقی تصدیق شدہ کلینک یا ڈاکٹر کے اصل اپوائنٹمنٹ کی نمائندگی نہیں کرتے۔',
    cameraAccessDenied: 'کیمرہ کی اجازت میسر نہیں یا کیمرہ دستیاب نہیں۔ آپ فائل منتخب کر کے تصویر اپلوڈ کر سکتے ہیں۔',
    capturePhoto: 'کیمرے سے تصویر کھینچیں',
    uploadDocument: 'تصویر یا دستاویز اپلوڈ کریں',
    uncertaintyWarning: 'دوا کی شناخت غیر یقینی ہے: تصویر کا متن مکمل طور پر واضح نہیں۔ مریض کی حفاظت کے لیے قیاس آرائی نہ کریں۔ براہ کرم دوا کے ڈبے کی تصدیق فارماسسٹ یا ڈاکٹر سے کروائیں۔',
    addPatient: 'نیا مریض شامل کریں',
    patientDetails: 'مریض کی تفصیلات',
    saveRecord: 'ریکارڈ محفوظ کریں',
    takePatientPhoto: 'مریض کی تصویر بنائیں',
    calculatorsTitle: 'طبی کیلکولیٹرز اور کنورٹرز',
    formulaTitle: 'فارمولا لائبریری',
    explainFormula: 'میرے فارمولے کی وضاحت کریں',
    languageToggle: 'English'
  }
};
