import React, { useState, useEffect } from 'react';
import {
  X, Plus, Trash2, Camera, Sparkles, FileText, Check, AlertCircle,
  Calculator, User, Phone, Calendar, Hash
} from 'lucide-react';
import { MedicalBill, BillLineItem, MedicalStoreProfile, BillOCRResult } from '../../types.ts';
import { round2, formatCurrency, generateNextBillToken } from '../../services/medicalStoreService.ts';
import { ScanBillModal } from './ScanBillModal.tsx';

interface NewBillModalProps {
  isOpen: boolean;
  profile: MedicalStoreProfile;
  editingBill?: MedicalBill | null;
  onClose: () => void;
  onSaveBill: (bill: MedicalBill) => void;
}

export const NewBillModal: React.FC<NewBillModalProps> = ({
  isOpen,
  profile,
  editingBill,
  onClose,
  onSaveBill
}) => {
  const [tokenNumber, setTokenNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<BillLineItem[]>([]);
  const [paymentReceived, setPaymentReceived] = useState<string>('0');
  const [originalBillImage, setOriginalBillImage] = useState<string | undefined>(undefined);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingBill) {
        setTokenNumber(editingBill.billTokenNumber);
        setCustomerName(editingBill.customerName);
        setCustomerPhone(editingBill.customerPhone || '');
        setDateTime(editingBill.dateTime.slice(0, 16));
        setNotes(editingBill.notes || '');
        setItems(editingBill.items || []);
        setPaymentReceived(String(editingBill.totalReceived));
        setOriginalBillImage(editingBill.originalBillImage);
      } else {
        const nextToken = generateNextBillToken(profile.invoicePrefix || 'BIL-');
        setTokenNumber(nextToken);
        setCustomerName('');
        setCustomerPhone('');
        const now = new Date();
        const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDateTime(localIso);
        setNotes('');
        setItems([
          {
            id: `item_${Date.now()}_1`,
            productName: '',
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            lineTotal: 0
          }
        ]);
        setPaymentReceived('0');
        setOriginalBillImage(undefined);
      }
      setFormError(null);
    }
  }, [isOpen, editingBill, profile]);

  if (!isOpen) return null;

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productName: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        lineTotal: 0
      }
    ]);
  };

  const updateItem = (id: string, field: keyof BillLineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const q = Math.max(0, Number(updated.quantity) || 0);
        const p = Math.max(0, Number(updated.unitPrice) || 0);
        const d = Math.max(0, Number(updated.discount) || 0);
        updated.lineTotal = round2(Math.max(0, q * p - d));
        return updated;
      })
    );
  };

  const removeItemRow = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Calculations
  const calculatedSubtotal = round2(items.reduce((sum, it) => sum + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0));
  const calculatedDiscount = round2(items.reduce((sum, it) => sum + Number(it.discount || 0), 0));
  const grandTotal = round2(items.reduce((sum, it) => sum + Number(it.lineTotal || 0), 0));
  const receivedNum = round2(Math.max(0, parseFloat(paymentReceived) || 0));
  const remainingDue = round2(Math.max(0, grandTotal - receivedNum));

  const handleOCRExtracted = (result: BillOCRResult, imageBase64?: string) => {
    if (imageBase64) setOriginalBillImage(imageBase64);
    if (result.customerName && !customerName) setCustomerName(result.customerName);
    if (result.items && result.items.length > 0) {
      const mapped = result.items.map((it, idx) => {
        const q = Math.max(1, Number(it.quantity) || 1);
        const p = Math.max(0, Number(it.unitPrice) || 0);
        const d = Math.max(0, Number(it.discount) || 0);
        return {
          id: `item_ocr_${Date.now()}_${idx}`,
          productName: it.productName || 'Medicine',
          quantity: q,
          unitPrice: p,
          discount: d,
          lineTotal: round2(Math.max(0, q * p - d))
        };
      });
      setItems(mapped);
    }
    if (result.paymentReceived !== undefined && result.paymentReceived !== null) {
      setPaymentReceived(String(result.paymentReceived));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenNumber.trim()) {
      setFormError('Bill / Token number cannot be empty.');
      return;
    }
    const validItems = items.filter((it) => it.productName.trim().length > 0);
    if (validItems.length === 0) {
      setFormError('Please add at least one product or medicine with a valid name.');
      return;
    }

    const bill: MedicalBill = {
      id: editingBill?.id || `bill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      billTokenNumber: tokenNumber.trim(),
      dateTime: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
      customerName: customerName.trim() || 'Cash Customer',
      customerPhone: customerPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      items: validItems,
      subtotal: calculatedSubtotal,
      totalDiscount: calculatedDiscount,
      grandTotal,
      totalReceived: receivedNum,
      remainingDue,
      status: remainingDue <= 0.01 ? 'Paid' : receivedNum > 0 ? 'Partially Paid' : 'Unpaid / Due',
      paymentHistory: editingBill?.paymentHistory || (receivedNum > 0 ? [
        {
          id: `pay_initial_${Date.now()}`,
          paymentDate: new Date().toISOString(),
          amount: receivedNum,
          paymentMethod: 'Cash',
          notes: 'Counter payment on bill creation'
        }
      ] : []),
      originalBillImage,
      createdAt: editingBill?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveBill(bill);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-[#FBF8F2] border border-[#D9CFB8] text-[#1a2e2b] w-full max-w-4xl rounded-xs shadow-2xl p-6 relative my-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#D9CFB8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-stone-900 text-[#FBF8F2] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  {editingBill ? 'Edit Bill / Token' : 'Create New Bill / Token'}
                </h3>
                <p className="text-xs text-stone-900/70">
                  {profile.storeName} • Auto-calculated digital sales slip & khata ledger
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScanOpen(true)}
                className="px-3 py-1.5 bg-white border border-[#D9CFB8] hover:bg-[#EDF1EA] text-stone-900 text-xs font-semibold rounded-xs transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#B08D57]" />
                Scan / Upload Bill
              </button>
              <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {formError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Bill Header Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 border border-[#D9CFB8] rounded-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#B08D57]" /> Bill / Token Number *
                </label>
                <input
                  type="text"
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#EDF1EA]/50 border border-[#D9CFB8] rounded-xs text-xs font-mono font-bold text-stone-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#B08D57]" /> Customer / Patient Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood / Cash"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D9CFB8] rounded-xs text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#B08D57]" /> Phone / Contact
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0300 1234567"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D9CFB8] rounded-xs text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#B08D57]" /> Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D9CFB8] rounded-xs text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white border border-[#D9CFB8] rounded-xs p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-900">Medicine / Product Line Items</span>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="px-2.5 py-1 bg-[#EDF1EA] text-stone-900 text-[11px] font-bold rounded-xs hover:bg-[#D9CFB8] transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 font-semibold text-[11px]">
                      <th className="py-1.5 px-2">#</th>
                      <th className="py-1.5 px-2">Medicine / Item Name *</th>
                      <th className="py-1.5 px-2 w-20">Qty</th>
                      <th className="py-1.5 px-2 w-28">Unit Price ({profile.currencySymbol})</th>
                      <th className="py-1.5 px-2 w-24">Discount</th>
                      <th className="py-1.5 px-2 w-28 text-right">Line Total</th>
                      <th className="py-1.5 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2 px-2 text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                            placeholder="e.g. Panadol 500mg, Augmentin 625mg"
                            className="w-full px-2 py-1 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                            required
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            className="w-full px-2 py-1 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs text-center focus:outline-none"
                            required
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs text-right focus:outline-none"
                            required
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                            className="w-full px-2 py-1 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs text-right focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-stone-900">
                          {formatCurrency(item.lineTotal, profile.currencySymbol)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(item.id)}
                              className="text-stone-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Payment Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Prescription Notes / Remarks</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Doctor prescription reference, dosage instructions, or customer khata note..."
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D9CFB8] rounded-xs text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="bg-white p-3.5 border border-[#D9CFB8] rounded-xs space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(calculatedSubtotal, profile.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Discount:</span>
                  <span className="font-mono text-emerald-700">-{formatCurrency(calculatedDiscount, profile.currencySymbol)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatCurrency(grandTotal, profile.currencySymbol)}</span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                  <label className="font-bold text-stone-700">Payment Received:</label>
                  <div className="w-36 flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentReceived}
                      onChange={(e) => setPaymentReceived(e.target.value)}
                      className="w-full px-2 py-1 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs font-mono font-bold text-right text-emerald-800 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentReceived(String(grandTotal))}
                      className="text-[10px] font-bold px-1.5 py-1 bg-[#EDF1EA] text-stone-900 rounded-xs hover:bg-[#D9CFB8]"
                    >
                      Full
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-700">Remaining Balance / Due:</span>
                  <span className={`font-mono font-bold text-sm ${remainingDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {formatCurrency(remainingDue, profile.currencySymbol)}
                  </span>
                </div>

                <div className="text-[11px] text-right text-stone-500">
                  Status:{' '}
                  <span className={`font-bold px-2 py-0.5 rounded-xs ${
                    remainingDue <= 0.01
                      ? 'bg-amber-100 text-amber-900'
                      : receivedNum > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {remainingDue <= 0.01 ? 'Paid' : receivedNum > 0 ? 'Partially Paid' : 'Unpaid / Due'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D9CFB8]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#D9CFB8] text-xs font-semibold rounded-xs hover:bg-[#EDF1EA] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs hover:bg-stone-900/90 transition flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                {editingBill ? 'Save Changes' : 'Generate & Save Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ScanBillModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onExtracted={handleOCRExtracted}
      />
    </>
  );
};
