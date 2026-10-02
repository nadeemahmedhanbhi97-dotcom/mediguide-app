export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  ingredients: string[];
  category: string; // e.g. "Analgesic & Antipyretic", "Antibiotic", "Cardiovascular", etc.
  strength: string; // e.g. "500 mg", "1 g", "20 mg"
  form: string; // e.g. "Tablet", "Syrup", "Injection", "Capsule", "Inhaler"
  manufacturer: string;
  uses: string[];
  sideEffects: string[];
  seriousWarnings: string[];
  interactions: string[];
  dosage: string;
  contraindications: string[];
  pregnancySafety?: string;
  storage?: string;
  verificationStatus: 'VERIFIED_PHARMA_REF' | 'CLINICAL_MONOGRAPH' | 'COMMUNITY_REF';
  lastReviewed: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  country: string;
  stateProvince?: string;
  city: string;
  area?: string;
  address: string;
  clinicOrHospital: string;
  phone: string;
  email?: string;
  consultationFee: string;
  availableDays: string[];
  rating: number;
  reviewsCount: number;
  isDemo: boolean;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  providerId?: string;
  website?: string;
  source?: string;
  sourceName?: string;
  sourceUrl?: string;
  verificationStatus?: 'VERIFIED_OFFICIAL_PROVIDER' | 'DEMO_UNVERIFIED' | 'GOVERNMENT_REGISTRY';
  lastUpdated?: string;
  dataLicense?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  address: string;
  category: 'Community Retail Pharmacy' | '24/7 Hospital Pharmacy' | 'Compounding & Specialty' | 'Wholesale & Distribution';
  openingHours: string;
  is24Hours: boolean;
  latitude: number;
  longitude: number;
  isDemo: boolean;
  distanceKm?: number;
  medicineAvailabilityNotice?: string;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  dob?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone: string;
  email?: string;
  bloodGroup?: string;
  allergies: string;
  currentMedications: string;
  medicalNotes: string;
  emergencyContact?: string;
  photoUrl?: string; // base64 or object URL
  createdAt: string;
  updatedAt: string;
}

export interface DoctorVisit {
  id: string;
  userId: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName: string;
  specialty?: string;
  date: string;
  time?: string;
  clinicOrHospital?: string;
  reason: string;
  diagnosisNotes?: string;
  prescriptions?: string;
  followUpDate?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface MedicationReminder {
  id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  time: string; // "08:00"
  frequency: 'Once Daily' | 'Twice Daily' | 'Thrice Daily' | 'Every 4 Hours' | 'As Needed';
  instructions?: string;
  active: boolean;
  takenDates: string[]; // ISO date strings
}

export interface HealthTopic {
  id: string;
  title: string;
  urduTitle?: string;
  category: string;
  overview: string;
  symptoms: string[];
  prevention: string[];
  whenToSeeDoctor: string[];
  emergencySigns: string[];
}

export interface FormulaItem {
  id: string;
  name: string;
  chemicalFormula: string;
  category: string;
  molecularWeight?: string;
  description: string;
  mechanismOfAction: string;
  commonUses: string[];
  safetyWarnings: string[];
}

export interface OCRResult {
  rawText: string;
  possibleMedicineNames: string[];
  activeIngredients: string[];
  strength?: string;
  dosageForm?: string;
  manufacturer?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  isUncertain: boolean;
  uncertaintyReason?: string;
  matchedMedicines?: Medicine[];
}

// -------------------------------------------------------------
// MEDICAL STORE / BUSINESS KHATA SYSTEM TYPES
// -------------------------------------------------------------

export interface MedicalStoreProfile {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  area: string;
  storeCategory: string; // e.g. "Community Medical Store", "Retail Pharmacy", "Wholesale & Chemist", "Hospital Attached"
  businessHours: string;
  currency: string; // "PKR", "USD", "INR", "EUR", "GBP", "AED", "SAR"
  currencySymbol: string; // "Rs", "$", "₹", "€", "£", "AED", "SAR"
  invoicePrefix: string; // e.g. "BIL-"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillLineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // Discount per item or line discount in currency
  lineTotal: number; // (quantity * unitPrice) - discount
}

export interface BillPayment {
  id: string;
  paymentDate: string; // ISO date-time
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Online / Bank' | 'Wallet' | 'Other';
  notes?: string;
}

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Unpaid / Due';

export interface MedicalBill {
  id: string;
  billTokenNumber: string; // Unique, guaranteed non-duplicate token/bill # (e.g. "BIL-2026-0001")
  dateTime: string; // ISO date-time string
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  items: BillLineItem[];
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  totalReceived: number;
  remainingDue: number;
  status: PaymentStatus;
  paymentHistory: BillPayment[];
  originalBillImage?: string; // Stored base64 photo for OCR / archive
  ocrExtracted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCustomer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalPurchases: number;
  totalPayments: number;
  outstandingBalance: number;
  billsCount: number;
  firstVisitDate: string;
  lastVisitDate: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Utilities'
  | 'Staff Salary'
  | 'Inventory / Wholesale'
  | 'Transportation'
  | 'Maintenance'
  | 'Taxes & Licenses'
  | 'Packaging & Supplies'
  | 'Miscellaneous';

export interface StoreExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface BillOCRResult {
  rawText: string;
  billNumber?: string;
  date?: string;
  customerName?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    lineTotal?: number;
  }>;
  subtotal?: number;
  totalDiscount?: number;
  grandTotal?: number;
  paymentReceived?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  isUncertain: boolean;
  uncertaintyReason?: string;
}

