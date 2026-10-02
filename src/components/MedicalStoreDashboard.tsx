import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText, Camera, Plus, Search, Calendar, DollarSign, Users,
  TrendingUp, CreditCard, ShoppingBag, Settings, Download, Upload,
  Clock, AlertTriangle, CheckCircle, ChevronRight, Eye, Trash2,
  Edit, ArrowUpDown, Filter, Sparkles, AlertCircle, Building2,
  Printer, ArrowUpRight, ArrowDownRight, Tag, HelpCircle, Phone, MapPin, X,
  PackageCheck, Layers, Minus
} from 'lucide-react';
import {
  MedicalBill,
  MedicalStoreProfile,
  StoreCustomer,
  StoreExpense,
  BillPayment,
  PaymentStatus,
  ExpenseCategory
} from '../types.ts';
import {
  getStoreProfile,
  saveStoreProfile,
  getBills,
  saveBill,
  deleteBill,
  addPaymentToBill,
  getCustomers,
  getCustomerBills,
  getExpenses,
  saveExpense,
  deleteExpense,
  exportAllStoreData,
  importStoreData,
  formatCurrency,
  round2
} from '../services/medicalStoreService.ts';
import {
  getMedicineInventory,
  saveMedicineInventory,
  MedicineInventoryItem,
  restockMedicineStock,
  deductMedicineStock
} from '../services/medicineInventoryService.ts';
import { SmartMedicineIdentifier } from './SmartMedicineIdentifier.tsx';
import { NewBillModal } from './medicalStore/NewBillModal.tsx';
import { ScanBillModal } from './medicalStore/ScanBillModal.tsx';
import { PaymentModal } from './medicalStore/PaymentModal.tsx';

