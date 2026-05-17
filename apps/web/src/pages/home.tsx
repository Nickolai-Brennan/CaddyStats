import {
  Badge,
  BarChart,
  Breadcrumbs,
  Button,
  Card,
  Container,
  DataTable,
  EmptyState,
  FormActions,
  FormField,
  FormShell,
  Input,
  LoadingState,
  MetricCard,
  Section,
  Select,
  SeoHead,
  Sparkline,
  Stack,
  Textarea,
  TopNav,
} from "@/components/ui";

interface ModelRow {
  model: string;
  status: string;
  accuracy: string;
}

const modelRows: ModelRow[] = [
  { model: "Scoring Projection", status: "Live", accuracy: "73.2%" },
  { model: "Finish Probability", status: "Live", accuracy: "69.1%" },
  { model: "Ownership Projection", status: "Beta", accuracy: "64.8%" },
];

const chartData = [
  { label: "Round 1", value: 67.8 },
  { label: "Round 2", value: 68.4 },
  { label: "Round 3", value: 68.1 },
  { label: "Round 4", value: 69.0 },
];

export function HomePage() {
  return (
    <Container className="py-10" size="wide">
      <SeoHead
        title="CaddyStats UI Foundation"
        description="Reusable UI primitives, layouts, charts, forms, and SEO components for CaddyStats."
        canonicalUrl="https://caddystats.com/"
      />

      <Stack gap="lg">
        <TopNav
          brand="CaddyStats UI"
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/articles" },
            { label: "Lab", href: "/lab" },
          ]}
          action={<Button variant="secondary">Sign In</Button>}
        />

        <Breadcrumbs items={[{ label: "Home" }, { label: "UI Foundation" }]} />

        <Section
          title="Reusable UI Foundation"
          subtitle="Core primitives and composed components for production pages."
          action={<Badge tone="success">Live</Badge>}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Primitives"
              value={6}
              detail="Button, inputs, badge, skeleton"
              highlighted
            />
            <MetricCard label="Layouts" value={3} detail="Container, section, stack" />
            <MetricCard label="Data Components" value={3} detail="Charts, tables, cards" />
            <MetricCard label="State Components" value={3} detail="Empty, loading, error" />
          </div>
        </Section>

        <Section title="Charts and Tables" subtitle="Reusable building blocks for analytics pages.">
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart title="Sample scoring trend" data={chartData} />
            <Sparkline points={[67.8, 68.4, 68.1, 69.0, 68.6, 68.2]} label="Rolling score trend" />
          </div>

          <DataTable
            caption="Model performance table"
            rows={modelRows}
            rowKey={(row) => row.model}
            columns={[
              { key: "model", header: "Model" },
              { key: "status", header: "Status" },
              { key: "accuracy", header: "Accuracy", align: "right" },
            ]}
          />
        </Section>

        <Section title="Form and Cards" subtitle="Standardized forms and content cards.">
          <div className="grid gap-4 lg:grid-cols-2">
            <FormShell
              title="Request Access"
              description="Reusable form primitives with validation-ready structure."
            >
              <FormField label="Email" htmlFor="home-email" required>
                <Input id="home-email" type="email" placeholder="you@domain.com" />
              </FormField>
              <FormField label="Role" htmlFor="home-role">
                <Select id="home-role" defaultValue="analyst">
                  <option value="analyst">Analyst</option>
                  <option value="editor">Editor</option>
                  <option value="subscriber">Subscriber</option>
                </Select>
              </FormField>
              <FormField label="Notes" htmlFor="home-notes">
                <Textarea
                  id="home-notes"
                  rows={3}
                  placeholder="Tell us what you need from CaddyStats."
                />
              </FormField>
              <FormActions>
                <Button variant="ghost">Cancel</Button>
                <Button type="submit">Submit</Button>
              </FormActions>
            </FormShell>

            <Card
              title="Content card"
              description="Reusable card wrapper for summaries and callouts."
            >
              <p className="text-sm text-slate-300">
                This card can host any module content and optional actions while preserving visual
                consistency across pages.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge>Default</Badge>
                <Badge tone="warning">Beta</Badge>
              </div>
            </Card>
          </div>
        </Section>

        <Section title="State Components" subtitle="Empty and loading states for predictable UX.">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Empty State">
              <EmptyState
                title="No reports yet"
                message="Create your first report to populate this workspace."
                action={<Button>Create report</Button>}
              />
            </Card>
            <Card title="Loading State">
              <LoadingState rows={2} columns={1} message="Loading latest updates..." />
            </Card>
          </div>
        </Section>
      </Stack>
    </Container>
  );
}
