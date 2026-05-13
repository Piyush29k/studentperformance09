import { create } from "zustand";
import { persist } from "zustand/middleware";
import { students as seedStudents, type Student, type RiskLevel } from "./mockData";

function grade(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}
function risk(score: number, attendance: number): RiskLevel {
  const c = score * 0.7 + attendance * 0.3;
  if (c < 55) return "High";
  if (c < 70) return "Medium";
  return "Low";
}

export type NewStudentInput = {
  name: string;
  className: string;
  attendance: number;
  assignment: number;
  quiz: number;
  internal: number;
  participation: number;
};

export function buildStudent(input: NewStudentInput, idNum: number): Student {
  const finalScore = Math.round(
    input.assignment * 0.2 + input.quiz * 0.2 + input.internal * 0.4 +
    input.participation * 0.1 + input.attendance * 0.1
  );
  return {
    id: `STU${String(idNum)}`,
    ...input,
    finalScore,
    predictedGrade: grade(finalScore),
    risk: risk(finalScore, input.attendance),
  };
}

interface StudentStore {
  students: Student[];
  addStudent: (input: NewStudentInput) => Student;
  removeStudent: (id: string) => void;
  resetToSeed: () => void;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: seedStudents,
      addStudent: (input) => {
        const nextNum = 1001 + get().students.length;
        const s = buildStudent(input, nextNum);
        set({ students: [s, ...get().students] });
        return s;
      },
      removeStudent: (id) => set({ students: get().students.filter((s) => s.id !== id) }),
      resetToSeed: () => set({ students: seedStudents }),
    }),
    { name: "eduinsight-students" }
  )
);

export function deriveStats(list: Student[]) {
  if (list.length === 0) return { total: 0, avgScore: 0, avgAttendance: 0, atRisk: 0 };
  return {
    total: list.length,
    avgScore: Math.round(list.reduce((a, s) => a + s.finalScore, 0) / list.length),
    avgAttendance: Math.round(list.reduce((a, s) => a + s.attendance, 0) / list.length),
    atRisk: list.filter((s) => s.risk === "High").length,
  };
}

export function deriveGradeDistribution(list: Student[]) {
  const buckets: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
  list.forEach((s) => (buckets[s.predictedGrade] = (buckets[s.predictedGrade] || 0) + 1));
  return Object.entries(buckets).map(([grade, count]) => ({ grade, count }));
}