export const MedicalStoreDashboard: React.FC = () => {
  // Active sub-view inside Medical Store
  const [activeTab, setActiveTab] = useState<
    'today' | 'bills' | 'khata' | 'customers' | 'expenses' | 'reports' | 'search' | 'inventory' | 'settings'
  >('today');

  // Core Data States
  const [profile, setProfile] = useState<MedicalStoreProfile>(getStoreProfile());
  const [bills, setBills] = useState<MedicalBill[]>([]);
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [expenses, setExpenses] = useState<StoreExpense[]>([]);

  // Modals
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [isScanBillOpen, setIsScanBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<MedicalBill | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<MedicalBill | null>(null);
  const [viewingBillDetail, setViewingBillDetail] = useState<MedicalBill | null>(null);
  const [viewingCustomerDetail, setViewingCustomerDetail] = useState<StoreCustomer | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('ALL');
  const [dateFilterMode, setDateFilterMode] = useState<
    'today' | 'yesterday' | 'this_week' | 'this_month' | 'previous_months' | 'previous_years' | 'custom' | 'all'
  >('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Expense Form State
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCategory, setNewExpCategory] = useState<ExpenseCategory>('Rent');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [newExpNotes, setNewExpNotes] = useState('');

  // Refresh data on mount
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setProfile(getStoreProfile());
    setBills(getBills());
    setCustomers(getCustomers());
    setExpenses(getExpenses());
  };

  const handleSaveBill = (saved: MedicalBill) => {
    saveBill(saved);
    refreshAllData();
  };

  const handleDeleteBill = (id: string) => {
    if (confirm('Are you sure you want to delete this bill record? This action cannot be undone.')) {
      deleteBill(id);
      refreshAllData();
      if (viewingBillDetail?.id === id) setViewingBillDetail(null);
    }
  };

  const handleAddPayment = (billId: string, payment: Omit<BillPayment, 'id'>) => {
    addPaymentToBill(billId, payment);
    refreshAllData();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpAmount);
    if (isNaN(amt) || amt <= 0) return;
    const exp: StoreExpense = {
      id: `exp_${Date.now()}`,
      title: newExpTitle.trim() || 'General Expense',
      category: newExpCategory,
      amount: round2(amt),
      date: newExpDate,
      notes: newExpNotes.trim(),
      createdAt: new Date().toISOString()
    };
    saveExpense(exp);
    setNewExpTitle('');
    setNewExpAmount('');
    setNewExpNotes('');
    refreshAllData();
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Delete this expense entry?')) {
      deleteExpense(id);
      refreshAllData();
    }
  };

  // Helper date checking
  const isDateInFilter = (dateStr: string, mode: typeof dateFilterMode) => {
    if (mode === 'all') return true;
    const target = new Date(dateStr);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

    if (mode === 'today') {
      return target >= startOfToday;
    }
    if (mode === 'yesterday') {
      return target >= startOfYesterday && target < startOfToday;
    }
    if (mode === 'this_week') {
      const dayOfWeek = now.getDay() || 7;
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
      return target >= startOfWeek;
    }
    if (mode === 'this_month') {
      return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth();
    }
    if (mode === 'previous_months') {
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return target >= startOfYear && target < startOfCurrentMonth;
    }
    if (mode === 'previous_years') {
      return target.getFullYear() < now.getFullYear();
    }
    if (mode === 'custom') {
      if (customStartDate && new Date(dateStr) < new Date(customStartDate)) return false;
      if (customEndDate && new Date(dateStr) > new Date(`${customEndDate}T23:59:59`)) return false;
      return true;
    }
    return true;
  };

  // Filtered Bills for Records / Search / Today
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      // Date filter
      if (activeTab === 'today') {
        if (!isDateInFilter(b.dateTime, 'today')) return false;
      } else if (activeTab === 'search') {
        if (!isDateInFilter(b.dateTime, dateFilterMode)) return false;
      }

      // Status filter
      if (searchStatus !== 'ALL' && b.status !== searchStatus) return false;

      // Query filter (Token, Customer, Phone, Medicine name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchToken = b.billTokenNumber.toLowerCase().includes(q);
        const matchCust = b.customerName.toLowerCase().includes(q);
        const matchPhone = b.customerPhone?.toLowerCase().includes(q) || false;
        const matchMedicine = b.items.some((it) => it.productName.toLowerCase().includes(q));
        if (!matchToken && !matchCust && !matchPhone && !matchMedicine) return false;
      }

      return true;
    });
  }, [bills, activeTab, dateFilterMode, searchStatus, searchQuery, customStartDate, customEndDate]);

  // Khata / Due Bills
  const dueBills = useMemo(() => {
    return bills.filter((b) => b.remainingDue > 0.01);
  }, [bills]);

  const totalOutstandingKhata = useMemo(() => {
    return round2(dueBills.reduce((acc, b) => acc + b.remainingDue, 0));
  }, [dueBills]);

  // Today Statistics
  const todayStats = useMemo(() => {
    const todayBills = bills.filter((b) => isDateInFilter(b.dateTime, 'today'));
    const totalSales = round2(todayBills.reduce((acc, b) => acc + b.grandTotal, 0));
    const cashReceived = round2(todayBills.reduce((acc, b) => acc + b.totalReceived, 0));
    const creditDue = round2(todayBills.reduce((acc, b) => acc + b.remainingDue, 0));

    const todayExps = expenses.filter((e) => isDateInFilter(e.date, 'today'));
    const totalExp = round2(todayExps.reduce((acc, e) => acc + e.amount, 0));

    return {
      billCount: todayBills.length,
      totalSales,
      cashReceived,
      creditDue,
      totalExp,
      netCash: round2(cashReceived - totalExp)
    };
  }, [bills, expenses]);

  // Print Bill handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Store Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 border-amber-400/40 rounded-xs shadow-md border border-[#D9CFB8]/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#B08D57] text-stone-900 rounded-xs">
                Private Business Tool • DigiKhata
              </span>
              <span className="text-xs text-[#EDF1EA]/80 font-mono">
                {profile.storeCategory}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#FBF8F2]">
              {profile.storeName}
            </h1>
            <p className="text-xs text-[#EDF1EA]/80 flex flex-wrap items-center gap-3">
              <span>Owner: <strong>{profile.ownerName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#B08D57]" /> {profile.phone}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#B08D57]" /> {profile.city}, {profile.country}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { setEditingBill(null); setIsNewBillOpen(true); }}
              className="px-4 py-2.5 bg-[#B08D57] hover:bg-[#B08D57]/90 text-stone-900 font-bold text-xs rounded-xs transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              New Bill
            </button>

            <button
              onClick={() => setIsScanBillOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#FBF8F2] border border-[#D9CFB8]/40 font-bold text-xs rounded-xs transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#B08D57]" />
              Scan / Upload Bill
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#D9CFB8]/20 text-xs">
          <div className="bg-white/5 p-3 rounded-xs border border-white/10">
            <div className="text-[11px] text-[#EDF1EA]/70">Today's Sales</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#FBF8F2] mt-0.5">
              {formatCurrency(todayStats.totalSales, profile.currencySymbol)}
            </div>
            <div className="text-[10px] text-[#EDF1EA]/60">{todayStats.billCount} bills issued</div>
          </div>

          <div className="bg-white/5 p-3 rounded-xs border border-white/10">
            <div className="text-[11px] text-[#EDF1EA]/70">Today's Cash In</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-300 mt-0.5">
              {formatCurrency(todayStats.cashReceived, profile.currencySymbol)}
            </div>
            <div className="text-[10px] text-emerald-400/80">Counter cash received</div>
          </div>

          <div className="bg-white/5 p-3 rounded-xs border border-white/10">
            <div className="text-[11px] text-[#EDF1EA]/70">Total Khata / Due</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5">
              {formatCurrency(totalOutstandingKhata, profile.currencySymbol)}
            </div>
            <div className="text-[10px] text-amber-400/80">{dueBills.length} pending bills</div>
          </div>

          <div className="bg-white/5 p-3 rounded-xs border border-white/10">
            <div className="text-[11px] text-[#EDF1EA]/70">Total Customers</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#FBF8F2] mt-0.5">
              {customers.length}
            </div>
            <div className="text-[10px] text-[#EDF1EA]/60">DigiKhata accounts</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-[#D9CFB8] flex items-center justify-between overflow-x-auto no-scrollbar gap-1 text-xs">
        <div className="flex items-center gap-1 py-1">
          {[
            { id: 'today', label: "Today's Records", icon: Clock },
            { id: 'bills', label: 'Bills / Sales History', icon: FileText },
            { id: 'khata', label: 'Due / Khata', icon: CreditCard, badge: dueBills.length },
            { id: 'inventory', label: 'Stock & Auto-Deduct', icon: PackageCheck },
            { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
            { id: 'expenses', label: 'Expenses', icon: TrendingUp },
            { id: 'reports', label: 'Reports', icon: DollarSign },
            { id: 'search', label: 'Search Records', icon: Search },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-[#FBF8F2]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#EDF1EA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 ? (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-bold ${
                    isActive ? 'bg-[#B08D57] text-stone-900' : 'bg-[#D9CFB8] text-stone-800'
                  }`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. TODAY'S RECORDS & 2. BILLS / SALES HISTORY & 7. SEARCH RECORDS */}
      {/* ------------------------------------------------------------------ */}
      {(activeTab === 'today' || activeTab === 'bills' || activeTab === 'search') && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-[#D9CFB8] p-3 rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Bill #, Customer name, Phone, or Medicine name..."
                className="w-full pl-8 pr-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {activeTab === 'search' && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={dateFilterMode}
                  onChange={(e) => setDateFilterMode(e.target.value as any)}
                  className="px-2.5 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs font-medium focus:outline-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="previous_months">Previous Months</option>
                  <option value="previous_years">Previous Years</option>
                  <option value="custom">Custom Date Range</option>
                  <option value="all">All Time</option>
                </select>

                {dateFilterMode === 'custom' && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-2 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                    />
                    <span className="text-stone-400">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-2 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="px-2.5 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid / Due">Unpaid / Due</option>
              </select>
            </div>
          </div>

          {/* Bills Table */}
          {filteredBills.length === 0 ? (
            <div className="bg-white border border-[#D9CFB8] rounded-xs p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <div className="text-sm font-bold text-stone-900">No bills match your current filters</div>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {activeTab === 'today'
                  ? "No bills have been created yet today. Click 'New Bill' to record your first sale."
                  : "Try adjusting your search keywords, payment status, or date range."}
              </p>
              <button
                onClick={() => { setEditingBill(null); setIsNewBillOpen(true); }}
                className="mt-2 px-4 py-2 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Bill
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#D9CFB8] rounded-xs overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDF1EA]/60 border-b border-[#D9CFB8] text-stone-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Token #</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3 text-right">Grand Total</th>
                      <th className="py-2.5 px-3 text-right">Received</th>
                      <th className="py-2.5 px-3 text-right">Remaining Due</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBills.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FBF8F2] transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                          {b.billTokenNumber}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                          <div>{new Date(b.dateTime).toLocaleDateString()}</div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-stone-800">{b.customerName}</div>
                          {b.customerPhone && (
                            <div className="text-[10px] text-stone-400">{b.customerPhone}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">
                          <span className="font-medium">{b.items.length} items</span>
                          <p className="text-[10px] text-stone-400 truncate max-w-xs">
                            {b.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                          </p>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          {formatCurrency(b.grandTotal, profile.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-900">
                          {formatCurrency(b.totalReceived, profile.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          <span className={b.remainingDue > 0 ? 'text-amber-700' : 'text-stone-400'}>
                            {formatCurrency(b.remainingDue, profile.currencySymbol)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                            b.status === 'Paid'
                              ? 'bg-amber-100 text-amber-900'
                              : b.status === 'Partially Paid'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingBillDetail(b)}
                              title="View Bill Details"
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-[#EDF1EA] rounded-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {b.remainingDue > 0 && (
                              <button
                                onClick={() => setSelectedBillForPayment(b)}
                                title="Add Payment"
                                className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-xs"
                              >
                                + Pay
                              </button>
                            )}

                            <button
                              onClick={() => { setEditingBill(b); setIsNewBillOpen(true); }}
                              title="Edit Bill"
                              className="p-1 text-stone-500 hover:text-stone-800 hover:bg-[#EDF1EA] rounded-xs"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteBill(b.id)}
                              title="Delete Bill"
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. DUE / KHATA SECTION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'khata' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-700" />
                Active DigiKhata Ledger (Remaining Due)
              </div>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Bills with pending customer balances. Click "+ Pay" to add payments without overwriting previous history.
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-amber-700 font-semibold">Total Outstanding Balance</div>
              <div className="text-xl font-bold font-mono text-amber-900">
                {formatCurrency(totalOutstandingKhata, profile.currencySymbol)}
              </div>
            </div>
          </div>

          {dueBills.length === 0 ? (
            <div className="bg-white border border-[#D9CFB8] rounded-xs p-10 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-amber-700 mx-auto" />
              <div className="text-sm font-bold text-stone-900">All bills are fully paid!</div>
              <p className="text-xs text-stone-500">There are currently no outstanding khata or credit balances.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#D9CFB8] rounded-xs overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDF1EA]/60 border-b border-[#D9CFB8] text-stone-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Token #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Customer Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3 text-right">Bill Total</th>
                      <th className="py-2.5 px-3 text-right">Received</th>
                      <th className="py-2.5 px-3 text-right">Remaining Due</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {dueBills.map((b) => (
                      <tr key={b.id} className="hover:bg-amber-50/40 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{b.billTokenNumber}</td>
                        <td className="py-2.5 px-3 text-stone-500">{new Date(b.dateTime).toLocaleDateString()}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-800">{b.customerName}</td>
                        <td className="py-2.5 px-3 text-stone-500">{b.customerPhone || '—'}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(b.grandTotal, profile.currencySymbol)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-900">{formatCurrency(b.totalReceived, profile.currencySymbol)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                          {formatCurrency(b.remainingDue, profile.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                            b.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedBillForPayment(b)}
                              className="px-2.5 py-1 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs hover:bg-stone-900/90 transition"
                            >
                              Add Payment
                            </button>
                            <button
                              onClick={() => setViewingBillDetail(b)}
                              className="p-1 text-stone-500 hover:text-stone-800"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. CUSTOMERS SECTION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs">
            <h3 className="text-sm font-bold font-serif text-stone-900">Customer Accounts & Purchase History</h3>
            <p className="text-xs text-stone-500">
              Private customer records linked with bill purchases, total payments received, and individual khata ledger balances.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {customers.map((c) => (
              <div
                key={c.id}
                onClick={() => setViewingCustomerDetail(c)}
                className="bg-white border border-[#D9CFB8] p-4 rounded-xs hover:border-amber-500 transition cursor-pointer space-y-2 shadow-xs group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#B08D57] transition">
                      {c.name}
                    </h4>
                    {c.phone && <p className="text-xs text-stone-500">{c.phone}</p>}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EDF1EA] text-stone-900 rounded-xs">
                    {c.billsCount} bills
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Purchases</span>
                    <span className="font-mono font-bold text-stone-800">
                      {formatCurrency(c.totalPurchases, profile.currencySymbol)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Balance Due</span>
                    <span className={`font-mono font-bold ${c.outstandingBalance > 0 ? 'text-amber-700' : 'text-amber-800'}`}>
                      {formatCurrency(c.outstandingBalance, profile.currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 pt-1 flex justify-between items-center">
                  <span>Last visit: {new Date(c.lastVisitDate).toLocaleDateString()}</span>
                  <span className="text-stone-900 font-semibold flex items-center">
                    View History <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. EXPENSES SECTION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add Expense Form */}
            <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs space-y-3">
              <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 pb-2 border-b border-stone-200">
                <Plus className="w-3.5 h-3.5 text-[#B08D57]" /> Record Store Expense
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Expense Title *</label>
                  <input
                    type="text"
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="e.g. Shop electricity bill, Medicine stock wholesale"
                    className="w-full px-2.5 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Category *</label>
                  <select
                    value={newExpCategory}
                    onChange={(e) => setNewExpCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                  >
                    {[
                      'Rent',
                      'Utilities',
                      'Staff Salary',
                      'Inventory / Wholesale',
                      'Transportation',
                      'Maintenance',
                      'Taxes & Licenses',
                      'Packaging & Supplies',
                      'Miscellaneous'
                    ].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Amount ({profile.currencySymbol}) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newExpAmount}
                      onChange={(e) => setNewExpAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Date</label>
                    <input
                      type="date"
                      value={newExpDate}
                      onChange={(e) => setNewExpDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newExpNotes}
                    onChange={(e) => setNewExpNotes(e.target.value)}
                    placeholder="Distributor name, invoice receipt number..."
                    className="w-full px-2.5 py-1.5 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 text-[#FBF8F2] font-bold text-xs rounded-xs hover:bg-stone-900/90 transition"
                >
                  Save Expense Entry
                </button>
              </form>
            </div>

            {/* Expenses List */}
            <div className="md:col-span-2 bg-white border border-[#D9CFB8] rounded-xs overflow-hidden shadow-xs">
              <div className="p-3 bg-[#EDF1EA]/60 border-b border-[#D9CFB8] flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Store Expenses History ({expenses.length})</span>
                <span className="text-xs font-mono font-bold text-stone-700">
                  Total: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0), profile.currencySymbol)}
                </span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FBF8F2] border-b border-stone-200 text-stone-500 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Title</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-[#FBF8F2]">
                        <td className="py-2 px-3 text-stone-500">{e.date}</td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-stone-800">{e.title}</div>
                          {e.notes && <div className="text-[10px] text-stone-400">{e.notes}</div>}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] px-2 py-0.5 bg-[#EDF1EA] text-stone-700 rounded-xs">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-stone-800">
                          {formatCurrency(e.amount, profile.currencySymbol)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleDeleteExpense(e.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. REPORTS SECTION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs">
            <h3 className="text-sm font-bold font-serif text-stone-900">Business Sales & DigiKhata Reports</h3>
            <p className="text-xs text-stone-500">
              Aggregated cash flow, credit exposure, and sales performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs space-y-1">
              <span className="text-xs text-stone-500">Gross Sales (All Time)</span>
              <div className="text-xl font-bold font-mono text-stone-900">
                {formatCurrency(bills.reduce((s, b) => s + b.grandTotal, 0), profile.currencySymbol)}
              </div>
              <span className="text-[11px] text-stone-400">{bills.length} total bills</span>
            </div>

            <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs space-y-1">
              <span className="text-xs text-stone-500">Total Cash Received</span>
              <div className="text-xl font-bold font-mono text-amber-800">
                {formatCurrency(bills.reduce((s, b) => s + b.totalReceived, 0), profile.currencySymbol)}
              </div>
              <span className="text-[11px] text-amber-700">Settled revenue</span>
            </div>

            <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs space-y-1">
              <span className="text-xs text-stone-500">Outstanding Khata Receivables</span>
              <div className="text-xl font-bold font-mono text-amber-700">
                {formatCurrency(totalOutstandingKhata, profile.currencySymbol)}
              </div>
              <span className="text-[11px] text-amber-600">{dueBills.length} credit accounts</span>
            </div>
          </div>

          {/* Top Selling Medicines */}
          <div className="bg-white border border-[#D9CFB8] p-4 rounded-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Top Selling Medicines</h4>
            <div className="space-y-2">
              {(() => {
                const medMap: Record<string, { name: string; qty: number; total: number }> = {};
                bills.forEach((b) => {
                  b.items.forEach((it) => {
                    const norm = it.productName.trim();
                    if (!medMap[norm]) medMap[norm] = { name: norm, qty: 0, total: 0 };
                    medMap[norm].qty += Number(it.quantity || 1);
                    medMap[norm].total += Number(it.lineTotal || 0);
                  });
                });
                const topMeds = Object.values(medMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
                if (topMeds.length === 0) return <p className="text-xs text-stone-400">No items recorded yet.</p>;
                return topMeds.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0">
                    <span className="font-semibold text-stone-800">{idx + 1}. {m.name}</span>
                    <div className="text-right">
                      <span className="font-bold text-stone-900 mr-3">{m.qty} units sold</span>
                      <span className="font-mono text-stone-500">{formatCurrency(m.total, profile.currencySymbol)}</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. STORE SETTINGS & BACKUP */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-[#D9CFB8] p-6 rounded-xs space-y-6">
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900">Store Profile & Preferences</h3>
            <p className="text-xs text-stone-500">
              Configure store identity, printed receipt header, currency symbol, and data backup.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveStoreProfile(profile);
              alert('Store settings saved successfully!');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Store / Pharmacy Name *</label>
                <input
                  type="text"
                  value={profile.storeName}
                  onChange={(e) => setProfile({ ...profile, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs font-semibold text-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Owner / Manager Name *</label>
                <input
                  type="text"
                  value={profile.ownerName}
                  onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Store Street Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Area / Sector</label>
                <input
                  type="text"
                  value={profile.area}
                  onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Store Category</label>
                <input
                  type="text"
                  value={profile.storeCategory}
                  onChange={(e) => setProfile({ ...profile, storeCategory: e.target.value })}
                  placeholder="e.g. Community Medical Store, Wholesale Chemist"
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Business Hours</label>
                <input
                  type="text"
                  value={profile.businessHours}
                  onChange={(e) => setProfile({ ...profile, businessHours: e.target.value })}
                  placeholder="e.g. 09:00 AM – 11:00 PM"
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Currency Code & Symbol</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profile.currency}
                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                    placeholder="PKR"
                    className="w-1/2 px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                  />
                  <input
                    type="text"
                    value={profile.currencySymbol}
                    onChange={(e) => setProfile({ ...profile, currencySymbol: e.target.value })}
                    placeholder="Rs"
                    className="w-1/2 px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Bill / Invoice Prefix</label>
                <input
                  type="text"
                  value={profile.invoicePrefix}
                  onChange={(e) => setProfile({ ...profile, invoicePrefix: e.target.value })}
                  placeholder="BIL-"
                  className="w-full px-3 py-2 bg-[#FBF8F2] border border-[#D9CFB8] rounded-xs text-stone-800 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 text-[#FBF8F2] font-bold text-xs rounded-xs hover:bg-stone-900/90 transition"
              >
                Save Store Profile
              </button>
            </div>
          </form>

          {/* Backup & Restore Data */}
          <div className="pt-6 border-t border-[#D9CFB8] space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Permanent Records: Backup & Restore
            </h4>
            <p className="text-xs text-stone-500">
              Download complete digital backup of bills, khata balances, customers, and expenses in JSON format, or restore from a previous backup file.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const json = exportAllStoreData();
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `mediguide_backup_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-white border border-[#D9CFB8] hover:bg-[#EDF1EA] text-stone-900 text-xs font-bold rounded-xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#B08D57]" /> Export Store Backup (JSON)
              </button>

              <label className="px-4 py-2 bg-white border border-[#D9CFB8] hover:bg-[#EDF1EA] text-stone-900 text-xs font-bold rounded-xs flex items-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#B08D57]" /> Restore Backup File
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const res = importStoreData(reader.result as string);
                      alert(res.message);
                      if (res.success) refreshAllData();
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB: MEDICINE INVENTORY & AUTO-DEDUCT */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Smart Medicine Identifier Component */}
          <SmartMedicineIdentifier />

          {/* Complete Store Stock Management Table */}
          <div className="bg-white border border-[#D9CFB8] rounded-xs p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9CFB8] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-[#0E3B36]" />
                  <span>Medical Store Live Stock Ledger</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track real-time quantities, physical rack locations, expiry dates, and automatic deduction history.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-stone-700">Total Registered Items:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950">
                  {getMedicineInventory().length} Medicines
                </span>
              </div>
            </div>

            {/* Quick Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EDF1EA]/70 border-b border-[#D9CFB8] text-stone-700 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Medicine & Brand</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Rack & Batch</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Current Stock</th>
                    <th className="py-2.5 px-3 text-right">Quick Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CFB8]/40">
                  {getMedicineInventory().map((item) => (
                    <tr key={item.id} className="hover:bg-[#FBF8F2] transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500">{item.genericName} • {item.strength}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDF1EA] text-stone-700 border border-[#D9CFB8]">
                          {item.category.split(' ')[0]}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#B08D57]" /> {item.locationRack}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          Batch: {item.batchNumber} • Exp: {item.expiryDate}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-stone-900">
                        {formatCurrency(item.unitPrice, profile.currencySymbol)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          item.stockQuantity > item.minThreshold
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.stockQuantity > 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {item.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              deductMedicineStock(item.medicineId, 1, 'Quick Table Deduct');
                              refreshAllData();
                            }}
                            disabled={item.stockQuantity <= 0}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-bold text-xs disabled:opacity-40 cursor-pointer"
                            title="Deduct 1 unit"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              restockMedicineStock(item.medicineId, 10);
                              refreshAllData();
                            }}
                            className="px-2 py-1 bg-[#0E3B36] hover:bg-[#092824] text-white rounded font-bold text-xs cursor-pointer"
                            title="Restock 10 units"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BILL DETAIL MODAL / RECEIPT PRINT VIEW */}
      {/* ------------------------------------------------------------------ */}
      {viewingBillDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FBF8F2] border border-[#D9CFB8] text-[#1a2e2b] w-full max-w-xl rounded-xs shadow-2xl p-6 relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9CFB8] print:hidden">
              <span className="text-xs font-bold text-stone-900">Digital Bill & Khata Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 bg-white border border-[#D9CFB8] hover:bg-[#EDF1EA] text-stone-700 text-xs font-semibold rounded-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setViewingBillDetail(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Body */}
            <div className="mt-4 p-5 bg-white border border-[#D9CFB8] rounded-xs space-y-4">
              <div className="text-center pb-3 border-b border-stone-200">
                <h2 className="text-lg font-bold font-serif text-stone-900">{profile.storeName}</h2>
                <p className="text-[11px] text-stone-500">{profile.address}, {profile.city}</p>
                <p className="text-[11px] text-stone-500">Phone: {profile.phone}</p>
              </div>

              <div className="grid grid-cols-2 text-xs gap-2">
                <div>
                  <div className="text-[11px] text-stone-400">Bill / Token #:</div>
                  <div className="font-mono font-bold text-stone-900">{viewingBillDetail.billTokenNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-stone-400">Date & Time:</div>
                  <div>{new Date(viewingBillDetail.dateTime).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400">Customer Name:</div>
                  <div className="font-bold">{viewingBillDetail.customerName}</div>
                  {viewingBillDetail.customerPhone && (
                    <div className="text-[10px] text-stone-500">{viewingBillDetail.customerPhone}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-stone-400">Payment Status:</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs inline-block mt-0.5 ${
                    viewingBillDetail.status === 'Paid'
                      ? 'bg-amber-100 text-amber-900'
                      : viewingBillDetail.status === 'Partially Paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {viewingBillDetail.status}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-t border-b border-stone-200 my-2">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] text-stone-400 font-bold uppercase">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Disc</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {viewingBillDetail.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-medium">{it.productName}</td>
                      <td className="py-1.5 text-center">{it.quantity}</td>
                      <td className="py-1.5 text-right font-mono">{formatCurrency(it.unitPrice, profile.currencySymbol)}</td>
                      <td className="py-1.5 text-right font-mono text-stone-400">{it.discount ? `-${it.discount}` : '0'}</td>
                      <td className="py-1.5 text-right font-mono font-bold">{formatCurrency(it.lineTotal, profile.currencySymbol)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="space-y-1 text-xs border-b border-stone-200 pb-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(viewingBillDetail.subtotal, profile.currencySymbol)}</span>
                </div>
                {viewingBillDetail.totalDiscount > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Discount:</span>
                    <span className="font-mono text-amber-800">-{formatCurrency(viewingBillDetail.totalDiscount, profile.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-100">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatCurrency(viewingBillDetail.grandTotal, profile.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-semibold">
                  <span>Total Received:</span>
                  <span className="font-mono">{formatCurrency(viewingBillDetail.totalReceived, profile.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-amber-800 font-bold">
                  <span>Remaining Due:</span>
                  <span className="font-mono">{formatCurrency(viewingBillDetail.remainingDue, profile.currencySymbol)}</span>
                </div>
              </div>

              {/* Payment History */}
              {viewingBillDetail.paymentHistory && viewingBillDetail.paymentHistory.length > 0 && (
                <div className="text-xs space-y-1">
                  <div className="text-[11px] font-bold text-stone-900">Payment History</div>
                  {viewingBillDetail.paymentHistory.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded-xs">
                      <span>+{formatCurrency(p.amount, profile.currencySymbol)} ({p.paymentMethod})</span>
                      <span className="text-stone-400">{new Date(p.paymentDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Original Scanned Bill Image if available */}
              {viewingBillDetail.originalBillImage && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="text-[11px] font-bold text-stone-900 mb-1">Attached Original Bill Photo</div>
                  <img
                    src={viewingBillDetail.originalBillImage}
                    alt="Original Bill Image"
                    className="max-h-48 rounded-xs border border-stone-300 mx-auto"
                  />
                </div>
              )}

              {viewingBillDetail.notes && (
                <p className="text-[11px] text-stone-500 italic">Notes: {viewingBillDetail.notes}</p>
              )}

              <div className="text-center text-[10px] text-stone-400 pt-2">
                Thank you for your visit • Get well soon
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CUSTOMER DETAIL MODAL / HISTORY */}
      {/* ------------------------------------------------------------------ */}
      {viewingCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FBF8F2] border border-[#D9CFB8] text-[#1a2e2b] w-full max-w-2xl rounded-xs shadow-2xl p-6 relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9CFB8]">
              <div>
                <h3 className="text-base font-bold font-serif text-stone-900">
                  Customer History: {viewingCustomerDetail.name}
                </h3>
                <p className="text-xs text-stone-500">{viewingCustomerDetail.phone || 'No phone recorded'}</p>
              </div>
              <button
                onClick={() => setViewingCustomerDetail(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-white border border-[#D9CFB8] rounded-xs text-center text-xs">
              <div>
                <span className="text-[11px] text-stone-400 block">Total Purchases</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatCurrency(viewingCustomerDetail.totalPurchases, profile.currencySymbol)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block">Total Paid</span>
                <span className="font-mono font-bold text-amber-800">
                  {formatCurrency(viewingCustomerDetail.totalPayments, profile.currencySymbol)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block">Remaining Due</span>
                <span className={`font-mono font-bold ${viewingCustomerDetail.outstandingBalance > 0 ? 'text-amber-700' : 'text-amber-800'}`}>
                  {formatCurrency(viewingCustomerDetail.outstandingBalance, profile.currencySymbol)}
                </span>
              </div>
            </div>

            {/* List of customer's bills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900">Previous Bills & Transactions</h4>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {getCustomerBills(viewingCustomerDetail.name, viewingCustomerDetail.phone).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white border border-[#D9CFB8] rounded-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-stone-900">{b.billTokenNumber}</div>
                      <div className="text-[10px] text-stone-400">{new Date(b.dateTime).toLocaleString()}</div>
                      <div className="text-[11px] text-stone-600 mt-1">
                        {b.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold">{formatCurrency(b.grandTotal, profile.currencySymbol)}</div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs inline-block mt-0.5 ${
                        b.status === 'Paid'
                          ? 'bg-amber-100 text-amber-900'
                          : b.status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.status}
                      </span>
                      {b.remainingDue > 0 && (
                        <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                          Due: {formatCurrency(b.remainingDue, profile.currencySymbol)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewBillModal
        isOpen={isNewBillOpen}
        profile={profile}
        editingBill={editingBill}
        onClose={() => { setIsNewBillOpen(false); setEditingBill(null); }}
        onSaveBill={handleSaveBill}
      />

      <ScanBillModal
        isOpen={isScanBillOpen}
        onClose={() => setIsScanBillOpen(false)}
        onExtracted={(result, imageBase64) => {
          setIsScanBillOpen(false);
          setIsNewBillOpen(true);
        }}
      />

      <PaymentModal
        isOpen={Boolean(selectedBillForPayment)}
        bill={selectedBillForPayment}
        currencySymbol={profile.currencySymbol}
        onClose={() => setSelectedBillForPayment(null)}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
};
