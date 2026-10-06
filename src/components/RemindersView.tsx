import React, { useState, useEffect } from 'react';
import { MedicationReminder } from '../types.ts';
import { Bell, Clock, Plus, Check, Trash2, Calendar, Pill } from 'lucide-react';

interface RemindersViewProps {
  currentUserId: string;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ currentUserId }) => {
  const storageKey = `mediguide_reminders_${currentUserId}`;
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<MedicationReminder['frequency']>('Once Daily');
  const [instructions, setInstructions] = useState('Take after breakfast with water');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReminders(JSON.parse(saved));
      } else {
        const initialReminders: MedicationReminder[] = [
          {
            id: 'rem-1',
            userId: currentUserId,
            medicineName: 'Panadol (Paracetamol)',
            dosage: '500 mg',
            time: '08:00',
            frequency: 'Twice Daily',
            instructions: 'Take with warm water after food',
            active: true,
            takenDates: [new Date().toISOString().split('T')[0]]
          },
          {
            id: 'rem-2',
            userId: currentUserId,
            medicineName: 'Metformin HCl',
            dosage: '500 mg',
            time: '20:00',
            frequency: 'Once Daily',
            instructions: 'Take during or immediately after dinner',
            active: true,
            takenDates: []
          }
        ];
        setReminders(initialReminders);
        localStorage.setItem(storageKey, JSON.stringify(initialReminders));
      }
    } catch (e) {
      console.warn('Error loading reminders:', e);
    }
  }, [currentUserId, storageKey]);

  const saveReminders = (updated: MedicationReminder[]) => {
    setReminders(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newReminder: MedicationReminder = {
      id: `rem_${Date.now()}`,
      userId: currentUserId,
      medicineName: medName.trim(),
      dosage: dosage.trim(),
      time,
      frequency,
      instructions: instructions.trim(),
      active: true,
      takenDates: []
    };

    saveReminders([newReminder, ...reminders]);
    setIsAdding(false);
    setMedName('');
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    saveReminders(updated);
  };

  const markTakenToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const exists = r.takenDates.includes(today);
        const newDates = exists ? r.takenDates.filter((d) => d !== today) : [...r.takenDates, today];
        return { ...r, takenDates: newDates };
      }
      return r;
    });
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    saveReminders(reminders.filter((r) => r.id !== id));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            <span>Medication Schedule & Adherence Reminders</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay on track with prescribed doses, dosage times, and daily intake adherence.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Add Reminder Modal / Form */}
      {isAdding && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-md">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
            Schedule New Medication Reminder
          </h3>
          <form onSubmit={handleAddReminder} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Augmentin 625mg"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Thrice Daily">Thrice Daily</option>
                <option value="Every 4 Hours">Every 4 Hours</option>
                <option value="As Needed">As Needed (PRN)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Instructions (with food / empty stomach)
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take 30 mins before breakfast"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((rem) => {
          const takenToday = rem.takenDates.includes(todayStr);

          return (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between ${
                takenToday
                  ? 'bg-amber-50/50 dark:bg-stone-900 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{rem.time}</span>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {rem.frequency}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  <span>{rem.medicineName}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dose: {rem.dosage}
                </p>

                {rem.instructions && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    {rem.instructions}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => markTakenToday(rem.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                    takenToday
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{takenToday ? 'Taken Today ✓' : 'Mark as Taken'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                  title="Delete reminder"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
