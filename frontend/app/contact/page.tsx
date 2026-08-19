"use client"

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin, Clock3, Mail, Send, CheckCircle2, ArrowUpRight } from "lucide-react";
import { AboutBanner } from "@/components/About/AboutBanner";

export default function ContactPage() {
  const prefersReducedMotion = useReducedMotion();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfos = [
    {
      icon: Phone,
      title: "Call Us",
      value: "4446",
      desc: "Emergency line, active 24/7 for critical care.",
      href: "tel:4446",
      color: "text-[#1e40af]",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "info@albirri.so",
      desc: "Send us a message for general questions or business inquiries.",
      href: "mailto:info@albirri.so",
      color: "text-[#10b981]",
      bg: "bg-emerald-50"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "KM14 Afgoi Road",
      desc: "Mogadishu, Somalia. Located in a prime area.",
      href: "#hospital-location",
      color: "text-[#1e40af]",
      bg: "bg-blue-50"
    },
    {
      icon: Clock3,
      title: "Working Hours",
      value: "Open 24 Hours",
      desc: "Emergency and inpatient services are open round-the-clock.",
      href: "#",
      color: "text-[#10b981]",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <>
      <AboutBanner title="Contact Us" breadcrumbPage="Contact" />

      <section className="relative overflow-hidden bg-slate-50/50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full bg-emerald-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Contact details */}
            <motion.div 
              initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#10b981]">
                GET IN TOUCH
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                We&apos;re Here to Help You and Your Family
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Have questions or need assistance? Please don&apos;t hesitate to reach out. Our professional team is always ready to support you.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {contactInfos.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className={`rounded-xl p-3 ${info.bg} ${info.color} shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{info.title}</h3>
                        {info.href !== "#" ? (
                          <a href={info.href} className="mt-1 block font-semibold text-slate-800 hover:text-[#1e40af] transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="mt-1 font-semibold text-slate-800">{info.value}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{info.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact form card */}
            <motion.div 
              initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Send Message</h3>
                <p className="text-sm text-slate-500 mb-8">Feel free to drop us a line and we will reply as soon as possible.</p>
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-4 animate-bounce">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Thank You!</h4>
                    <p className="mt-2 text-slate-600 max-w-sm">Your message has been successfully sent. We will contact you shortly.</p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 rounded-xl bg-[#1e40af] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Your Name"
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        placeholder="What is this regarding?"
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-xs font-bold text-slate-800 uppercase tracking-wider">Message</label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Your Message..."
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#1e40af] focus:ring-4 focus:ring-blue-100 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e40af] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

          </div>

          <motion.div
            id="hospital-location"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="mt-16 scroll-mt-28 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.09)] sm:mt-20 lg:grid lg:grid-cols-[0.72fr_1.28fr]"
          >
            <div className="relative overflow-hidden bg-[#0d245f] p-7 text-white sm:p-10 lg:flex lg:flex-col lg:justify-between lg:p-12">
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 size-56 rounded-full bg-blue-400/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -left-20 size-56 rounded-full bg-emerald-400/15 blur-3xl"
              />

              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-950/20">
                  <MapPin aria-hidden="true" className="size-6" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Find our hospital
                </p>
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Visit Albirri Hospital</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-blue-100/80 sm:text-base">
                  We are conveniently located on KM14 Afgoi Road in Mogadishu. Use the map to find the easiest route to our hospital.
                </p>
              </div>

              <div className="relative mt-8 border-t border-white/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200/70">Hospital address</p>
                <p className="mt-2 font-semibold text-white">KM14 Afgoi Road, Mogadishu, Somalia</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Albirri+Hospital+KM14+Afgoi+Road+Mogadishu+Somalia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
                >
                  Open in Google Maps
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>

            <div className="relative min-h-[26rem] bg-slate-100 sm:min-h-[32rem]">
              <iframe
                title="Albirri Hospital location on Google Maps"
                src="https://www.google.com/maps?q=Albirri+Hospital,+KM14+Afgoi+Road,+Mogadishu,+Somalia&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
