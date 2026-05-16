/**
 * Contact Page — accessible contact form (mailto-backed) and social/support links
 *
 * The form uses a mailto action as a lightweight contact mechanism that does not
 * require a dedicated backend endpoint at this phase. When a real contact API is
 * wired up, replace the form action and submission handler accordingly.
 */

import { useState, FormEvent } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: "", email: "", subject: "", message: "" };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Your name is required.";
    if (!form.email.trim()) {
      errs.email = "Your email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) errs.subject = "A subject is required.";
    if (!form.message.trim()) errs.message = "Please enter your message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Compose a mailto link as the current contact mechanism
    const mailto =
      `mailto:hello@caddystats.io` +
      `?subject=${encodeURIComponent(`[CaddyStats] ${form.subject}`)}` +
      `&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const SUBJECTS = [
    "General Inquiry",
    "Data Question",
    "Model Methodology",
    "Subscription / Billing",
    "Press & Media",
    "Partnership",
    "Bug Report",
    "Other",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Questions about our data, models, or platform? We'd love to hear from you.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Contact form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-10 text-center">
              <div className="mb-4 text-5xl" aria-hidden>
                ✉️
              </div>
              <h2 className="mb-2 text-xl font-bold text-green-400">Message sent!</h2>
              <p className="text-sm text-slate-400">
                Thanks for reaching out. We'll follow up at the email address you provided.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm(INITIAL_FORM);
                }}
                className="mt-6 rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Name{" "}
                  <span aria-hidden className="text-red-400">
                    *
                  </span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  aria-required
                  aria-describedby={errors.name ? "contact-name-err" : undefined}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-100 bg-slate-900 placeholder-slate-600 focus:outline-none focus-visible:ring-1 transition-colors ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-700 focus:border-amber-500 focus-visible:ring-amber-500"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p id="contact-name-err" role="alert" className="mt-1 text-xs text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Email{" "}
                  <span aria-hidden className="text-red-400">
                    *
                  </span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-required
                  aria-describedby={errors.email ? "contact-email-err" : undefined}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-100 bg-slate-900 placeholder-slate-600 focus:outline-none focus-visible:ring-1 transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-700 focus:border-amber-500 focus-visible:ring-amber-500"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="contact-email-err" role="alert" className="mt-1 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Subject{" "}
                  <span aria-hidden className="text-red-400">
                    *
                  </span>
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  aria-required
                  aria-describedby={errors.subject ? "contact-subject-err" : undefined}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-100 bg-slate-900 focus:outline-none focus-visible:ring-1 transition-colors ${
                    errors.subject
                      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-700 focus:border-amber-500 focus-visible:ring-amber-500"
                  }`}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p id="contact-subject-err" role="alert" className="mt-1 text-xs text-red-400">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Message{" "}
                  <span aria-hidden className="text-red-400">
                    *
                  </span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  aria-required
                  aria-describedby={errors.message ? "contact-message-err" : undefined}
                  placeholder="Tell us what's on your mind…"
                  className={`w-full resize-y rounded-lg border px-3 py-2.5 text-sm text-slate-100 bg-slate-900 placeholder-slate-600 focus:outline-none focus-visible:ring-1 transition-colors ${
                    errors.message
                      ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-700 focus:border-amber-500 focus-visible:ring-amber-500"
                  }`}
                />
                {errors.message && (
                  <p id="contact-message-err" role="alert" className="mt-1 text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Sidebar info */}
        <aside className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Email
            </h2>
            <a
              href="mailto:hello@caddystats.io"
              className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
            >
              hello@caddystats.io
            </a>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Response Time
            </h2>
            <p className="text-sm text-slate-300">
              We aim to respond to all inquiries within 2 business days.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Other Resources
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-slate-300 hover:text-amber-400 transition-colors">
                  About CaddyStats
                </a>
              </li>
              <li>
                <a href="/lab" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Stats Lab &amp; Models
                </a>
              </li>
              <li>
                <a
                  href="/articles"
                  className="text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Analysis &amp; Articles
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
