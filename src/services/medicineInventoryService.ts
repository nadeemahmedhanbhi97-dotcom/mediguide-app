import { Medicine } from '../types.ts';
import { SEED_MEDICINES } from '../data/seedMedicines.ts';

export interface InventoryDeductionRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  remainingStock: number;
  timestamp: string;
  reason: string;
  source: 'AI_IDENTIFIER' | 'MANUAL_DISPENSE' | 'BILL_ORDER';
}

export interface MedicineInventoryItem {
  id: string;
  medicineId: string;
  name: string;
  genericName: string;
  brandNames: string[];
  strength: string;
  category: string;
  stockQuantity: number;
  minThreshold: number;
  unitPrice: number;
  locationRack: string;
  batchNumber: string;
  expiryDate: string;
  totalDispensed: number;
  lastDeductedAt?: string;
  updatedAt: string;
}

const INVENTORY_STORAGE_KEY = 'mediguide_store_medicine_inventory';
const DEDUCTIONS_STORAGE_KEY = 'mediguide_store_inventory_deductions';

// Initial seed inventory derived from verified medicines
function generateSeedInventory(): MedicineInventoryItem[] {
  const racks = ['Rack A-01', 'Rack A-02', 'Rack B-03', 'Rack B-04', 'Rack C-01', 'Rack C-02', 'Cold Storage F-1'];

  return SEED_MEDICINES.map((med, idx) => {
    // Generate realistic stock counts between 25 and 180 units
    const baseStock = 40 + ((idx * 17) % 110);
    const rack = racks[idx % racks.length];
    const batch = `BCH-2026-${(1001 + idx).toString()}`;
    const expYear = 2027 + (idx % 2);
    const expMonth = ((idx % 12) + 1).toString().padStart(2, '0');

    // Approximate unit price in PKR/local currency
    let price = 50;
    if (med.category.toLowerCase().includes('antibiotic')) price = 280;
    else if (med.category.toLowerCase().includes('cardio') || med.category.toLowerCase().includes('statin')) price = 320;
    else if (med.category.toLowerCase().includes('diabet')) price = 160;
    else if (med.category.toLowerCase().includes('analgesic')) price = 45;
    else price = 90 + ((idx * 23) % 150);

    return {
      id: `inv-${med.id}`,
      medicineId: med.id,
      name: med.name,
      genericName: med.genericName,
      brandNames: med.brandNames,
      strength: med.strength,
      category: med.category,
      stockQuantity: baseStock,
      minThreshold: 15,
      unitPrice: price,
      locationRack: rack,
      batchNumber: batch,
      expiryDate: `${expYear}-${expMonth}-28`,
      totalDispensed: 10 + (idx % 20),
      updatedAt: new Date().toISOString()
    };
  });
}

/**
 * Get all current medicine inventory records
 */
export function getMedicineInventory(): MedicineInventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed reading inventory from localStorage:', err);
  }

  const seeded = generateSeedInventory();
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

/**
 * Save updated inventory list
 */
export function saveMedicineInventory(items: MedicineInventoryItem[]): void {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('medicine-inventory-updated', { detail: { items } }));
  } catch (err) {
    console.error('Failed saving inventory to localStorage:', err);
  }
}

/**
 * Find inventory record by medicine ID or name
 */
export function getInventoryByMedicine(medicineIdOrName: string): MedicineInventoryItem | undefined {
  const inventory = getMedicineInventory();
  const query = medicineIdOrName.toLowerCase().trim();

  // 1. Direct ID match
  let item = inventory.find((i) => i.medicineId.toLowerCase() === query || i.id.toLowerCase() === query);
  if (item) return item;

  // 2. Name or brand match
  item = inventory.find((i) => {
    return (
      i.name.toLowerCase().includes(query) ||
      i.genericName.toLowerCase().includes(query) ||
      i.brandNames.some((b) => b.toLowerCase().includes(query)) ||
      query.includes(i.name.toLowerCase()) ||
      query.includes(i.genericName.toLowerCase())
    );
  });

  return item;
}

/**
 * Deduct stock automatically from store inventory
 */
