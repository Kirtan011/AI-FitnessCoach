import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<div className="w-64 border-r bg-sidebar h-screen shrink-0" />}>
        <AppSidebar />
      </Suspense>
      <main className="flex-1 w-full flex flex-col h-screen relative overflow-hidden bg-background">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
