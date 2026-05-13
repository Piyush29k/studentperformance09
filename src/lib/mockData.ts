export type RiskLevel = "Low" | "Medium" | "High";

export interface Student {
  id: string;
  name: string;
  className: string;
  attendance: number;
  assignment: number;
  quiz: number;
  internal: number;
  finalScore: number;
  participation: number;
  predictedGrade: string;
  risk: RiskLevel;
}

const names = [
  "Aarav Sharma", "Diya Patel", "Vivaan Reddy", "Ananya Iyer", "Arjun Mehta",
  "Saanvi Kapoor", "Reyansh Nair", "Myra Joshi", "Kabir Singh", "Aadhya Rao",
  "Ishaan Verma", "Anika Bose", "Vihaan Khanna", "Pari Desai", "Aryan Gupta",
  "Navya Menon", "Krishna Pillai", "Riya Malhotra", "Atharv Shetty", "Tara Bhatt",
  "Shaurya Saxena", "Kiara Banerjee", "Dhruv Chawla", "Aanya Trivedi", "Veer Kulkarni",
  "Ira Agarwal", "Rudra Mishra", "Zara Sinha", "Ayaan Dutta", "Sara Ghosh",
];

function grade(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function risk(score: number, attendance: number): RiskLevel {
  const composite = score * 0.7 + attendance * 0.3;
  if (composite < 55) return "High";
  if (composite < 70) return "Medium";
  return "Low";
}

// Deterministic pseudo-random
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

export const students: Student[] = names.map((name, i) => {
  const attendance = Math.round(55 + seeded(i, 1) * 45);
  const assignment = Math.round(40 + seeded(i, 2) * 60);
  const quiz = Math.round(35 + seeded(i, 3) * 65);
  const internal = Math.round(40 + seeded(i, 4) * 60);
  const participation = Math.round(30 + seeded(i, 5) * 70);
  const finalScore = Math.round(
    assignment * 0.2 + quiz * 0.2 + internal * 0.4 + participation * 0.1 + attendance * 0.1
  );
  return {
    id: `STU${String(1001 + i)}`,
    name,
    className: ["CSE-A", "CSE-B", "ECE-A", "IT-A"][i % 4],
    attendance,
    assignment,
    quiz,
    internal,
    finalScore,
    participation,
    predictedGrade: grade(finalScore),
    risk: risk(finalScore, attendance),
  };
});

export const subjectAverages = [
  { subject: "Math", average: 76, predicted: 78 },
  { subject: "Physics", average: 68, predicted: 72 },
  { subject: "Chemistry", average: 71, predicted: 70 },
  { subject: "CS", average: 82, predicted: 85 },
  { subject: "English", average: 79, predicted: 80 },
  { subject: "Lab", average: 85, predicted: 86 },
];

export const trendData = [
  { month: "Jan", avg: 68, attendance: 82 },
  { month: "Feb", avg: 71, attendance: 84 },
  { month: "Mar", avg: 70, attendance: 80 },
  { month: "Apr", avg: 74, attendance: 86 },
  { month: "May", avg: 76, attendance: 88 },
  { month: "Jun", avg: 78, attendance: 87 },
  { month: "Jul", avg: 81, attendance: 89 },
];

export const gradeDistribution = (() => {
  const buckets: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach((s) => (buckets[s.predictedGrade] = (buckets[s.predictedGrade] || 0) + 1));
  return Object.entries(buckets).map(([grade, count]) => ({ grade, count }));
})();

export const stats = {
  total: students.length,
  avgScore: Math.round(students.reduce((a, s) => a + s.finalScore, 0) / students.length),
  avgAttendance: Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length),
  atRisk: students.filter((s) => s.risk === "High").length,
};
