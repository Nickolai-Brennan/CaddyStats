/**
 * Lab Page — stats overview and model methodology
 *
 * Displays live platform stats from the backend (/stats/overview) and explains
 * the models and methodology in use. No fabricated data — numbers come from the API
 * or are clearly labelled as coming soon.
 */

import {
  AppShell,
  DashboardActionRegion,
  DashboardChartRegion,
  DashboardDataRegion,
  DashboardGrid,
  DashboardHeroMetrics,
  DashboardToolbar,
} from "@/components/layout";
import { ErrorState } from "@/components/error-state";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui";
import { useStatsOverview } from "@/lib/hooks";

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
    <AppShell
      sidebar={
        <nav aria-label="Lab navigation" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lab Sections</p>
          <a href="#toolbar" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Controls
          </a>
          <a href="#hero" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Overview
          </a>
          <a href="#charts" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Model Cards
          </a>
          <a href="#data" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Inputs
          </a>
          <a href="#actions" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Integrity
          </a>
        </nav>
      }
      contextPanel={
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-200">DS-3 Runtime</h2>
          <p className="text-sm text-slate-400">
            This page runs the DS-3 layout primitives with sidebar, dashboard regions, and a
            responsive 12/8/4 grid.
          </p>
        </div>
      }
      footer={
        <p className="text-xs text-slate-500">
          DS-3 layout standard active on this page: shell + toolbar + hero + chart + data + action
          regions.
        </p>
      }
    >
      <DashboardGrid columns={12}>
        <DashboardToolbar
          id="toolbar"
          title="The Lab"
          description="Live platform stats and full methodology documentation for CaddyStats models."
          action={
            <Button type="button" variant="secondary" onClick={() => refetch()}>
              Refresh Overview
            </Button>
          }
        >
          <p className="text-sm text-slate-400">
            No black boxes — every projection is explainable and auditable.
          </p>
        </DashboardToolbar>

        <DashboardHeroMetrics id="hero" title="Platform Overview">
          {isError ? (
            <ErrorState message="Unable to load platform statistics." onRetry={() => refetch()} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </DashboardHeroMetrics>

        <DashboardChartRegion
          id="charts"
          title="Model Documentation"
          description="Versioned model summaries with explicit status labels."
        >
          <div className="space-y-4">
            {MODELS.map((model) => (
              <article
                key={model.slug}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                aria-labelledby={`model-${model.slug}-name`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 id={`model-${model.slug}-name`} className="text-sm font-semibold text-slate-100">
                    {model.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_BADGE[model.status]}`}
                  >
                    {model.status}
                  </span>
                  <span className="text-xs text-slate-500">{model.version}</span>
                </div>
                <p className="text-sm text-slate-300">{model.description}</p>
              </article>
            ))}
          </div>
        </DashboardChartRegion>

        <DashboardDataRegion
          id="data"
          title="Model Inputs"
          description="All model inputs are explicit and reviewable."
        >
          <div className="space-y-4">
            {MODELS.map((model) => (
              <section key={`${model.slug}-inputs`} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-100">{model.name}</h3>
                <ul className="space-y-1">
                  {model.inputs.map((input) => (
                    <li key={input} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-0.5 text-amber-500 text-xs" aria-hidden>
                        ▸
                      </span>
                      {input}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </DashboardDataRegion>

        <DashboardActionRegion
          id="actions"
          title="Data Integrity"
          description="Operational guardrails for analytics and editorial output."
        >
          <p className="text-sm leading-relaxed text-slate-400">
            CaddyStats never fabricates statistics, betting lines, tournament fields, or injury
            information. Model output is always distinguished from verified source data.
          </p>
        </DashboardActionRegion>
      </DashboardGrid>
    </AppShell>
  );
}
