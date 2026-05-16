/**
 * Lab Page — stats overview and model methodology
 *
 * Displays live platform stats from the backend (/stats/overview) and explains
 * the models and methodology in use. No fabricated data — numbers come from the API
 * or are clearly labelled as coming soon.
 */

import { useStatsOverview } from "@/lib/hooks";
import { StatCard } from "@/components/stat-card";
import { ErrorState } from "@/components/error-state";

const MODELS = [
  {
    name: "Strokes Gained Projection Model",
    slug: "sgpm",
    status: "live" as const,
    description:
      "Predicts a player's expected SG:Total for an upcoming round using rolling 12/24/36-round SG splits, course-fit regression, and rest-day adjustments. Outputs a projected score and ±1σ confidence band.",
    inputs: [
      "SG:OTT, SG:APP, SG:ARG, SG:Putt (rolling windows)",
      "Course historical SG splits",
      "Distance off tee vs. course yardage",
      "Recent form (last 8 rounds)",
    ],
    version: "v2.1.0",
  },
  {
    name: "Tournament Finish Probability",
    slug: "tfpm",
    status: "live" as const,
    description:
      "Monte Carlo simulation across 50,000 tournament draws, using the SGPM per-round distributions for each player in the field. Outputs finish probabilities for every position bucket (Win, Top 5, Top 10, Top 20, Make Cut).",
    inputs: [
      "SGPM distributions (per player, per round)",
      "Historical cut-line data",
      "Field composition",
    ],
    version: "v1.8.2",
  },
  {
    name: "Betting Edge Calculator",
    slug: "bec",
    status: "live" as const,
    description:
      "Compares the TFP model's implied probabilities against the sportsbook's vig-adjusted implied probabilities to surface positive expected value opportunities. Edge = model_prob − implied_prob.",
    inputs: ["TFP model output", "Live sportsbook odds (multiple books)", "Vig removal algorithm"],
    version: "v1.3.0",
  },
  {
    name: "DFS Ownership Projection",
    slug: "dop",
    status: "beta" as const,
    description:
      "Estimates DraftKings / FanDuel tournament ownership percentage using salary tier, recent media volume, and SGPM. Calibrated against previous slate ownership data.",
    inputs: [
      "Player salary vs. slate range",
      "Media/social mention velocity",
      "SGPM projection rank within field",
      "Historical DFS slate calibration",
    ],
    version: "v0.9.1-beta",
  },
  {
    name: "AI Editorial Assist",
    slug: "aea",
    status: "beta" as const,
    description:
      "Generates data-grounded draft narratives for tournament previews and player analysis, using only stats injected from the backend. All AI-generated content is flagged for editor review before publication.",
    inputs: [
      "SGPM projections",
      "Player SG history",
      "Tournament course profile",
      "Editor-provided angles",
    ],
    version: "v0.7.0-beta",
  },
];

const STATUS_BADGE: Record<"live" | "beta" | "planned", string> = {
  live: "bg-green-500/20 text-green-400",
  beta: "bg-amber-500/20 text-amber-400",
  planned: "bg-slate-700 text-slate-400",
};

export function LabPage() {
  const { data: stats, isLoading, isError, refetch } = useStatsOverview();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-14 text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
          <span className="text-3xl" aria-hidden>
            🔬
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
          The Lab
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Live platform statistics and full methodology documentation for every model powering
          CaddyStats. No black boxes — every projection is explainable and auditable.
        </p>
      </header>

      {/* Platform Stats */}
      <section aria-labelledby="platform-stats-heading" className="mb-16">
        <h2 id="platform-stats-heading" className="mb-6 text-2xl font-bold text-slate-50">
          Platform Overview
        </h2>

        {isError ? (
          <ErrorState message="Unable to load platform statistics." onRetry={() => refetch()} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Players"
              value={isLoading ? null : stats?.total_players}
              description="Players in the database"
              highlight
            />
            <StatCard
              label="Active Players"
              value={isLoading ? null : stats?.active_players}
              description="Currently active this season"
            />
            <StatCard
              label="Tournaments This Season"
              value={isLoading ? null : stats?.tournaments_this_season}
              description="Tournaments tracked in current season"
            />
            <StatCard
              label="Models Live"
              value={MODELS.filter((m) => m.status === "live").length}
              description="Production-grade analytical models"
            />
          </div>
        )}
      </section>

      {/* Model documentation */}
      <section aria-labelledby="models-heading">
        <h2 id="models-heading" className="mb-2 text-2xl font-bold text-slate-50">
          Model Documentation
        </h2>
        <p className="mb-8 text-sm text-slate-400">
          All models are versioned. Inputs are logged with each projection run. Confidence scores
          reflect model calibration against historical outcomes.
        </p>

        <div className="space-y-6">
          {MODELS.map((model) => (
            <article
              key={model.slug}
              aria-labelledby={`model-${model.slug}-name`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                      id={`model-${model.slug}-name`}
                      className="text-lg font-bold text-slate-100"
                    >
                      {model.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE[model.status]}`}
                    >
                      {model.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{model.version}</p>
                </div>
              </div>

              <p className="mb-5 text-sm text-slate-300 leading-relaxed">{model.description}</p>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Model Inputs
                </h4>
                <ul className="space-y-1">
                  {model.inputs.map((input) => (
                    <li key={input} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-0.5 text-amber-500 font-bold text-xs" aria-hidden>
                        ▸
                      </span>
                      {input}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Data integrity note */}
      <aside className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-sm font-semibold text-slate-300">Data Integrity Commitment</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          CaddyStats never fabricates statistics, betting lines, tournament fields, or injury
          information. All projections are clearly labelled as model output and distinguish computed
          values from official source data. If a data source is unavailable, we show an empty state
          rather than an estimate.
        </p>
      </aside>
    </div>
  );
}
