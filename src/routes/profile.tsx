import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, GraduationCap, Hash, Library } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStudentSeed } from "@/lib/studentData";

function ProfileRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-card p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — EduInsight AI" },
      { name: "description", content: "View your student profile details." },
      { property: "og:title", content: "My Profile — EduInsight AI" },
      { property: "og:description", content: "View your student profile details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, user } = useAuth();
  const { regNo, branch, semester } = useStudentSeed(user?.id);
  const initials = (profile?.full_name || user?.email || "ST")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <section>
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your student account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border border-border">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <ProfileRow icon={GraduationCap} label="Full Name" value={profile?.full_name || "—"} />
                <ProfileRow icon={Mail} label="Email" value={user?.email || "—"} />
                <ProfileRow icon={Hash} label="Reg. Number" value={regNo} />
                <ProfileRow icon={Library} label="Branch / Semester" value={`${branch} · Sem ${semester}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
