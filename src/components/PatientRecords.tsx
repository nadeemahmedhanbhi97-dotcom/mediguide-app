import React, { useState, useEffect, useRef } from 'react';
import { Patient, DoctorVisit, Doctor } from '../types.ts';
import { CameraCaptureModal } from './CameraCaptureModal.tsx';
import {
  Users, UserPlus, Camera, Trash2, Edit3, Eye, Shield, AlertTriangle,
  Phone, Mail, Droplet, Heart, Calendar, FileText, Check, X, User, Upload
} from 'lucide-react';

interface PatientRecordsProps {
  currentUserId: string;
  selectedDoctorForVisit?: Doctor | null;
  onClearSelectedDoctor?: () => void;
}

export const PatientRecords: React.FC<PatientRecordsProps> = ({
  currentUserId,
  selectedDoctorForVisit,
  onClearSelectedDoctor
}) => {
  const storageKey = `mediguide_patients_${currentUserId}`;
  const visitsStorageKey = `mediguide_doctor_visits_${currentUserId}`;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewingPatient, setIsViewingPatient] = useState<Patient | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  // Patient Camera Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const patientPhotoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePatientPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Patient['gender']>('Prefer not to say');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Doctor Visit Log Form
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitPatientId, setVisitPatientId] = useState<string>('');
  const [visitDoctorName, setVisitDoctorName] = useState('');
  const [visitClinic, setVisitClinic] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitReason, setVisitReason] = useState('');
  const [visitNotes, setVisitNotes] = useState('');

  // Load user-scoped patient data
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem(storageKey);
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      } else {
        // Seed an initial demo patient so the user immediately sees a working profile
        const initialDemo: Patient = {
          id: 'demo-patient-1',
          userId: currentUserId,
          fullName: 'Ahmed Ali (Demo Profile)',
          age: 34,
          dob: '1992-04-12',
          gender: 'Male',
          phone: '+92 300 1234567',
          email: 'ahmed.demo@example.com',
          bloodGroup: 'B+',
          allergies: 'Penicillin (mild rash), Dust mites',
          currentMedications: 'Panadol 500mg as needed, Cetirizine 10mg',
          medicalNotes: 'Mild seasonal allergic rhinitis. Normal cardiovascular profile.',
          emergencyContact: 'Fatima Ali (Spouse) - +92 301 9876543',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setPatients([initialDemo]);
        localStorage.setItem(storageKey, JSON.stringify([initialDemo]));
      }

      const savedVisits = localStorage.getItem(visitsStorageKey);
      if (savedVisits) {
        setVisits(JSON.parse(savedVisits));
      }
    } catch (e) {
      console.warn('Error loading patient storage:', e);
    }
  }, [currentUserId, storageKey, visitsStorageKey]);

  // If a doctor was selected from Doctor Search, open the Visit Modal pre-filled
  useEffect(() => {
    if (selectedDoctorForVisit) {
      setVisitDoctorName(selectedDoctorForVisit.name);
      setVisitClinic(`${selectedDoctorForVisit.clinicOrHospital} (${selectedDoctorForVisit.city})`);
      setVisitReason(`Consultation regarding ${selectedDoctorForVisit.specialty}`);
      setIsVisitModalOpen(true);
    }
  }, [selectedDoctorForVisit]);

  const savePatientsToStorage = (updated: Patient[]) => {
    setPatients(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const saveVisitsToStorage = (updated: DoctorVisit[]) => {
    setVisits(updated);
    localStorage.setItem(visitsStorageKey, JSON.stringify(updated));
  };

  // Open Add Patient Form
  const handleOpenAdd = () => {
    setEditingPatientId(null);
    setFullName('');
    setAge('');
    setDob('');
    setGender('Male');
    setPhone('');
    setEmail('');
    setBloodGroup('O+');
    setAllergies('');
    setCurrentMedications('');
    setMedicalNotes('');
    setEmergencyContact('');
    setPhotoPreview(undefined);
    setIsFormOpen(true);
  };

  // Open Edit Patient Form
  const handleOpenEdit = (p: Patient) => {
    setEditingPatientId(p.id);
    setFullName(p.fullName);
    setAge(p.age);
    setDob(p.dob || '');
    setGender(p.gender);
    setPhone(p.phone);
    setEmail(p.email || '');
    setBloodGroup(p.bloodGroup || 'O+');
    setAllergies(p.allergies);
    setCurrentMedications(p.currentMedications);
    setMedicalNotes(p.medicalNotes);
    setEmergencyContact(p.emergencyContact || '');
    setPhotoPreview(p.photoUrl);
    setIsFormOpen(true);
  };

  // Delete Patient
  const handleDeletePatient = (id: string) => {
    setErrorMessage(null);
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        setIsSubmitting(true);
        const updated = patients.filter((p) => p.id !== id);
        savePatientsToStorage(updated);
        if (isViewingPatient?.id === id) {
          setIsViewingPatient(null);
        }
        setIsSubmitting(false);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Unable to delete patient record. Please try again.');
      }
    }
  };

  // Handle Photo Capture from Modal
  const handlePhotoCaptured = (dataUrl: string) => {
    setPhotoPreview(dataUrl);
  };

  // Save Patient Submit
  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const patientData: Patient = {
        id: editingPatientId || `pat_${Date.now()}`,
        userId: currentUserId,
        fullName: fullName.trim(),
        age: Number(age) || 0,
        dob,
        gender,
        phone: phone.trim(),
        email: email.trim() || undefined,
        bloodGroup,
        allergies: allergies.trim(),
        currentMedications: currentMedications.trim(),
        medicalNotes: medicalNotes.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
        photoUrl: photoPreview,
        createdAt: editingPatientId
          ? patients.find((p) => p.id === editingPatientId)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updated: Patient[];
      if (editingPatientId) {
        updated = patients.map((p) => (p.id === editingPatientId ? patientData : p));
      } else {
        updated = [patientData, ...patients];
      }

      savePatientsToStorage(updated);
      setIsSubmitting(false);
      setIsFormOpen(false);
      if (isViewingPatient?.id === patientData.id) {
        setIsViewingPatient(patientData);
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        editingPatientId
          ? 'Unable to update patient record. Please try again.'
          : 'Unable to save patient record. Please try again.'
      );
    }
  };

  // Filtered patients by user search query
  const filteredPatients = patients.filter((pat) => {
    if (!patientSearchQuery.trim()) return true;
    const q = patientSearchQuery.toLowerCase().trim();
    return (
      pat.fullName.toLowerCase().includes(q) ||
      pat.phone.toLowerCase().includes(q) ||
      pat.allergies.toLowerCase().includes(q) ||
      pat.currentMedications.toLowerCase().includes(q) ||
      pat.medicalNotes.toLowerCase().includes(q)
    );
  });

  // Save Doctor Visit Submit
  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDoctorName.trim()) return;

    const pat = patients.find((p) => p.id === visitPatientId);
    const newVisit: DoctorVisit = {
      id: `visit_${Date.now()}`,
      userId: currentUserId,
      patientId: visitPatientId || undefined,
      patientName: pat?.fullName || 'General Profile',
      doctorName: visitDoctorName,
      clinicOrHospital: visitClinic,
      date: visitDate,
      reason: visitReason,
      diagnosisNotes: visitNotes,
      status: 'Scheduled'
    };

    saveVisitsToStorage([newVisit, ...visits]);
    setIsVisitModalOpen(false);
    if (onClearSelectedDoctor) onClearSelectedDoctor();
  };

  return (
    <div className="space-y-6">
      {/* Privacy & Non-diagnostic Banner */}
      <div className="p-3.5 sm:p-4 rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs flex items-start gap-3">
        <div className="p-2 rounded-[4px] bg-[#0E3B36]/10 text-[#0E3B36] shrink-0 mt-0.5">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#5B6577] leading-relaxed">
          <strong className="font-semibold text-[#101827] block sm:inline">Medical Privacy & Record Notice:</strong>{' '}
          Patient records are saved locally under your profile (ID: <span className="font-mono text-[#0E3B36] font-bold">{currentUserId}</span>). Records are not shared across accounts. This is a record-management feature, not a diagnostic system.
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="p-5 sm:p-6 rounded-[4px] bg-white border border-[#E8E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E3B36] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0E3B36]" />
            <span>Patient Health Records & Clinical Profiles</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6577] mt-1">
            Maintain family and patient medical profiles, allergies, medications, photos, and linked doctor visits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsVisitModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border border-[#E8E2D8] bg-white text-xs font-semibold text-[#0E3B36] hover:border-[#B08D57] transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#B08D57]" />
            <span>Log Doctor Visit</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[#0E3B36] hover:bg-[#092824] text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#B08D57]" />
            <span>Add Patient Record</span>
          </button>
        </div>
      </div>

      {/* Error Message Notice if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Patient Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={patientSearchQuery}
          onChange={(e) => setPatientSearchQuery(e.target.value)}
          placeholder="Search your patient records by name, phone, allergies, or notes..."
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E8E2D8] rounded-[4px] text-xs sm:text-sm text-[#101827] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B36]/20"
        />
        {patientSearchQuery && (
          <button
            onClick={() => setPatientSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* PATIENTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6577]">
            Registered Patients ({filteredPatients.length} of {patients.length})
          </h2>
        </div>

        {filteredPatients.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((pat) => (
              <div
                key={pat.id}
                className="p-5 rounded-[4px] bg-white border border-[#E8E2D8] hover:border-[#B08D57] shadow-xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Basic Details */}
                  <div className="flex items-start gap-3">
                    {pat.photoUrl ? (
                      <img
                        src={pat.photoUrl}
                        alt={pat.fullName}
                        className="w-14 h-14 rounded-[4px] object-cover border border-[#E8E2D8] shadow-xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-[4px] bg-[#0E3B36]/10 text-[#0E3B36] flex items-center justify-center font-bold text-lg">
                        {pat.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-base text-[#0E3B36] truncate">
                        {pat.fullName}
                      </h3>
                      <p className="text-xs text-[#5B6577]">
                        {pat.age ? `${pat.age} yrs` : ''} • {pat.gender} {pat.bloodGroup ? `• Blood: ${pat.bloodGroup}` : ''}
                      </p>
                      {pat.phone && (
                        <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-[#0E3B36]" />
                          <span className="truncate">{pat.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges / Medical Tags */}
                  <div className="mt-4 space-y-2 text-xs">
                    {pat.allergies && (
                      <div className="p-2 rounded-[4px] bg-[#FBF8F2] border border-[#E8E2D8] text-stone-800">
                        <span className="font-semibold block text-[10px] uppercase text-[#0E3B36]">
                          Known Allergies
                        </span>
                        <span className="line-clamp-1">{pat.allergies}</span>
                      </div>
                    )}

                    {pat.currentMedications && (
                      <div className="p-2 rounded-[4px] bg-[#FBF8F2] border border-[#E8E2D8] text-stone-800">
                        <span className="font-semibold block text-[10px] uppercase text-[#5B6577]">
                          Current Medications
                        </span>
                        <span className="line-clamp-1">{pat.currentMedications}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setIsViewingPatient(pat)}
                    className="inline-flex items-center gap-1 font-semibold text-[#0E3B36] hover:text-[#B08D57] transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>View Record</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pat)}
                      className="p-1.5 rounded-[4px] text-stone-400 hover:text-[#0E3B36] hover:bg-stone-50 transition"
                      title="Edit patient"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePatient(pat.id)}
                      className="p-1.5 rounded-[4px] text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete patient"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-[4px] bg-white border border-[#E8E2D8]">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#101827]">
              No Patient Profiles Created Yet
            </h3>
            <p className="text-xs text-[#5B6577] mt-1 max-w-sm mx-auto">
              Add yourself or a family member to manage medical histories, known allergies, and doctor visit schedules.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-3 px-4 py-2 rounded-[4px] bg-[#0E3B36] text-white text-xs font-semibold hover:bg-[#092824] transition shadow-xs"
            >
              Add First Patient
            </button>
          </div>
        )}
      </div>

      {/* RECENT DOCTOR VISITS LOG */}
      {visits.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6577]">
              Doctor Appointments & Visit History ({visits.length})
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {visits.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-[4px] bg-white border border-[#E8E2D8] text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101827] text-sm">
                    {v.doctorName}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-[4px] bg-[#FBF8F2] border border-[#E8E2D8] text-[#0E3B36] font-semibold">
                    {v.date}
                  </span>
                </div>
                {v.clinicOrHospital && (
                  <p className="text-[#5B6577]">{v.clinicOrHospital}</p>
                )}
                <p className="text-stone-700">
                  <strong className="font-semibold text-[#101827]">Reason:</strong> {v.reason}
                </p>
                {v.patientName && (
                  <p className="text-[11px] text-[#5B6577]">Patient: {v.patientName}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT PATIENT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0E3B36]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-[4px] shadow-xl border border-[#E8E2D8] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D8] bg-[#FBF8F2]">
              <h3 className="font-bold text-base sm:text-lg text-[#0E3B36] font-serif flex items-center gap-2">
                <User className="w-5 h-5 text-[#B08D57]" />
                <span>{editingPatientId ? 'Edit Patient Record' : 'Add New Patient Record'}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-[4px] text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSavePatient} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Patient Photo Section with Camera / Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[4px] bg-[#FBF8F2] border border-[#E8E2D8]">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(undefined)}
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    Patient Photo / Identity Verification
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Capture patient photo using camera or upload a file.
                  </p>
                  <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo / Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => patientPhotoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      ref={patientPhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePatientPhotoUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="130"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 28"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="">Unknown / Not Tested</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Known Allergies */}
              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Known Allergies (Food, Drug, Environment)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Aspirin, Sulfa drugs"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {/* Current Medications */}
              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Medications & Dosages
                </label>
                <input
                  type="text"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="e.g. Metformin 500mg BID, Amlodipine 5mg OD"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {/* Medical Notes */}
              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Medical Notes / Chronic Conditions
                </label>
                <textarea
                  rows={3}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g. History of mild asthma since childhood. Appendectomy in 2018."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {/* Emergency Contact */}
              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Emergency Contact (Name & Phone)
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Spouse / Brother (+92 300 1234567)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PATIENT DETAILS MODAL */}
      {isViewingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Patient Medical Monograph
              </h3>
              <button
                onClick={() => setIsViewingPatient(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="flex items-center gap-4">
                {isViewingPatient.photoUrl ? (
                  <img
                    src={isViewingPatient.photoUrl}
                    alt={isViewingPatient.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-stone-900 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xl">
                    {isViewingPatient.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    {isViewingPatient.fullName}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {isViewingPatient.age ? `${isViewingPatient.age} years old` : ''} • {isViewingPatient.gender}
                  </p>
                  {isViewingPatient.bloodGroup && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                      Blood: {isViewingPatient.bloodGroup}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Phone</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{isViewingPatient.phone || 'Not provided'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Date of Birth</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{isViewingPatient.dob || 'Not provided'}</span>
                </div>
              </div>

              {isViewingPatient.allergies && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                  <span className="font-bold block uppercase text-[10px] text-rose-600 dark:text-rose-400">
                    Known Allergies
                  </span>
                  <p className="mt-0.5">{isViewingPatient.allergies}</p>
                </div>
              )}

              {isViewingPatient.currentMedications && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold block uppercase text-[10px] text-slate-400">
                    Current Medications
                  </span>
                  <p className="mt-0.5 text-slate-800 dark:text-slate-200">{isViewingPatient.currentMedications}</p>
                </div>
              )}

              {isViewingPatient.medicalNotes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold block uppercase text-[10px] text-slate-400">
                    Medical Notes & History
                  </span>
                  <p className="mt-0.5 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{isViewingPatient.medicalNotes}</p>
                </div>
              )}

              {isViewingPatient.emergencyContact && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200">
                  <span className="font-bold block uppercase text-[10px] text-blue-600 dark:text-blue-400">
                    Emergency Contact
                  </span>
                  <p className="mt-0.5">{isViewingPatient.emergencyContact}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const pat = isViewingPatient;
                  setIsViewingPatient(null);
                  handleOpenEdit(pat);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 text-xs"
              >
                Edit Patient Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOG DOCTOR VISIT MODAL */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span>Log Clinical Doctor Visit</span>
              </h3>
              <button
                onClick={() => {
                  setIsVisitModalOpen(false);
                  if (onClearSelectedDoctor) onClearSelectedDoctor();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Associate with Patient:
                </label>
                <select
                  value={visitPatientId}
                  onChange={(e) => setVisitPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="">General User Profile</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.gender}, {p.age} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  required
                  value={visitDoctorName}
                  onChange={(e) => setVisitDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Ayesha Khan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Clinic or Hospital
                </label>
                <input
                  type="text"
                  value={visitClinic}
                  onChange={(e) => setVisitClinic(e.target.value)}
                  placeholder="e.g. Lahore Heart & Vascular Center"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  placeholder="e.g. Annual cardiovascular checkup & blood pressure review"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Save Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handlePhotoCaptured}
        title="Capture Patient Photo"
        description="Take a clear portrait photo using your device camera or select a photo file."
        guideText="Center face inside frame"
        aspectRatio="square"
      />
    </div>
  );
};
