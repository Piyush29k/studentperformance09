import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { students, type RiskLevel } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — EduInsight AI" },
      { name: "description", content: "Browse, search and filter all students with AI-predicted grades and risk levels." },
    ],
  }),
  component: StudentsPage,
});

function riskColor(r: RiskLevel) {
  if (r === "High") return "bg-destructive/15 text-destructive border-destructive/30";
  if (r === "Medium") return "bg-warning/20 text-warning-foreground border-warning/40";
  return "bg-success/15 text-success border-success/30";
}

function StudentsPage() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<string>("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const match = s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase());
      const r = risk === "all" || s.risk === risk;
      return match && r;
    });
  }, [q, risk]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">Search, filter and review every student in the cohort.</p>
      </div>

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>{filtered.length} of {students.length} shown</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID…"
                  className="pl-8 sm:w-64"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Select value={risk} onValueChange={setRisk}>
                <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk levels</SelectItem>
                  <SelectItem value="Low">Low risk</SelectItem>
                  <SelectItem value="Medium">Medium risk</SelectItem>
                  <SelectItem value="High">High risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead className="text-right">Internal</TableHead>
                <TableHead className="text-right">Final</TableHead>
                <TableHead>Predicted</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.id}</div>
                  </TableCell>
                  <TableCell>{s.className}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.attendance}%</TableCell>
                  <TableCell className="text-right tabular-nums">{s.internal}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{s.finalScore}</TableCell>
                  <TableCell><Badge variant="secondary">{s.predictedGrade}</Badge></TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${riskColor(s.risk)}`}>
                      {s.risk}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No students match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
