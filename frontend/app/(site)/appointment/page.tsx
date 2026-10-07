"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from "framer-motion";
import { Phone, CalendarDays, Heart, Sparkles, CheckCircle2, UserRound, Stethoscope } from "lucide-react";
import { AboutBanner } from "@/components/About/AboutBanner";
import api from "@/app/api/api";
import { getApiErrorMessage } from "@/lib/api-error";

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  department?: string | null;
  available: boolean;
}

function AppointmentFormContent() {
  const prefersReducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor") || "";
  const preselectedDept = searchParams.get("dept") || "general";

  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    department: preselectedDept.toLowerCase(),
    doctorId: '',
    doctorName: preselectedDoctor,
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedId, setConfirmedId] = useState('');
  const minimumDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get("/doctors")
      .then((res) => {
        const list: DoctorItem[] = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setDoctors(list);

        // If preselected doctor name is in url, set doctorId and department
        if (preselectedDoctor) {
          const matched = list.find((d) => d.name.toLowerCase() === preselectedDoctor.toLowerCase());
          if (matched) {
            setFormState((prev) => ({
              ...prev,
              doctorId: matched.id,
              doctorName: matched.name,
              department: matched.department ? matched.department.toLowerCase() : prev.department,
            }));
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load doctors list for appointment:", err);
      })
      .finally(() => {
        setLoadingDoctors(false);
      });
  }, [preselectedDoctor]);

  const handleDoctorChange = (doctorId: string) => {
    if (!doctorId) {
      setFormState((prev) => ({ ...prev, doctorId: '', doctorName: '' }));
      return;
    }
    const found = doctors.find((d) => d.id === doctorId);
    if (found) {
      setFormState((prev) => ({
        ...prev,
        doctorId: found.id,
        doctorName: found.name,
        department: found.department ? found.department.toLowerCase() : prev.department,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.post("/appointments", formState);
      if (response.data && response.data.data) {
        setConfirmedId(response.data.data.id || '');
      }
      setIsSubmitted(true);
      setFormState({
        name: '',
        phone: '',
        email: '',
        department: 'general',
        doctorId: '',
        doctorName: '',
        date: '',
        time: '',
        message: ''
      });
    } catch (err: unknown) {
      console.error("Booking submission error:", err);
      const msg = getApiErrorMessage(err, "Error submitting appointment request. Please check your details or call 4446.");
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const instructions = [
    {
      title: "Bring Your Documents",
      desc: "Please remember to bring your national ID card, previous prescriptions, and health insurance card (if applicable)."
    },
    {
      title: "Arrive Early",
      desc: "We recommend arriving 15 minutes before your scheduled appointment slot to complete any check-in paperwork."
    },
    {
      title: "Rescheduling & Cancellation",
      desc: "If you need to change or cancel your slot, please call us on 4446 at least 24 hours in advance."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50/50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-emerald-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Form Column */}
          <motion.div 
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Request a Consultation</h3>
              <p className="text-sm text-slate-500 mb-8">Fill out the quick form below, choose your specialist, and our coordinator will secure your slot.</p>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Booking Request Sent!</h4>
                  <p className="mt-3 text-slate-600 max-w-sm">
                    We have received your details. One of our hospital desk coordinators will contact you shortly to confirm your consultation slot.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setConfirmedId('');
                    }}
                    className="mt-6 rounded-xl bg-[#1e40af] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
                      {errorMessage}
                    </div>
                  )}

                  {/* Doctor & Department selection */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1e40af] uppercase tracking-wider">
                      <Stethoscope className="size-4" />
                      Specialist & Department Selection
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="doctor" className="text-xs font-semibold text-slate-700">Choose Specialist (Optional)</label>
                        <select
                          id="doctor"
                          value={formState.doctorId}
                          onChange={(e) => handleDoctorChange(e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Any Available Specialist</option>
                          {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} — {d.specialty} {d.available ? "(On Duty)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="department" className="text-xs font-semibold text-slate-700">Department</label>
                        <select
                          id="department"
                          value={formState.department}
                          onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100 capitalize"
                        >
                          <option value="general">General Medicine</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="pediatrics">Pediatrics</option>
                          <option value="surgery">Surgery</option>
                          <option value="gynecology">Gynecology</option>
                          <option value="maternity">Maternity & Neonatal</option>
                          <option value="dental care">Dental Care</option>
                          <option value="neurology">Neurology</option>
                          <option value="laboratory">Laboratory</option>
                          <option value="radiology">Radiology</option>
                          <option value="pharmacy">Pharmacy</option>
                          <option value="emergency">Emergency Care</option>
                        </select>
                      </div>
                    </div>

                    {formState.doctorName && (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Selected Doctor: <strong className="font-semibold">{formState.doctorName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patient Name *</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Full Patient Name"
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+252 61..."
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email (Optional)</label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="patient.email@example.com"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preferred Date *</label>
                      <input
                        type="date"
                        id="date"
                        min={minimumDate}
                        required
                        value={formState.date}
                        onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-950 outline-none [color-scheme:light] transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="time" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preferred Time *</label>
                      <input
                        type="time"
                        id="time"
                        required
                        value={formState.time}
                        onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-950 outline-none [color-scheme:light] transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Symptoms / Medical Complaint (Optional)</label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Briefly explain your symptoms or reason for doctor consultation..."
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e40af] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Processing Appointment...</span>
                    ) : (
                      <>
                        <span>Submit Booking Request</span>
                        <CalendarDays className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar Column */}
          <motion.div 
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Quick Contact Card */}
            <div className="rounded-3xl bg-[#1e40af] p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                <Heart className="w-48 h-48" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="size-3 text-emerald-300 fill-emerald-300" />
                Direct Appointment Support
              </span>
              <h4 className="mt-4 text-2xl font-bold">Need Immediate Help Booking?</h4>
              <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                Our coordinators are available on call to help you register or answer questions. Call our toll-free short number directly.
              </p>
              <a 
                href="tel:4446"
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-base font-bold text-[#1e40af] shadow-md transition-all hover:bg-emerald-500 hover:text-white"
              >
                <Phone className="w-5 h-5" />
                Call 4446 Now
              </a>
            </div>

            {/* Instructions list */}
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <h4 className="text-lg font-bold text-slate-900 mb-6">Important Instructions</h4>
              <div className="space-y-6">
                {instructions.map((inst, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{inst.title}</h5>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{inst.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default function AppointmentPage() {
  return (
    <>
      <AboutBanner title="Book an Appointment" breadcrumbPage="Appointment" />
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="size-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }>
        <AppointmentFormContent />
      </Suspense>
    </>
  );
}
