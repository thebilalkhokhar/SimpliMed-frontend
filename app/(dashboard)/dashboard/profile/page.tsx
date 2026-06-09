"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  linkedReport: string;
  status: "active" | "completed";
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mock initial state
───────────────────────────────────────────────────────────────────────────── */
const INITIAL_PROFILE = {
  firstName:   "Alex",
  lastName:    "Kim",
  email:       "alex@simplimed.ai",
  age:         "34",
  sex:         "male",
  bloodType:   "O+",
  height:      "175",   // cm
  weight:      "72",    // kg
  conditions:  "Prediabetes, Mild Anaemia",
  allergies:   "Penicillin",
  emergencyName:     "Sarah Kim",
  emergencyRelation: "Spouse",
  emergencyPhone:    "+1 (555) 012-3456",
};

const INITIAL_MEDS: Medication[] = [
  { id: "m1", name: "Metformin",     dose: "500 mg",  frequency: "Twice daily",   duration: "Ongoing", linkedReport: "Fasting Glucose & HbA1c", status: "active"    },
  { id: "m2", name: "Lisinopril",    dose: "10 mg",   frequency: "Once daily",    duration: "6 months", linkedReport: "Comprehensive Metabolic Panel", status: "active" },
  { id: "m3", name: "Atorvastatin",  dose: "20 mg",   frequency: "Once at night", duration: "Ongoing", linkedReport: "Lipid Profile",           status: "active"    },
  { id: "m4", name: "Levothyroxine", dose: "50 mcg",  frequency: "Once daily",    duration: "Ongoing", linkedReport: "Thyroid Function",         status: "active"    },
  { id: "m5", name: "Ibuprofen",     dose: "400 mg",  frequency: "As needed",     duration: "7 days",  linkedReport: "—",                        status: "completed" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Helper — labelled field for display mode
───────────────────────────────────────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{value || "—"}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helper — editable input field
───────────────────────────────────────────────────────────────────────────── */
function EditField({
  label, id, value, onChange, type = "text", placeholder = "", hint,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold"
        style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input text-sm"
      />
      {hint && <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section card wrapper
───────────────────────────────────────────────────────────────────────────── */
function Section({
  title, icon, children, action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b px-5 py-4"
        style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
            {icon}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{title}</p>
        </div>
        {action}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Add Medication Modal
───────────────────────────────────────────────────────────────────────────── */
function AddMedModal({ onAdd, onClose }: {
  onAdd: (m: Omit<Medication, "id" | "status">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "", dose: "", frequency: "", duration: "", linkedReport: "",
  });

  function set(k: keyof typeof form) {
    return (v: string) => setForm((p) => ({ ...p, [k]: v }));
  }

  function handleAdd() {
    if (!form.name.trim() || !form.dose.trim()) return;
    onAdd(form);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(3px)" }}
        onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-x-4 top-1/2 z-50 max-w-md -translate-y-1/2 rounded-2xl border shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Add Medication</p>
          <button onClick={onClose} className="rounded-lg p-1"
            style={{ color: "var(--color-text-muted)" }} aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5">
          <EditField label="Medication name *" id="m-name" value={form.name} onChange={set("name")} placeholder="e.g. Metformin" />
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Dose *" id="m-dose" value={form.dose} onChange={set("dose")} placeholder="e.g. 500 mg" />
            <EditField label="Frequency" id="m-freq" value={form.frequency} onChange={set("frequency")} placeholder="e.g. Twice daily" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="Duration" id="m-dur" value={form.duration} onChange={set("duration")} placeholder="e.g. Ongoing" />
            <EditField label="Linked Report" id="m-rep" value={form.linkedReport} onChange={set("linkedReport")} placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
            <button onClick={handleAdd} className="btn-primary px-4 py-2 text-sm font-semibold">Add Medication</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [profile, setProfile]   = useState(INITIAL_PROFILE);
  const [meds, setMeds]         = useState<Medication[]>(INITIAL_MEDS);
  const [editingPersonal, setEditingPersonal]   = useState(false);
  const [editingHealth, setEditingHealth]       = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(false);
  const [showAddMed, setShowAddMed]             = useState(false);
  const [savedToast, setSavedToast]             = useState(false);
  const [removingId, setRemovingId]             = useState<string | null>(null);

  /* ── Derived ── */
  const bmi = profile.height && profile.weight
    ? (Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2)).toFixed(1)
    : "—";

  const bmiLabel =
    bmi === "—" ? "—" :
    Number(bmi) < 18.5 ? "Underweight" :
    Number(bmi) < 25 ? "Normal" :
    Number(bmi) < 30 ? "Overweight" : "Obese";

  const bmiColor =
    bmi === "—" ? "var(--color-text-muted)" :
    Number(bmi) < 18.5 ? "var(--color-info-text)" :
    Number(bmi) < 25 ? "var(--color-normal-text)" :
    Number(bmi) < 30 ? "#D97706" : "var(--color-abnormal-text)";

  function set(k: keyof typeof profile) {
    return (v: string) => setProfile((p) => ({ ...p, [k]: v }));
  }

  function showSaved() {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  }

  function addMed(m: Omit<Medication, "id" | "status">) {
    setMeds((prev) => [
      ...prev,
      { ...m, id: `m-${Date.now()}`, status: "active" },
    ]);
  }

  function removeMed(id: string) {
    setRemovingId(id);
    setTimeout(() => {
      setMeds((prev) => prev.filter((m) => m.id !== id));
      setRemovingId(null);
    }, 350);
  }

  const activeMeds    = meds.filter((m) => m.status === "active");
  const completedMeds = meds.filter((m) => m.status === "completed");

  return (
    <>
      {/* Add medication modal */}
      {showAddMed && <AddMedModal onAdd={addMed} onClose={() => setShowAddMed(false)} />}

      {/* Save toast */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-5 py-3 shadow-lg"
          style={{ backgroundColor: "var(--color-bg-base)", borderColor: "var(--color-normal-border)" }}>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="var(--color-normal-bg)" stroke="var(--color-normal-border)" />
              <path d="M5 8l2 2 4-4" stroke="var(--color-normal-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium" style={{ color: "var(--color-normal-text)" }}>
              Changes saved
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 pb-10">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Health Profile
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Your personal health record — kept private and secure.
          </p>
        </div>

        {/* ── Profile hero card ── */}
        <div className="card p-6">
          <div className="flex flex-wrap items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
                style={{ backgroundColor: "var(--color-brand)", color: "var(--color-text-inverse)" }}>
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <button
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-white"
                style={{ backgroundColor: "var(--color-brand)", borderColor: "var(--color-bg-base)" }}
                aria-label="Change avatar"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M9 1.5L10.5 3 4.5 9H3V7.5L9 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{profile.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: "var(--color-normal-bg)", color: "var(--color-normal-text)", border: "1px solid var(--color-normal-border)" }}>
                  Pro Plan
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Age {profile.age} · {profile.sex === "male" ? "Male" : profile.sex === "female" ? "Female" : profile.sex}
                </span>
              </div>
            </div>

            {/* BMI pill */}
            <div className="flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 text-center"
              style={{ borderColor: "var(--color-border)", minWidth: 90 }}>
              <p className="text-2xl font-bold" style={{ color: bmiColor }}>{bmi}</p>
              <p className="text-[10px] font-semibold" style={{ color: bmiColor }}>{bmiLabel}</p>
              <p className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>BMI</p>
            </div>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <Section
          title="Personal Information"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
          action={
            <button
              onClick={() => {
                if (editingPersonal) showSaved();
                setEditingPersonal(!editingPersonal);
              }}
              className={editingPersonal ? "btn-primary px-3 py-1.5 text-xs" : "btn-secondary px-3 py-1.5 text-xs"}
            >
              {editingPersonal ? "Save Changes" : "Edit"}
            </button>
          }
        >
          {editingPersonal ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <EditField label="First Name" id="firstName" value={profile.firstName} onChange={set("firstName")} />
                <EditField label="Last Name"  id="lastName"  value={profile.lastName}  onChange={set("lastName")}  />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <EditField label="Email" id="email" type="email" value={profile.email} onChange={set("email")} />
                <EditField label="Age"   id="age"   type="number" value={profile.age} onChange={set("age")} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="sex" className="text-xs font-semibold"
                    style={{ color: "var(--color-text-secondary)" }}>Biological Sex</label>
                  <select id="sex" value={profile.sex}
                    onChange={(e) => set("sex")(e.target.value)}
                    className="input text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <InfoRow label="First Name"     value={profile.firstName} />
              <InfoRow label="Last Name"      value={profile.lastName}  />
              <InfoRow label="Email"          value={profile.email}     />
              <InfoRow label="Age"            value={profile.age}       />
              <InfoRow label="Biological Sex" value={profile.sex === "male" ? "Male" : profile.sex === "female" ? "Female" : profile.sex} />
            </div>
          )}
        </Section>

        {/* ── Health Baseline ── */}
        <Section
          title="Health Baseline"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C8 2 3 7.5 3 10a5 5 0 0 0 10 0C13 7.5 8 2 8 2Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          }
          action={
            <button
              onClick={() => {
                if (editingHealth) showSaved();
                setEditingHealth(!editingHealth);
              }}
              className={editingHealth ? "btn-primary px-3 py-1.5 text-xs" : "btn-secondary px-3 py-1.5 text-xs"}
            >
              {editingHealth ? "Save Changes" : "Edit"}
            </button>
          }
        >
          {editingHealth ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <EditField label="Blood Type"   id="bloodType" value={profile.bloodType} onChange={set("bloodType")} placeholder="e.g. O+" />
                <EditField label="Height (cm)"  id="height"    type="number" value={profile.height}  onChange={set("height")}    placeholder="175" />
                <EditField label="Weight (kg)"  id="weight"    type="number" value={profile.weight}  onChange={set("weight")}    placeholder="70"  />
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>BMI (auto)</p>
                  <div className="input flex items-center text-sm font-bold"
                    style={{ color: bmiColor }}>{bmi} <span className="ml-1 text-xs font-normal text-slate-400">({bmiLabel})</span></div>
                </div>
              </div>
              <EditField label="Chronic Conditions / Diagnoses" id="conditions"
                value={profile.conditions} onChange={set("conditions")}
                placeholder="e.g. Prediabetes, Hypertension"
                hint="Separate multiple conditions with commas" />
              <EditField label="Known Allergies" id="allergies"
                value={profile.allergies} onChange={set("allergies")}
                placeholder="e.g. Penicillin, Peanuts"
                hint="Separate multiple allergies with commas" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <InfoRow label="Blood Type"   value={profile.bloodType}  />
              <InfoRow label="Height"       value={profile.height ? `${profile.height} cm` : "—"} />
              <InfoRow label="Weight"       value={profile.weight ? `${profile.weight} kg` : "—"} />
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>BMI</p>
                <p className="text-sm font-bold" style={{ color: bmiColor }}>{bmi} <span className="font-normal text-slate-400 text-xs">({bmiLabel})</span></p>
              </div>
              <div className="col-span-2">
                <InfoRow label="Chronic Conditions" value={profile.conditions} />
              </div>
              <div className="col-span-2">
                <InfoRow label="Known Allergies" value={profile.allergies} />
              </div>
            </div>
          )}
        </Section>

        {/* ── Medication Tracker ── */}
        <Section
          title="Medication Tracker"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="12" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 6v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
          action={
            <button onClick={() => setShowAddMed(true)}
              className="btn-primary gap-1.5 px-3 py-1.5 text-xs">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Add
            </button>
          }
        >
          {/* Active */}
          <div className="flex flex-col gap-2">
            {activeMeds.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No active medications.</p>
            )}
            {activeMeds.map((med) => (
              <div key={med.id}
                className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${removingId === med.id ? "opacity-0 scale-95" : "opacity-100"}`}
                style={{ backgroundColor: "var(--color-bg-subtle)", borderColor: "var(--color-border)" }}>

                {/* Pill icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--color-normal-bg)", border: "1px solid var(--color-normal-border)" }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2" y="6" width="12" height="5" rx="2.5" stroke="var(--color-normal-text)" strokeWidth="1.4" />
                    <path d="M8 6v5" stroke="var(--color-normal-text)" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{med.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {med.dose} · {med.frequency} · {med.duration}
                  </p>
                  {med.linkedReport !== "—" && (
                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--color-brand)" }}>
                      📋 {med.linkedReport}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge-normal">Active</span>
                  <button
                    onClick={() => removeMed(med.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150"
                    style={{ color: "var(--color-text-muted)" }}
                    aria-label={`Remove ${med.name}`}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-abnormal-bg)";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-abnormal-text)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 4h10M5 4V3h4v1M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.3A1 1 0 0 0 4.7 12h4.6a1 1 0 0 0 1-.7L11 4"
                        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed */}
          {completedMeds.length > 0 && (
            <div className="mt-4">
              <p className="section-label mb-2">Completed Courses</p>
              <div className="flex flex-col gap-2">
                {completedMeds.map((med) => (
                  <div key={med.id}
                    className="flex items-center gap-3 rounded-xl border px-4 py-3 opacity-60"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--color-bg-overlay)" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7l4 4 6-6" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-through" style={{ color: "var(--color-text-muted)" }}>{med.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{med.dose} · {med.duration}</p>
                    </div>
                    <span className="badge-info">Done</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Emergency Contact ── */}
        <Section
          title="Emergency Contact"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 2V4a1 1 0 0 1 1-1Z"
                stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          }
          action={
            <button
              onClick={() => {
                if (editingEmergency) showSaved();
                setEditingEmergency(!editingEmergency);
              }}
              className={editingEmergency ? "btn-primary px-3 py-1.5 text-xs" : "btn-secondary px-3 py-1.5 text-xs"}
            >
              {editingEmergency ? "Save Changes" : "Edit"}
            </button>
          }
        >
          {editingEmergency ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <EditField label="Full Name"    id="ec-name" value={profile.emergencyName}     onChange={set("emergencyName")}     placeholder="e.g. Sarah Kim" />
              <EditField label="Relationship" id="ec-rel"  value={profile.emergencyRelation} onChange={set("emergencyRelation")} placeholder="e.g. Spouse" />
              <EditField label="Phone Number" id="ec-ph"   type="tel" value={profile.emergencyPhone} onChange={set("emergencyPhone")} placeholder="+1 (555) 000-0000" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <InfoRow label="Full Name"    value={profile.emergencyName}     />
              <InfoRow label="Relationship" value={profile.emergencyRelation} />
              <InfoRow label="Phone"        value={profile.emergencyPhone}    />
            </div>
          )}
        </Section>

        {/* ── Account & Security ── */}
        <Section
          title="Account & Security"
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        >
          <div className="flex flex-col gap-3">
            {/* Change password */}
            <div className="flex items-center justify-between rounded-xl border px-4 py-3"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Password</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Last changed 3 months ago</p>
              </div>
              <button className="btn-secondary px-3 py-1.5 text-xs">Change Password</button>
            </div>

            {/* Connected account */}
            <div className="flex items-center justify-between rounded-xl border px-4 py-3"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-base)" }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Google Account</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{profile.email}</p>
                </div>
              </div>
              <span className="badge-normal">Connected</span>
            </div>

            {/* Two-factor */}
            <div className="flex items-center justify-between rounded-xl border px-4 py-3"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  Two-Factor Authentication
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Not enabled — add an extra layer of security</p>
              </div>
              <button className="btn-secondary px-3 py-1.5 text-xs">Enable 2FA</button>
            </div>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="mb-1 text-sm font-bold text-rose-800">Danger Zone</p>
          <p className="mb-4 text-xs text-rose-600">
            Deleting your account permanently removes all your reports, analyses, and health data.
            This action cannot be undone.
          </p>
          <button
            className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            onClick={() => {
              if (window.confirm("Are you sure? This will permanently delete your account and all data.")) {
                // stub
              }
            }}
          >
            Delete My Account
          </button>
        </div>

      </div>
    </>
  );
}
