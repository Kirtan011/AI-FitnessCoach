"use client";

import { useEffect, useState } from "react";
import { Calendar, Home, Settings, LineChart, Plus, LogOut, ChevronUp, User2, Dumbbell, Moon, Sun, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared";


const navigationItems = [
  {
    title: "Active Plan",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Workout History",
    url: "/dashboard/history",
    icon: Calendar,
  },
  {
    title: "Progress Analytics",
    url: "/dashboard/progress",
    icon: LineChart,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [plans, setPlans] = useState<Array<{id: string, title: string, createdAt: string}>>([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/fitness-plans")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPlans(data);
        })
        .catch(console.error);
    }
  }, [session]);

  const urlPlanId = searchParams.get("planId");
  const [activePlanId, setActivePlanId] = useState<string | null>(urlPlanId);

  useEffect(() => {
    if (urlPlanId) {
      setActivePlanId(urlPlanId);
      localStorage.setItem("sidebarActivePlanId", urlPlanId);
    } else {
      const stored = localStorage.getItem("sidebarActivePlanId");
      if (stored) {
        setActivePlanId(stored);
      }
    }
  }, [urlPlanId]);

  const isAnyPlanActive = plans.some((p) => p.id === activePlanId);
  const effectivePlanId = isAnyPlanActive ? activePlanId : (plans.length > 0 ? plans[0].id : null);

  const handleDeletePlan = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/fitness-plan?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlans(plans.filter(p => p.id !== id));
        if (activePlanId === id) {
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-border">
        <div className="flex w-full items-center justify-center py-1.5 px-4">
          <Logo size="sm" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive && !urlPlanId} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {plans.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Plans</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {plans.map((plan, index) => {
                  const isActive = effectivePlanId === plan.id;
                  const dateStr = new Date(plan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  return (
                    <SidebarMenuItem key={plan.id}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={`${plan.title} (${new Date(plan.createdAt).toLocaleDateString()})`}
                        className={`relative h-auto py-1.5 px-2 transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary ring-1 ring-primary/20' 
                            : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Link href={`/dashboard?planId=${plan.id}`} className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Dumbbell className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate font-medium text-sm">{plan.title}</span>
                          </div>
                          
                          {isActive ? (
                            <span className="shrink-0 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm mr-1">
                              Active
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] opacity-60 mr-1">
                              {dateStr}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction showOnHover onClick={(e) => handleDeletePlan(e, plan.id)} title="Delete plan" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 flex flex-col gap-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {session?.user?.name?.substring(0, 2).toUpperCase() || <User2 className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name || "Guest"}</span>
                    <span className="truncate text-xs">{session?.user?.email || ""}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/onboarding" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create New Plan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="cursor-pointer"
            >
              <div className="relative flex h-4 w-4 items-center justify-center">
                <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </div>
              <span>Toggle Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
