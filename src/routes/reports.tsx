import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BarChart3, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useStudentStore, deriveStats } from "@/lib/studentStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — EduInsight AI" },
      { name: "description", content: "Download semester reports, attendance summaries and AI prediction analyses." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { title: "Semester Performance Report", desc: "Full breakdown of marks, attendance and grades.", icon: FileText, tag: "PDF" },
  { title: "AI Prediction Summary", desc: "Predicted grades, risk levels and confidence scores.", icon: BarChart3, tag: "PDF" },
  { title: "Attendance Analytics", desc: "Monthly attendance trend with class-wise comparison.", icon: Users, tag: "XLSX" },
  { title: "At-Risk Students Report", desc: "List of students flagged for early intervention.", icon: AlertTriangle, tag: "PDF" },
  { title: "Subject-wise Performance", desc: "Average and predicted scores per subject.", icon: TrendingUp, tag: "PDF" },
  { title: "Top Performers", desc: "Ranked list of highest-performing students.", icon: FileText, tag: "PDF" },
];

function ReportsPage() {
  const students = useStudentStore((s) => s.students);
  const stats = deriveStats(students);
  const classData = ["CSE-A", "CSE-B", "ECE-A", "IT-A"].map((c) => {
    const list = students.filter((s) => s.className === c);
    if (list.length === 0) return { class: c, avg: 0, attendance: 0 };
    return {
      class: c,
      avg: Math.round(list.reduce((a, s) => a + s.finalScore, 0) / list.length),
      attendance: Math.round(list.reduce((a, s) => a + s.attendance, 0) / list.length),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Generate, preview and download performance reports.</p>
      </div>

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Class-wise Performance</CardTitle>
          <CardDescription>Average final score and attendance per class</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="class" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="avg" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} name="Avg Score" />
              <Bar dataKey="attendance" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} name="Attendance" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="group border-border transition-all hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <r.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]">{r.tag}</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => toast.success(`${r.title} ready`, { description: "Download started." })}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <CardTitle>Snapshot</CardTitle>
          <CardDescription>Aggregate metrics included in every report</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Students", value: stats.total },
            { label: "Avg Score", value: `${stats.avgScore}%` },
            { label: "Avg Attendance", value: `${stats.avgAttendance}%` },
            { label: "At-Risk", value: stats.atRisk },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-2xl font-bold">{m.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
