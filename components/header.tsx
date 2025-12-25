"use client";

import { DumbbellIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-primary/10 backdrop-blur-xl shadow-sm"
          : "bg-accent/5"
      )}
    >
      <div className="w-full flex h-16 items-center justify-between px-4 md:h-18">
        <div className="flex-1"></div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/25 transition-transform duration-300 group-hover:scale-105">
              <DumbbellIcon className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">
              Fit<span className="gradient-text">Champ</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">
              Fitness
            </span>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-muted-foreground font-medium"></span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