export function deductMedicineStock(
  medicineIdOrName: string,
  quantityToDeduct: number = 1,
  reason: string = 'Auto-Deduct (Customer Order / Dispense)',
  source: 'AI_IDENTIFIER' | 'MANUAL_DISPENSE' | 'BILL_ORDER' = 'AI_IDENTIFIER'
): { success: boolean; updatedItem?: MedicineInventoryItem; error?: string } {
  if (quantityToDeduct <= 0) {
    return { success: false, error: 'Quantity must be greater than zero.' };
  }

  const inventory = getMedicineInventory();
  const query = medicineIdOrName.toLowerCase().trim();

  // Find target item
  const itemIndex = inventory.findIndex((i) => {
    return (
      i.medicineId.toLowerCase() === query ||
      i.id.toLowerCase() === query ||
      i.name.toLowerCase().includes(query) ||
      i.genericName.toLowerCase().includes(query) ||
      i.brandNames.some((b) => b.toLowerCase().includes(query)) ||
      query.includes(i.name.toLowerCase())
    );
  });

  if (itemIndex === -1) {
    return {
      success: false,
      error: `Medicine "${medicineIdOrName}" is not registered in the medical store inventory.`
    };
  }

  const item = inventory[itemIndex];

  if (item.stockQuantity < quantityToDeduct) {
    return {
      success: false,
      error: `Insufficient stock! Only ${item.stockQuantity} units available (requested ${quantityToDeduct}).`
    };
  }

  // Deduct stock
  const newStock = item.stockQuantity - quantityToDeduct;
  const now = new Date().toISOString();

  const updatedItem: MedicineInventoryItem = {
    ...item,
    stockQuantity: newStock,
    totalDispensed: (item.totalDispensed || 0) + quantityToDeduct,
    lastDeductedAt: now,
    updatedAt: now
  };

  inventory[itemIndex] = updatedItem;
  saveMedicineInventory(inventory);

  // Save transaction history log
  const record: InventoryDeductionRecord = {
    id: `deduct-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    medicineId: updatedItem.medicineId,
    medicineName: updatedItem.name,
    quantity: quantityToDeduct,
    remainingStock: newStock,
    timestamp: now,
    reason,
    source
  };

  saveDeductionLog(record);

  return { success: true, updatedItem };
}

/**
 * Restock / Add quantity to an inventory item
 */
export function restockMedicineStock(
  medicineIdOrName: string,
  quantityToAdd: number
): { success: boolean; updatedItem?: MedicineInventoryItem; error?: string } {
  if (quantityToAdd <= 0) {
    return { success: false, error: 'Restock quantity must be positive.' };
  }

  const inventory = getMedicineInventory();
  const query = medicineIdOrName.toLowerCase().trim();

  const itemIndex = inventory.findIndex((i) => {
    return (
      i.medicineId.toLowerCase() === query ||
      i.id.toLowerCase() === query ||
      i.name.toLowerCase().includes(query) ||
      i.genericName.toLowerCase().includes(query) ||
      i.brandNames.some((b) => b.toLowerCase().includes(query))
    );
  });

  if (itemIndex === -1) {
    return { success: false, error: `Medicine not found in inventory.` };
  }

  const item = inventory[itemIndex];
  const newStock = item.stockQuantity + quantityToAdd;
  const now = new Date().toISOString();

  const updatedItem: MedicineInventoryItem = {
    ...item,
    stockQuantity: newStock,
    updatedAt: now
  };

  inventory[itemIndex] = updatedItem;
  saveMedicineInventory(inventory);

  return { success: true, updatedItem };
}

/**
 * Get recent deduction history log
 */
export function getDeductionLogs(): InventoryDeductionRecord[] {
  try {
    const raw = localStorage.getItem(DEDUCTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed reading deduction logs:', err);
  }
  return [];
}

/**
 * Save new deduction log record
 */
function saveDeductionLog(record: InventoryDeductionRecord): void {
  try {
    const logs = getDeductionLogs();
    logs.unshift(record);
    // Keep last 50 transactions
    const trimmed = logs.slice(0, 50);
    localStorage.setItem(DEDUCTIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed saving deduction log:', err);
  }
}
