export type Subject = { code: string; name: string; score: number };

export function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function rand(seed: number, salt: number, min: number, max: number) {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  const f = x - Math.floor(x);
  return Math.round(min + f * (max - min));
}

export function grade(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

const BRANCHES = ["CSE", "ECE", "ME", "CE", "IT"] as const;

export function useStudentSeed(userId?: string) {
  const seed = hash(userId || "demo");
  const regNo = `REG-${(seed % 90000 + 10000)}`;
  const branch = BRANCHES[seed % BRANCHES.length];
  const semester = (seed % 8) + 1;
  return { seed, regNo, branch, semester };
}

export function getSubjects(seed: number): Subject[] {
  return [
    { code: "CS201", name: "Data Structures", score: rand(seed, 11, 55, 95) },
    { code: "CS202", name: "Operating Systems", score: rand(seed, 12, 55, 95) },
    { code: "MA201", name: "Discrete Math", score: rand(seed, 13, 55, 95) },
    { code: "CS203", name: "DBMS", score: rand(seed, 14, 55, 95) },
    { code: "EN201", name: "Technical Writing", score: rand(seed, 15, 60, 96) },
  ];
}

export function getMetrics(seed: number) {
  return {
    attendance: rand(seed, 1, 65, 96),
    assignment: rand(seed, 2, 55, 95),
    quiz: rand(seed, 3, 50, 92),
    internal: rand(seed, 4, 55, 94),
    participation: rand(seed, 5, 60, 95),
  };
}

export function finalScore(metrics: ReturnType<typeof getMetrics>) {
  return Math.round(
    metrics.assignment * 0.2 +
    metrics.quiz * 0.2 +
    metrics.internal * 0.4 +
    metrics.participation * 0.1 +
    metrics.attendance * 0.1
  );
}
