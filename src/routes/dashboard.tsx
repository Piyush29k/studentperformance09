import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, AlertTriangle, CalendarCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { trendData, subjectAverages } from "@/lib/mockData";
import { useStudentStore, deriveStats, deriveGradeDistribution } from "@/lib/studentStore";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EduInsight AI" },
      { name: "description", content: "Overview of student performance, attendance and AI predictions." },
    ],
  }),
  component: Dashboard,
});

import { useAuth } from "@/lib/auth";
import { StudentDashboard } from "@/components/StudentDashboard";

const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-destructive)"];

function StatCard({ icon: Icon, label, value, delta, tone = "primary" }: any) {
  return (
    <Card className="overflow-hidden border-border" style={{ boxShadow: "var(--shadow-card)" }}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {delta && (
              <div className="mt-2 flex items-center gap-1 text-xs text-success">
                <ArrowUpRight className="h-3 w-3" />
                <span>{delta}</span>
              </div>
            )}
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              tone === "destructive" ? "bg-destructive/10 text-destructive" :
              tone === "success" ? "bg-success/10 text-success" :
              tone === "warning" ? "bg-warning/20 text-warning-foreground" :
              "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { primaryRole } = useAuth();
  if (primaryRole === "student") return <StudentDashboard />;

  const students = useStudentStore((s) => s.students);
  const stats = deriveStats(students);
  const gradeDistribution = deriveGradeDistribution(students);
  const topStudents = [...students].sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border border-border p-6 text-primary-foreground md:p-8"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <Badge className="bg-white/15 text-primary-foreground backdrop-blur hover:bg-white/20">
              <Sparkles className="mr-1 h-3 w-3" /> AI-Powered Insights
            </Badge>
            <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, Professor
            </h1>
            <p className="mt-1 max-w-xl text-sm text-primary-foreground/80">
              Your batch shows a <strong>+4.2%</strong> improvement this semester. The model flagged{" "}
              <strong>{stats.atRisk} students</strong> who need early intervention.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={stats.total} delta="+3 this term" />
        <StatCard icon={TrendingUp} label="Average Score" value={`${stats.avgScore}%`} delta="+4.2% MoM" tone="success" />
        <StatCard icon={CalendarCheck} label="Avg Attendance" value={`${stats.avgAttendance}%`} delta="+1.8%" tone="primary" />
        <StatCard icon={AlertTriangle} label="At-Risk Students" value={stats.atRisk} tone="destructive" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Average score and attendance across the semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="avg" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#g1)" name="Avg Score" />
                <Area type="monotone" dataKey="attendance" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#g2)" name="Attendance" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Predicted Grade Distribution</CardTitle>
            <CardDescription>Model output across the cohort</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradeDistribution} dataKey="count" nameKey="grade" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {gradeDistribution.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Subject Averages vs AI Prediction</CardTitle>
            <CardDescription>Where the model expects performance to shift next term</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="average" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} name="Current Avg" />
                <Bar dataKey="predicted" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} name="Predicted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest predicted final scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.regNo} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch} · Sem {s.semester} · {s.regNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{s.finalScore}%</p>
                  <Badge variant="secondary" className="text-[10px]">{s.predictedGrade}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
