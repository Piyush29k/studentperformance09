import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Lightbulb, TrendingUp, CalendarCheck, BookOpen, Target, Mail, GraduationCap, Hash, Library } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { trendData } from "@/lib/mockData";
import { useStudentSeed, getSubjects, getMetrics, finalScore, grade } from "@/lib/studentData";

function ProfileRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-card p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { profile, user } = useAuth();
  const { seed, regNo, branch, semester } = useStudentSeed(user?.id);
  const initials = (profile?.full_name || user?.email || "ST")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const subjects = getSubjects(seed);
  const metrics = getMetrics(seed);
  const score = finalScore(metrics);
  const predicted = grade(score);

  const radarData = [
    { metric: "Attendance", value: metrics.attendance },
    { metric: "Assignment", value: metrics.assignment },
    { metric: "Quiz", value: metrics.quiz },
    { metric: "Internal", value: metrics.internal },
    { metric: "Participation", value: metrics.participation },
  ];

  const recs: string[] = [];
  if (metrics.attendance < 80) recs.push("Boost attendance to 85%+ — strongest correlation with your final grade.");
  if (metrics.quiz < 70) recs.push("Review weekly quizzes; targeted practice can lift your final by 4–6 points.");
  if (metrics.assignment < 70) recs.push("Submit assignments on time and request feedback from your instructor.");
  if (metrics.participation < 70) recs.push("Speak up in class — active participation improves recall and your score.");
  if (recs.length === 0) recs.push("Excellent work — maintain consistency and consider mentoring peers.");



  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border border-border p-6 text-primary-foreground md:p-8"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="bg-white/15 text-primary-foreground backdrop-blur hover:bg-white/20">
              <Sparkles className="mr-1 h-3 w-3" /> Your AI Insights
            </Badge>
            <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Hi {profile?.full_name || "there"} 👋
            </h1>
            <p className="mt-1 max-w-xl text-sm text-primary-foreground/80">
              {profile?.class_name ? `Class ${profile.class_name} · ` : ""}
              Here's how you're tracking this semester.
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold leading-none">{predicted}</div>
            <div className="text-xs uppercase tracking-wide opacity-80">Predicted grade</div>
            <div className="mt-1 text-sm">{finalScore}% projected final</div>
          </div>
        </div>
      </section>

      {/* Profile Card */}
      <section>
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your student account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border border-border">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <ProfileRow icon={GraduationCap} label="Full Name" value={profile?.full_name || "—"} />
                <ProfileRow icon={Mail} label="Email" value={user?.email || "—"} />
                <ProfileRow icon={Hash} label="Reg. Number" value={regNo} />
                <ProfileRow icon={Library} label="Branch / Semester" value={`${branch} · Sem ${semester}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Subjects Area */}
      <section>
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> My Subjects
            </CardTitle>
            <CardDescription>Performance across enrolled subjects this semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((s) => (
              <div key={s.code} className="space-y-2 rounded-lg border border-border bg-accent/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">{grade(s.score)}</Badge>
                    <span className="text-sm font-semibold tabular-nums">{s.score}%</span>
                  </div>
                </div>
                <Progress value={s.score} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>


      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CalendarCheck, label: "Attendance", value: `${attendance}%` },
          { icon: BookOpen, label: "Assignments", value: assignment },
          { icon: Target, label: "Quiz Avg", value: quiz },
          { icon: TrendingUp, label: "Internal", value: internal },
        ].map((m) => (
          <Card key={m.label} className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.label}</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums">{m.value}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Score and attendance trend over the semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="avg" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#sg1)" name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Strengths & Weak Areas</CardTitle>
            <CardDescription>Where to focus your effort</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" /> AI Recommendations
          </CardTitle>
          <CardDescription>Personalized actions, ordered by predicted impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recs.map((r, i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-border bg-accent/30 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed">{r}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
