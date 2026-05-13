import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import {
  RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "AI Predictions — EduInsight AI" },
      { name: "description", content: "Run the AI model on a student profile to predict grade, risk and personalized recommendations." },
    ],
  }),
  component: PredictionsPage,
});

function predict(p: { attendance: number; assignment: number; quiz: number; internal: number; participation: number }) {
  const score = Math.round(
    p.assignment * 0.2 + p.quiz * 0.2 + p.internal * 0.4 + p.participation * 0.1 + p.attendance * 0.1
  );
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "F";
  const composite = score * 0.7 + p.attendance * 0.3;
  const risk = composite < 55 ? "High" : composite < 70 ? "Medium" : "Low";
  const confidence = Math.min(98, 70 + Math.round((100 - Math.abs(75 - score)) / 4));
  return { score, grade, risk, confidence };
}

function recommendations(p: any) {
  const recs: string[] = [];
  if (p.attendance < 75) recs.push("Improve attendance — aim for 85%+ to lift overall score by ~5 points.");
  if (p.quiz < 60) recs.push("Schedule weekly quiz revisions; quiz scores have the highest correlation with finals.");
  if (p.assignment < 65) recs.push("Submit assignments on time and seek feedback from instructors.");
  if (p.participation < 60) recs.push("Increase classroom participation — joining discussions improves retention.");
  if (p.internal < 60) recs.push("Form a study group focused on weakest internal-exam topics.");
  if (recs.length === 0) recs.push("Excellent profile. Maintain consistency and consider mentoring peers.");
  return recs;
}

function PredictionsPage() {
  const [attendance, setAttendance] = useState(82);
  const [assignment, setAssignment] = useState(75);
  const [quiz, setQuiz] = useState(68);
  const [internal, setInternal] = useState(72);
  const [participation, setParticipation] = useState(70);

  const profile = { attendance, assignment, quiz, internal, participation };
  const result = useMemo(() => predict(profile), [attendance, assignment, quiz, internal, participation]);
  const recs = useMemo(() => recommendations(profile), [attendance, assignment, quiz, internal, participation]);

  const radarData = [
    { metric: "Attendance", value: attendance },
    { metric: "Assignment", value: assignment },
    { metric: "Quiz", value: quiz },
    { metric: "Internal", value: internal },
    { metric: "Participation", value: participation },
  ];

  const riskTone =
    result.risk === "High" ? "bg-destructive/15 text-destructive border-destructive/30" :
    result.risk === "Medium" ? "bg-warning/20 text-warning-foreground border-warning/40" :
    "bg-success/15 text-success border-success/30";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Predictions</h1>
          <p className="text-sm text-muted-foreground">Adjust a student profile and see live predictions from the model.</p>
        </div>
        <Badge variant="secondary"><Brain className="mr-1 h-3 w-3" /> Random Forest · v2.4</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Student Profile Inputs</CardTitle>
            <CardDescription>Drag the sliders — predictions update in real time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Attendance", val: attendance, set: setAttendance },
              { label: "Assignment Score", val: assignment, set: setAssignment },
              { label: "Quiz Score", val: quiz, set: setQuiz },
              { label: "Internal Marks", val: internal, set: setInternal },
              { label: "Participation", val: participation, set: setParticipation },
            ].map((f) => (
              <div key={f.label}>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm">{f.label}</Label>
                  <span className="text-sm font-semibold tabular-nums">{f.val}%</span>
                </div>
                <Slider value={[f.val]} onValueChange={(v) => f.set(v[0])} max={100} step={1} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card
            className="overflow-hidden border-0 text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-foreground/80">
                <Sparkles className="h-3 w-3" /> AI Prediction
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-bold">{result.grade}</span>
                <span className="pb-2 text-sm text-primary-foreground/80">predicted final grade</span>
              </div>
              <div className="mt-2 text-sm text-primary-foreground/90">
                Predicted score: <strong>{result.score}%</strong>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-white/10 p-3 text-xs backdrop-blur">
                <span>Model confidence</span>
                <strong>{result.confidence}%</strong>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Risk Assessment</span>
              </div>
              <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${riskTone}`}>
                {result.risk} risk
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Strengths and weaknesses across the model's input features</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Personalized Recommendations
            </CardTitle>
            <CardDescription>Actions ordered by predicted impact</CardDescription>
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
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" /> Generate detailed study plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
