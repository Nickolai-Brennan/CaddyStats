/**
 * About Page — CaddyStats mission, platform description, and data-first manifesto
 */

import { Link } from "@tanstack/react-router";

const VALUES = [
  {
    icon: "📊",
    title: "Data-First",
    description:
      "Every number on CaddyStats is sourced from verified PGA Tour data, official statistics, and transparent model calculations. We never fabricate a stat.",
  },
  {
    icon: "🔬",
    title: "Model Transparency",
    description:
      "Our projection and betting-edge models expose their inputs, confidence intervals, and version history. You can see exactly how a number was produced.",
  },
  {
    icon: "🎯",
    title: "Professional Grade",
    description:
      "Built for serious golf analysts, DFS players, sports bettors, and journalists who need reliable, reproducible analytics — not opinion dressed as data.",
  },
  {
    icon: "⚡",
    title: "Real-Time Ready",
    description:
      "Live leaderboard integration, in-round strokes-gained updates, and live odds ingestion mean the platform reflects what is happening on the course right now.",
  },
];

const FEATURES = [
  "Player SG deep-dives across 5+ seasons",
  "Course-fit scoring for upcoming fields",
  "AI-assisted tournament preview generation grounded in real stats",
  "Betting edge calculator with implied probability breakdown",
  "DFS ownership projections per slate",
  "Historical model performance tracking",
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Hero */}
      <header className="mb-16 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600">
          <span className="text-3xl" aria-hidden>
            ⛳
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          About CaddyStats
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400 leading-relaxed">
          CaddyStats is a production-grade golf analytics platform built for professionals who
          demand accurate data, reproducible models, and editorial content grounded in verified
          statistics — not speculation.
        </p>
      </header>

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="mb-16">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 id="mission-heading" className="mb-4 text-xl font-bold text-amber-400">
            Our Mission
          </h2>
          <p className="text-slate-300 leading-relaxed">
            To build the most analytically rigorous, data-transparent golf intelligence platform
            available. We combine advanced strokes-gained models, tournament projection engines,
            market-edge calculations, and AI-assisted editorial workflows to give golf professionals
            a single source of truth — always backed by real data.
          </p>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="mb-16">
        <h2 id="values-heading" className="mb-8 text-2xl font-bold text-slate-50">
          What We Stand For
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-3 text-3xl" aria-hidden>
                {v.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="mb-16">
        <h2 id="features-heading" className="mb-6 text-2xl font-bold text-slate-50">
          Platform Capabilities
        </h2>
        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-slate-300 text-sm">
              <span className="mt-0.5 text-amber-400 font-bold" aria-hidden>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="mb-4 text-xl font-semibold text-slate-50">Ready to dig into the data?</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/articles"
            className="rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Read Analysis
          </Link>
          <Link
            to="/lab"
            className="rounded-lg border border-slate-700 px-6 py-2.5 font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Explore the Lab
          </Link>
          <Link
            to="/contact"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
