import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EduInsight AI" },
      { name: "description", content: "Our mission is to help every student succeed through transparent, AI-powered academic insights." },
      { property: "og:title", content: "About EduInsight AI" },
      { property: "og:description", content: "Our mission is to help every student succeed through AI-powered academic insights." },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  { icon: Target, title: "Our Mission", desc: "Empower every teacher and student with timely, actionable insights into academic performance." },
  { icon: Eye, title: "Our Vision", desc: "A world where no student falls behind unnoticed — AI catches the early signals teachers can't." },
  { icon: Heart, title: "Our Values", desc: "Privacy, transparency and impact. Every prediction is explainable, every record protected." },
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 py-16 md:py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About EduInsight AI</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            EduInsight AI is a smart educational analytics platform built to
            transform how institutions monitor and improve student performance.
            By combining classroom data with machine learning, we surface the
            patterns that lead to better outcomes — for every student.
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title} className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <CardContent className="p-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 pb-20">
          <h2 className="text-2xl font-bold tracking-tight">The story</h2>
          <div className="prose mt-4 max-w-none text-muted-foreground">
            <p>
              EduInsight started as a final-year academic project exploring how
              classical machine learning could predict student outcomes from
              everyday classroom signals — attendance, assignments, internal
              marks, quizzes and participation.
            </p>
            <p className="mt-3">
              Today it has grown into a complete analytics workspace with
              role-based access for admins, teachers and students, beautiful
              dashboards, and downloadable reports — all backed by a transparent,
              explainable model.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
