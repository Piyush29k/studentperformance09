import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EduInsight AI" },
      { name: "description", content: "Get in touch with the EduInsight AI team for demos, questions or partnerships." },
      { property: "og:title", content: "Contact EduInsight AI" },
      { property: "og:description", content: "Get in touch for demos, questions or partnerships." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("Please fill out every field");
    }
    toast.success("Message sent", { description: "We'll get back to you within 1 business day." });
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in touch</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a question, want a demo, or curious about bringing
                EduInsight to your institution? We'd love to hear from you.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "hello@eduinsight.ai" },
                  { icon: MessageSquare, label: "Support", value: "support@eduinsight.ai" },
                  { icon: MapPin, label: "Location", value: "Remote · Worldwide" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
                      <div className="text-sm font-medium">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <CardContent className="p-6">
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="msg">Message</Label>
                    <Textarea
                      id="msg"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                    />
                  </div>
                  <Button type="submit" className="w-full">Send message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
