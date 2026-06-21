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

// Deterministic per-user mock performance, so each student account gets a stable view.
function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function rand(seed: number, salt: number, min: number, max: number) {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  const f = x - Math.floor(x);
  return Math.round(min + f * (max - min));
}

function grade(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function StudentDashboard() {
  const { profile, user } = useAuth();
  const seed = hash(user?.id || "demo");
  const initials = (profile?.full_name || user?.email || "ST")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const regNo = `REG-${(seed % 90000 + 10000)}`;
  const branches = ["CSE", "ECE", "ME", "CE", "IT"] as const;
  const branch = branches[seed % branches.length];
  const semester = (seed % 8) + 1;

  const subjects = [
    { code: "CS201", name: "Data Structures", score: rand(seed, 11, 55, 95) },
    { code: "CS202", name: "Operating Systems", score: rand(seed, 12, 55, 95) },
    { code: "MA201", name: "Discrete Math", score: rand(seed, 13, 55, 95) },
    { code: "CS203", name: "DBMS", score: rand(seed, 14, 55, 95) },
    { code: "EN201", name: "Technical Writing", score: rand(seed, 15, 60, 96) },
  ];

  const attendance = rand(seed, 1, 65, 96);
  const assignment = rand(seed, 2, 55, 95);
  const quiz = rand(seed, 3, 50, 92);
  const internal = rand(seed, 4, 55, 94);
  const participation = rand(seed, 5, 60, 95);
  const finalScore = Math.round(
    assignment * 0.2 + quiz * 0.2 + internal * 0.4 + participation * 0.1 + attendance * 0.1
  );
  const predicted = grade(finalScore);

  const radarData = [
    { metric: "Attendance", value: attendance },
    { metric: "Assignment", value: assignment },
    { metric: "Quiz", value: quiz },
    { metric: "Internal", value: internal },
    { metric: "Participation", value: participation },
  ];

  const recs: string[] = [];
  if (attendance < 80) recs.push("Boost attendance to 85%+ — strongest correlation with your final grade.");
  if (quiz < 70) recs.push("Review weekly quizzes; targeted practice can lift your final by 4–6 points.");
  if (assignment < 70) recs.push("Submit assignments on time and request feedback from your instructor.");
  if (participation < 70) recs.push("Speak up in class — active participation improves recall and your score.");
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
