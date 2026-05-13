import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EduInsight AI" }] }),
  component: LoginPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Name is required").max(100);

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");

  // Sign up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");
  const [suRole, setSuRole] = useState<AppRole>("student");
  const [suClass, setSuClass] = useState("CSE-A");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const email = emailSchema.safeParse(siEmail);
    const pwd = passwordSchema.safeParse(siPass);
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!pwd.success) return toast.error(pwd.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data, password: pwd.data,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/" });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const name = nameSchema.safeParse(suName);
    const email = emailSchema.safeParse(suEmail);
    const pwd = passwordSchema.safeParse(suPass);
    if (!name.success) return toast.error(name.error.issues[0].message);
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!pwd.success) return toast.error(pwd.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: pwd.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: name.data,
          role: suRole,
          class_name: suRole === "student" ? suClass : null,
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created", { description: "You're signed in." });
    navigate({ to: "/" });
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "var(--gradient-subtle)" }}
    >
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        {/* Brand panel */}
        <div
          className="hidden flex-col justify-between rounded-2xl p-8 text-primary-foreground lg:flex"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">EduInsight AI</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3" /> AI-powered analytics
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Smarter decisions for every student.
            </h1>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Predict performance, spot at-risk students early, and personalize learning — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { k: "Admin", v: "Full control" },
              { k: "Teacher", v: "Manage class" },
              { k: "Student", v: "Track progress" },
            ].map((r) => (
              <div key={r.k} className="rounded-lg bg-white/10 p-3 backdrop-blur">
                <p className="font-semibold">{r.k}</p>
                <p className="opacity-80">{r.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth panel */}
        <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader>
            <CardTitle>Welcome to EduInsight AI</CardTitle>
            <CardDescription>Sign in or create an account to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-5">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" type="email" autoComplete="email"
                      value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pass">Password</Label>
                    <Input id="si-pass" type="password" autoComplete="current-password"
                      value={siPass} onChange={(e) => setSiPass(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input id="su-name" value={suName} onChange={(e) => setSuName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" autoComplete="email"
                      value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pass">Password</Label>
                    <Input id="su-pass" type="password" autoComplete="new-password" minLength={6}
                      value={suPass} onChange={(e) => setSuPass(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <Select value={suRole} onValueChange={(v) => setSuRole(v as AppRole)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {suRole === "student" && (
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={suClass} onValueChange={setSuClass}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["CSE-A", "CSE-B", "ECE-A", "IT-A"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Creating…" : "Create account"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By signing up you agree to a demo account for this analytics platform.
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">Continue without an account</Link>
              {" — "} preview only, data won't save.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
