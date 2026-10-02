import React, { useState } from 'react';
import { X, CheckCircle, Clock, CreditCard, Banknote, Landmark, Wallet, AlertCircle } from 'lucide-react';
import { MedicalBill, BillPayment } from '../../types.ts';
import { round2, formatCurrency } from '../../services/medicalStoreService.ts';

interface PaymentModalProps {
  isOpen: boolean;
  bill: MedicalBill | null;
  currencySymbol: string;
  onClose: () => void;
  onAddPayment: (billId: string, payment: Omit<BillPayment, 'id'>) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  bill,
  currencySymbol,
  onClose,
  onAddPayment
}) => {
  if (!isOpen || !bill) return null;

  const [amount, setAmount] = useState<string>(String(bill.remainingDue > 0 ? bill.remainingDue : ''));
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Online / Bank' | 'Wallet' | 'Other'>('Cash');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid payment amount greater than zero.');
      return;
    }
    if (num > bill.remainingDue + 0.01) {
      setError(`Payment cannot exceed the remaining due of ${formatCurrency(bill.remainingDue, currencySymbol)}.`);
      return;
    }

    onAddPayment(bill.id, {
      paymentDate: new Date().toISOString(),
      amount: round2(num),
      paymentMethod,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FBF8F2] border border-[#D9CFB8] text-[#1a2e2b] w-full max-w-lg rounded-xs shadow-2xl p-6 relative my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9CFB8]">
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900">Record Payment</h3>
            <p className="text-xs text-stone-500">Bill/Token: <span className="font-mono font-bold text-stone-900">{bill.billTokenNumber}</span> • {bill.customerName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Summary */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-white border border-[#D9CFB8] rounded-xs text-center">
          <div>
            <div className="text-[11px] text-stone-500">Grand Total</div>
            <div className="text-sm font-bold text-stone-900">{formatCurrency(bill.grandTotal, currencySymbol)}</div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500">Total Received</div>
            <div className="text-sm font-bold text-emerald-700">{formatCurrency(bill.totalReceived, currencySymbol)}</div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500">Remaining Due</div>
            <div className="text-sm font-bold text-amber-700">{formatCurrency(bill.remainingDue, currencySymbol)}</div>
          </div>
        </div>

        {/* Previous Payment History */}
        {bill.paymentHistory && bill.paymentHistory.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B08D57]" />
              Payment History ({bill.paymentHistory.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto bg-white p-2 border border-[#D9CFB8] rounded-xs text-xs">
              {bill.paymentHistory.map((p, idx) => (
                <div key={p.id || idx} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                  <div>
                    <span className="font-semibold text-emerald-800">+{formatCurrency(p.amount, currencySymbol)}</span>
                    <span className="text-stone-400 text-[11px] ml-1.5">({p.paymentMethod})</span>
                    {p.notes && <p className="text-[10px] text-stone-500 mt-0.5">{p.notes}</p>}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {new Date(p.paymentDate).toLocaleDateString()} {new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Payment Amount ({currencySymbol}) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={bill.remainingDue}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                className="w-full px-3 py-2 bg-white border border-[#D9CFB8] rounded-xs text-sm font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(String(bill.remainingDue))}
                className="absolute right-2 top-2 text-[10px] font-bold px-2 py-0.5 bg-[#EDF1EA] text-stone-900 rounded-xs hover:bg-[#D9CFB8] transition"
              >
                Full Due
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {(['Cash', 'Card', 'Online / Bank', 'Wallet'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 px-2 rounded-xs border text-center transition ${
                    paymentMethod === method
                      ? 'border-amber-500 bg-stone-900 text-[#FBF8F2] font-semibold'
                      : 'border-[#D9CFB8] bg-white text-stone-700 hover:bg-[#EDF1EA]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Reference (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid at counter / JazzCash / Bank transfer ref"
              className="w-full px-3 py-1.5 bg-white border border-[#D9CFB8] rounded-xs text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D9CFB8] text-xs font-semibold rounded-xs hover:bg-[#EDF1EA] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs hover:bg-stone-900/90 transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
