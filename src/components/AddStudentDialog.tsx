import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useStudentStore, buildStudent } from "@/lib/studentStore";

const CLASSES = ["CSE-A", "CSE-B", "ECE-A", "IT-A"];

export function AddStudentDialog() {
  const addStudent = useStudentStore((s) => s.addStudent);
  const count = useStudentStore((s) => s.students.length);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    className: "CSE-A",
    attendance: 80,
    assignment: 70,
    quiz: 70,
    internal: 70,
    participation: 70,
  });

  const preview = buildStudent(form, 1001 + count);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    if (!form.name.trim()) {
      toast.error("Please enter student name");
      return;
    }
    const s = addStudent(form);
    toast.success(`${s.name} added`, {
      description: `Predicted grade ${s.predictedGrade} · ${s.risk} risk`,
    });
    setOpen(false);
    setForm({
      name: "", className: "CSE-A",
      attendance: 80, assignment: 70, quiz: 70, internal: 70, participation: 70,
    });
  }

  const sliders: { key: keyof typeof form; label: string }[] = [
    { key: "attendance", label: "Attendance" },
    { key: "assignment", label: "Assignment Score" },
    { key: "quiz", label: "Quiz Score" },
    { key: "internal", label: "Internal Marks" },
    { key: "participation", label: "Participation" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter all details manually. The AI will auto-predict grade and risk level.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                placeholder="e.g. Aarav Sharma"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={form.className} onValueChange={(v) => update("className", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-5 rounded-lg border border-border bg-muted/30 p-4">
            {sliders.map(({ key, label }) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm">{label}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form[key] as number}
                    onChange={(e) => update(key, Math.max(0, Math.min(100, Number(e.target.value) || 0)) as never)}
                    className="h-7 w-20 text-right tabular-nums"
                  />
                </div>
                <Slider
                  value={[form[key] as number]}
                  onValueChange={(v) => update(key, v[0] as never)}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>

          <div
            className="flex items-center justify-between rounded-lg p-4 text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div>
              <div className="flex items-center gap-1 text-xs uppercase tracking-wide opacity-80">
                <Sparkles className="h-3 w-3" /> AI Prediction Preview
              </div>
              <div className="mt-1 text-sm opacity-90">Final score · Risk</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold leading-none">{preview.predictedGrade}</div>
                <div className="text-xs opacity-80">{preview.finalScore}%</div>
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
                {preview.risk}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save Student</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
