import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Brain, FileBarChart, GraduationCap, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, type AppRole } from "@/lib/auth";

type Item = { title: string; url: string; icon: typeof LayoutDashboard; roles: AppRole[] };

const items: Item[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
  { title: "Students", url: "/students", icon: Users, roles: ["admin", "teacher"] },
  { title: "AI Predictions", url: "/predictions", icon: Brain, roles: ["admin", "teacher"] },
  { title: "Reports", url: "/reports", icon: FileBarChart, roles: ["admin", "teacher"] },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { primaryRole } = useAuth();
  const isActive = (p: string) => currentPath === p;

  const visible = items.filter((i) => !primaryRole || i.roles.includes(primaryRole));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-md"
            style={{ background: "var(--gradient-primary)" }}
          >
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">EduInsight AI</span>
            <span className="text-xs text-muted-foreground">Performance Analytics</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mx-2 rounded-lg border border-border bg-accent/40 p-3 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Model: Random Forest
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Accuracy <span className="font-semibold text-foreground">92.4%</span> · Last trained 2h ago
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
