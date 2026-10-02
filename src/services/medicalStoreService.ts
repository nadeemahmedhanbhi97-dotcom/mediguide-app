import {
  MedicalStoreProfile,
  MedicalBill,
  BillPayment,
  StoreCustomer,
  StoreExpense,
  PaymentStatus,
  BillLineItem
} from '../types.ts';

const STORE_PROFILE_KEY = 'mediguide_store_profile';
const STORE_BILLS_KEY = 'mediguide_store_bills';
const STORE_CUSTOMERS_KEY = 'mediguide_store_customers';
const STORE_EXPENSES_KEY = 'mediguide_store_expenses';
const STORE_TOKEN_COUNTER_KEY = 'mediguide_store_token_counter';

// Safe 2-decimal rounding to prevent floating-point display errors
export function round2(num: number): number {
  return Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount: number, symbol: string = 'Rs'): string {
  const rounded = round2(amount);
  return `${symbol} ${rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const DEFAULT_PROFILE: MedicalStoreProfile = {
  id: 'store_primary',
  storeName: 'Al-Hakeem Medical Store & Pharmacy',
  ownerName: 'M. Usman',
  phone: '+92 300 8765432',
  address: 'Shop # 14, Commercial Avenue, Near City Hospital',
  country: 'Pakistan',
  city: 'Lahore',
  area: 'Gulberg III',
  storeCategory: 'Community Medical Store',
  businessHours: '09:00 AM – 11:30 PM (Daily)',
  currency: 'PKR',
  currencySymbol: 'Rs',
  invoicePrefix: 'BIL-',
  notes: 'Quality medicines guaranteed. Computerized billing & DigiKhata system.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const SEED_BILLS: MedicalBill[] = [
  {
    id: 'bill_seed_1',
    billTokenNumber: 'BIL-2026-0001',
    dateTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    customerName: 'Muhammad Tariq',
    customerPhone: '+92 321 4455667',
    notes: 'Prescription by Dr. Arshad (Cardiologist)',
    items: [
      { id: 'item_1', productName: 'Panadol CF Tablet 500mg', quantity: 2, unitPrice: 45, discount: 0, lineTotal: 90 },
      { id: 'item_2', productName: 'Augmentin 625mg Tablets', quantity: 1, unitPrice: 280, discount: 10, lineTotal: 270 },
      { id: 'item_3', productName: 'Sancos Cough Syrup 120ml', quantity: 1, unitPrice: 160, discount: 0, lineTotal: 160 }
    ],
    subtotal: 530,
    totalDiscount: 10,
    grandTotal: 520,
    totalReceived: 520,
    remainingDue: 0,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'pay_1',
        paymentDate: new Date(Date.now() - 3600000 * 2).toISOString(),
        amount: 520,
        paymentMethod: 'Cash',
        notes: 'Full payment received at counter'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'bill_seed_2',
    billTokenNumber: 'BIL-2026-0002',
    dateTime: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    customerName: 'Haji Abdul Rehman',
    customerPhone: '+92 300 9876543',
    notes: 'Regular customer - Khata account',
    items: [
      { id: 'item_4', productName: 'Glucophage 500mg Tablet (Metformin)', quantity: 3, unitPrice: 120, discount: 10, lineTotal: 350 },
      { id: 'item_5', productName: 'Lopressor 50mg (Metoprolol)', quantity: 2, unitPrice: 180, discount: 10, lineTotal: 350 },
      { id: 'item_6', productName: 'Ascard 75mg Tablet (Aspirin)', quantity: 1, unitPrice: 90, discount: 0, lineTotal: 90 }
    ],
    subtotal: 810,
    totalDiscount: 20,
    grandTotal: 790,
    totalReceived: 400,
    remainingDue: 390,
    status: 'Partially Paid',
    paymentHistory: [
      {
        id: 'pay_2',
        paymentDate: new Date(Date.now() - 3600000 * 6).toISOString(),
        amount: 400,
        paymentMethod: 'Cash',
        notes: 'Paid 400 at counter. Promised remaining 390 tomorrow.'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'bill_seed_3',
    billTokenNumber: 'BIL-2026-0003',
    dateTime: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    customerName: 'Chaudhry Nadeem',
    customerPhone: '+92 333 1122334',
    notes: 'Local neighbor emergency medicine',
    items: [
      { id: 'item_7', productName: 'Nexum 40mg Capsule (Esomeprazole)', quantity: 2, unitPrice: 420, discount: 20, lineTotal: 820 },
      { id: 'item_8', productName: 'Gravinate Injection', quantity: 2, unitPrice: 65, discount: 0, lineTotal: 130 }
    ],
    subtotal: 970,
    totalDiscount: 20,
    grandTotal: 950,
    totalReceived: 0,
    remainingDue: 950,
    status: 'Unpaid / Due',
    paymentHistory: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const SEED_EXPENSES: StoreExpense[] = [
  {
    id: 'exp_1',
    title: 'Monthly Store Rent',
    category: 'Rent',
    amount: 35000,
    date: new Date().toISOString().slice(0, 10),
    notes: 'Commercial shop rent paid to landlord',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp_2',
    title: 'Electricity & Inverter Bill',
    category: 'Utilities',
    amount: 8450,
    date: new Date().toISOString().slice(0, 10),
    notes: 'LESCO commercial meter bill',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp_3',
    title: 'Medicine Distribution Supply',
    category: 'Inventory / Wholesale',
    amount: 45000,
    date: new Date().toISOString().slice(0, 10),
    notes: 'Weekly stock replenishment from Premier Distributors',
    createdAt: new Date().toISOString()
  }
];

// Profile
export function getStoreProfile(): MedicalStoreProfile {
  try {
    const raw = localStorage.getItem(STORE_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading store profile:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveStoreProfile(profile: MedicalStoreProfile): void {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(STORE_PROFILE_KEY, JSON.stringify(profile));
}

// Token Number Generator (Guaranteed Unique)
export function generateNextBillToken(prefix: string = 'BIL-'): string {
  const currentYear = new Date().getFullYear();
  let counter = 1;
  try {
    const saved = localStorage.getItem(STORE_TOKEN_COUNTER_KEY);
    if (saved) {
      counter = parseInt(saved, 10) + 1;
    } else {
      // Find highest existing token number from bills
      const existingBills = getBills();
      if (existingBills.length > 0) {
        counter = existingBills.length + 1;
      }
    }
  } catch {
    counter = Date.now() % 10000;
  }

  // Ensure no collision with any saved bill
  const bills = getBills();
  let candidate = '';
  let tries = 0;
  while (tries < 50) {
    const padded = String(counter).padStart(4, '0');
    candidate = `${prefix}${currentYear}-${padded}`;
    const collision = bills.some((b) => b.billTokenNumber.toLowerCase() === candidate.toLowerCase());
    if (!collision) break;
    counter++;
    tries++;
  }

  localStorage.setItem(STORE_TOKEN_COUNTER_KEY, String(counter));
  return candidate;
}

// Bills
export function getBills(): MedicalBill[] {
  try {
    const raw = localStorage.getItem(STORE_BILLS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // First time setup - seed default records
    localStorage.setItem(STORE_BILLS_KEY, JSON.stringify(SEED_BILLS));
    recalculateCustomerRecords(SEED_BILLS);
    return SEED_BILLS;
  } catch (e) {
    console.warn('Error reading bills:', e);
    return SEED_BILLS;
  }
}

export function saveBill(bill: MedicalBill): MedicalBill {
  const bills = getBills();
  const existingIdx = bills.findIndex((b) => b.id === bill.id);

  // Precision re-calculation
  const calculatedSubtotal = round2(bill.items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0));
  const calculatedDiscount = round2(bill.items.reduce((acc, it) => acc + (it.discount || 0), 0));
  const calculatedGrandTotal = round2(bill.items.reduce((acc, it) => acc + it.lineTotal, 0));
  
  // Re-sum total payments from history
  const sumPayments = round2(
    (bill.paymentHistory || []).reduce((acc, p) => acc + Number(p.amount || 0), 0)
  );
  
  const totalReceived = round2(Math.max(bill.totalReceived, sumPayments));
  const remainingDue = round2(Math.max(0, calculatedGrandTotal - totalReceived));

  let status: PaymentStatus = 'Unpaid / Due';
  if (remainingDue <= 0.01) {
    status = 'Paid';
  } else if (totalReceived > 0) {
    status = 'Partially Paid';
  } else {
    status = 'Unpaid / Due';
  }

  const updatedBill: MedicalBill = {
    ...bill,
    subtotal: calculatedSubtotal,
    totalDiscount: calculatedDiscount,
    grandTotal: calculatedGrandTotal,
    totalReceived,
    remainingDue,
    status,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    bills[existingIdx] = updatedBill;
  } else {
    bills.unshift(updatedBill);
  }

  localStorage.setItem(STORE_BILLS_KEY, JSON.stringify(bills));
  recalculateCustomerRecords(bills);
  return updatedBill;
}

export function addPaymentToBill(
  billId: string,
  payment: Omit<BillPayment, 'id'>
): MedicalBill | null {
  const bills = getBills();
  const bill = bills.find((b) => b.id === billId);
  if (!bill) return null;

  const newPayment: BillPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    paymentDate: payment.paymentDate || new Date().toISOString(),
    amount: round2(payment.amount),
    paymentMethod: payment.paymentMethod || 'Cash',
    notes: payment.notes || ''
  };

  bill.paymentHistory = [...(bill.paymentHistory || []), newPayment];
  const newTotalReceived = round2(
    bill.paymentHistory.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  );
  bill.totalReceived = newTotalReceived;
  bill.remainingDue = round2(Math.max(0, bill.grandTotal - newTotalReceived));

  if (bill.remainingDue <= 0.01) {
    bill.status = 'Paid';
    bill.remainingDue = 0;
  } else if (newTotalReceived > 0) {
    bill.status = 'Partially Paid';
  } else {
    bill.status = 'Unpaid / Due';
  }

  bill.updatedAt = new Date().toISOString();
  saveBill(bill);
  return bill;
}

export function deleteBill(billId: string): void {
  const bills = getBills().filter((b) => b.id !== billId);
  localStorage.setItem(STORE_BILLS_KEY, JSON.stringify(bills));
  recalculateCustomerRecords(bills);
}

// Customers & DigiKhata
export function getCustomers(): StoreCustomer[] {
  try {
    const raw = localStorage.getItem(STORE_CUSTOMERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading customers:', e);
  }
  return recalculateCustomerRecords(getBills());
}

export function recalculateCustomerRecords(bills: MedicalBill[]): StoreCustomer[] {
  const customerMap: Record<string, StoreCustomer> = {};

  bills.forEach((bill) => {
    const normName = (bill.customerName || 'Cash Customer').trim();
    const key = `${normName.toLowerCase()}_${(bill.customerPhone || '').replace(/\D/g, '')}`;

    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust_${key.replace(/[^a-z0-9]/g, '_')}`,
        name: normName,
        phone: bill.customerPhone || '',
        notes: '',
        totalPurchases: 0,
        totalPayments: 0,
        outstandingBalance: 0,
        billsCount: 0,
        firstVisitDate: bill.dateTime,
        lastVisitDate: bill.dateTime,
        createdAt: bill.createdAt || bill.dateTime,
        updatedAt: bill.updatedAt || bill.dateTime
      };
    }

    const c = customerMap[key];
    c.billsCount += 1;
    c.totalPurchases = round2(c.totalPurchases + bill.grandTotal);
    c.totalPayments = round2(c.totalPayments + bill.totalReceived);
    c.outstandingBalance = round2(c.outstandingBalance + bill.remainingDue);

    if (new Date(bill.dateTime) > new Date(c.lastVisitDate)) {
      c.lastVisitDate = bill.dateTime;
    }
    if (new Date(bill.dateTime) < new Date(c.firstVisitDate)) {
      c.firstVisitDate = bill.dateTime;
    }
  });

  const list = Object.values(customerMap).sort((a, b) => b.outstandingBalance - a.outstandingBalance);
  localStorage.setItem(STORE_CUSTOMERS_KEY, JSON.stringify(list));
  return list;
}

