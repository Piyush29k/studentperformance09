import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, Brain, BarChart3, Users, ShieldCheck, Lightbulb, ArrowRight, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduInsight AI — AI-Based Student Performance Analysis" },
      { name: "description", content: "Monitor, evaluate and predict student academic performance with AI. Built for teachers, students and institutions." },
      { property: "og:title", content: "EduInsight AI — AI-Based Student Performance Analysis" },
      { property: "og:description", content: "Monitor, evaluate and predict student academic performance with AI." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Brain, title: "AI Predictions", desc: "Predict final grades and risk levels from attendance, marks and participation." },
  { icon: BarChart3, title: "Live Analytics", desc: "Beautiful dashboards with class trends, distributions and subject averages." },
  { icon: Users, title: "Role-Based Access", desc: "Tailored views for admins, teachers and students — each sees what matters." },
  { icon: Lightbulb, title: "Smart Recommendations", desc: "Personalized suggestions to lift scores and intervene early." },
  { icon: ShieldCheck, title: "Secure by Design", desc: "Row-level security keeps every student record protected." },
  { icon: Sparkles, title: "Manual or Bulk Entry", desc: "Add students one-by-one with AI predicting outcomes in real time." },
];

const stats = [
  { value: "92.4%", label: "Model accuracy" },
  { value: "30+", label: "Sample students" },
  { value: "5", label: "Input signals" },
  { value: "3", label: "User roles" },
];

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{ background: "var(--gradient-subtle)" }}
          />
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" /> AI-Powered Education Analytics
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Predict student performance{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  before grades slip.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
                EduInsight AI analyzes attendance, marks and participation to
                predict outcomes, flag at-risk students and recommend personalized actions.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/login">
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/features">Explore features</Link>
                </Button>
              </div>
              <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {["No credit card needed", "Role-based dashboards", "Instant AI predictions", "Beautiful reports"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative rounded-2xl border border-border p-6 text-primary-foreground"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="text-xs uppercase tracking-wide opacity-80">Live AI Prediction</div>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-6xl font-bold leading-none">A</span>
                <span className="pb-2 text-sm opacity-80">predicted final grade</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Attendance", val: "88%" },
                  { label: "Quiz Avg", val: "82" },
                  { label: "Internal", val: "79" },
                  { label: "Risk", val: "Low" },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-white/10 p-3 backdrop-blur">
                    <div className="text-[10px] uppercase tracking-wide opacity-80">{m.label}</div>
                    <div className="mt-1 text-lg font-semibold">{m.val}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-lg bg-white/10 p-3 text-xs backdrop-blur">
                <span>Model confidence</span>
                <strong>94%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary">Features</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to drive student success
            </h2>
            <p className="mt-3 text-muted-foreground">
              From data entry to AI-powered insights, EduInsight gives every
              stakeholder a clear path to better outcomes.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="border-border transition-all hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <CardContent className="p-6">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20">
          <div
            className="relative overflow-hidden rounded-2xl border border-border p-10 text-center text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to give your students an edge?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Sign up in seconds and start predicting outcomes from your very first class.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Create your account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
