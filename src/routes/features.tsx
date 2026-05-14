import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain, BarChart3, Users, Lightbulb, ShieldCheck, Sparkles, FileBarChart, CalendarCheck, Target,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — EduInsight AI" },
      { name: "description", content: "Explore EduInsight AI's features: predictions, dashboards, role-based access, reports and more." },
      { property: "og:title", content: "Features — EduInsight AI" },
      { property: "og:description", content: "Predictions, dashboards, role-based access, reports and more." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: Brain, title: "AI Grade Prediction", desc: "Random Forest model predicts final grade and confidence from 5 input signals." },
  { icon: BarChart3, title: "Live Dashboards", desc: "Real-time KPIs, performance trends and grade distribution visualizations." },
  { icon: Users, title: "Role-Based Access", desc: "Distinct experiences for admins, teachers and students with secure RLS." },
  { icon: Lightbulb, title: "Recommendations", desc: "Per-student suggestions ordered by predicted impact on the final grade." },
  { icon: FileBarChart, title: "Downloadable Reports", desc: "Semester summaries, attendance analytics and at-risk reports as PDF/XLSX." },
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "Monitor attendance trends and correlate them with academic outcomes." },
  { icon: Target, title: "Risk Flagging", desc: "Automatically identifies low / medium / high risk students for early intervention." },
  { icon: ShieldCheck, title: "Secure Storage", desc: "Row-level security policies protect every student profile and grade record." },
  { icon: Sparkles, title: "Manual Data Entry", desc: "Add students one-by-one with AI previewing predictions as you type." },
];

function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 py-16 text-center md:py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Built for every stage of the academic journey
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From manual data entry to full institutional analytics, EduInsight AI
            covers every step with intelligent automation.
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
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
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 pb-20 text-center">
          <Button asChild size="lg">
            <Link to="/login">Try it now</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
