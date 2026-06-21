import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStudentSeed, getSubjects, grade } from "@/lib/studentData";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "My Subjects — EduInsight AI" },
      { name: "description", content: "View your enrolled subjects and performance." },
      { property: "og:title", content: "My Subjects — EduInsight AI" },
      { property: "og:description", content: "View your enrolled subjects and performance." },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { user } = useAuth();
  const { seed } = useStudentSeed(user?.id);
  const subjects = getSubjects(seed);

  return (
    <div className="space-y-6">
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
    </div>
  );
}