export function getCustomerBills(customerName: string, customerPhone?: string): MedicalBill[] {
  const bills = getBills();
  const targetName = customerName.trim().toLowerCase();
  const targetPhone = customerPhone ? customerPhone.replace(/\D/g, '') : '';

  return bills.filter((b) => {
    const bName = (b.customerName || '').trim().toLowerCase();
    const bPhone = b.customerPhone ? b.customerPhone.replace(/\D/g, '') : '';
    if (targetPhone && bPhone && targetPhone === bPhone) return true;
    return bName === targetName;
  });
}

// Expenses
export function getExpenses(): StoreExpense[] {
  try {
    const raw = localStorage.getItem(STORE_EXPENSES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORE_EXPENSES_KEY, JSON.stringify(SEED_EXPENSES));
    return SEED_EXPENSES;
  } catch (e) {
    console.warn('Error reading expenses:', e);
    return SEED_EXPENSES;
  }
}

export function saveExpense(expense: StoreExpense): void {
  const expenses = getExpenses();
  const idx = expenses.findIndex((e) => e.id === expense.id);
  if (idx >= 0) {
    expenses[idx] = expense;
  } else {
    expenses.unshift(expense);
  }
  localStorage.setItem(STORE_EXPENSES_KEY, JSON.stringify(expenses));
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses().filter((e) => e.id !== id);
  localStorage.setItem(STORE_EXPENSES_KEY, JSON.stringify(expenses));
}

// Backup & Restore
export function exportAllStoreData(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile: getStoreProfile(),
    bills: getBills(),
    customers: getCustomers(),
    expenses: getExpenses()
  };
  return JSON.stringify(data, null, 2);
}

export function importStoreData(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.profile && !parsed.bills) {
      return { success: false, message: 'Invalid backup file structure.' };
    }
    if (parsed.profile) saveStoreProfile(parsed.profile);
    if (Array.isArray(parsed.bills)) {
      localStorage.setItem(STORE_BILLS_KEY, JSON.stringify(parsed.bills));
      recalculateCustomerRecords(parsed.bills);
    }
    if (Array.isArray(parsed.expenses)) {
      localStorage.setItem(STORE_EXPENSES_KEY, JSON.stringify(parsed.expenses));
    }
    return { success: true, message: 'All store records successfully restored!' };
  } catch (err: any) {
    return { success: false, message: `Failed to restore data: ${err.message}` };
  }
}
