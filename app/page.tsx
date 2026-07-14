import Link from "next/link";
import { ArrowRight, Check, Dumbbell, Salad, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DotGrid,
  Framed,
  Highlight,
  Logo,
  MonoLabel,
  Pill,
  SectionTag,
  Stat,
} from "@/components/shared";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What you get", href: "#what-you-get" },
  { label: "Results", href: "#results" },
];

const steps = [
  {
    n: "01",
    title: "Tell us about you",
    desc: "Goals, level, schedule, and dietary preference — a quick four-step profile.",
  },
  {
    n: "02",
    title: "Get your plan",
    desc: "A structured weekly workout and nutrition plan, generated in seconds.",
  },
  {
    n: "03",
    title: "Adjust as you go",
    desc: "Regenerate or refine anytime as your body, goals, and schedule change.",
  },
];

const capabilities = [
  {
    icon: Dumbbell,
    title: "Workout programming",
    desc: "Split, sets, reps and rest tuned to your level and where you train.",
  },
  {
    icon: Salad,
    title: "Nutrition that fits",
    desc: "Daily calories and meals matched to your goal and dietary preference.",
  },
  {
    icon: Sparkles,
    title: "Adapts to you",
    desc: "Regenerate on demand — your plan evolves as you progress.",
  },
];

const previewExercises = [
  ["Bench Press", "4 × 8"],
  ["Incline Dumbbell Press", "3 × 10"],
  ["Overhead Press", "3 × 10"],
  ["Tricep Pushdown", "3 × 12"],
];

const progress = [
  { label: "Week 1", value: 38 },
  { label: "Week 4", value: 64 },
  { label: "Week 8", value: 92 },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo href="/" />
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          <DotGrid className="opacity-70" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
            <div className="flex justify-center">
              <Pill tag="New">AI plans tuned to your body & schedule →</Pill>
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight md:text-6xl">
              Train with a plan that{" "}
              <Highlight>actually fits you</Highlight>.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              FitChamp builds personalized workouts and nutrition around your
              body, goals, and schedule — ready in seconds. Works for the gym,
              home, or outdoors.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Free to start", "No credit card", "Cancel anytime"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" /> {t}
                </li>
              ))}
            </ul>

            {/* Framed product preview */}
            <div className="relative mx-auto mt-16 max-w-3xl">
              <Framed className="rounded-lg p-5 text-left shadow-xl sm:p-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <MonoLabel>Day 01 — Push</MonoLabel>
                    <p className="mt-1.5 font-display text-lg font-bold">
                      Chest &amp; Triceps
                    </p>
                  </div>
                  <span className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
                    45 MIN
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {previewExercises.map(([name, sets]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2.5"
                    >
                      <span className="text-sm font-medium">{name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {sets}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2.5">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <span className="text-sm">Est. 320 kcal burned this session</span>
                </div>
              </Framed>

              {/* floating stat chip */}
              <div className="absolute -bottom-5 -right-4 hidden sm:block">
                <Framed className="rounded-md bg-card px-4 py-3 shadow-lg" markers={false}>
                  <MonoLabel>Today&apos;s protein</MonoLabel>
                  <p className="mt-1 font-display text-xl font-bold">
                    142
                    <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                      g
                    </span>
                  </p>
                </Framed>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stat strip ────────────────────────────────────── */}
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
            <Stat value="< 60s" label="To your first plan" />
            <Stat value="100%" label="Personalized" />
            <Stat value="3" label="Train anywhere modes" />
            <Stat value="∞" label="Free regenerations" />
          </div>
        </section>

        {/* ── What you get ──────────────────────────────────── */}
        <section id="what-you-get" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionTag label="What you get" index={1} total={3} />
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <h2 className="max-w-md text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
                  Everything you need to{" "}
                  <Highlight>start training today</Highlight>.
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground">
                  One short profile produces a complete, structured program —
                  not a generic template. Workouts, meals, and coaching tips
                  built for your goal.
                </p>
                <div className="mt-8 space-y-3">
                  {capabilities.map((c) => (
                    <div
                      key={c.title}
                      className="hover-lift flex items-start gap-4 rounded-lg border border-border bg-card p-4"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{c.title}</p>
                        <p className="text-sm text-muted-foreground">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solid blue feature panel */}
              <Framed tone="blue" className="rounded-lg p-8 shadow-xl">
                <MonoLabel className="text-primary-foreground/70">
                  AI-generated plan
                </MonoLabel>
                <p className="mt-4 font-display text-2xl font-bold leading-snug md:text-3xl">
                  One profile in.
                  <br />A full program out.
                </p>
                <p className="mt-4 max-w-xs text-sm text-primary-foreground/80">
                  Your weekly split, daily macros, and motivation — assembled
                  the moment you finish your profile.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6">
                  {[
                    ["7", "Day split"],
                    ["3", "Meals / day"],
                    ["AI", "Coaching tips"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <p className="font-display text-2xl font-bold">{v}</p>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary-foreground/70">
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
              </Framed>
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────── */}
        <section id="how-it-works" className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionTag label="How it works" index={2} total={3} />
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="bg-card p-8">
                  <span className="font-mono text-sm font-bold text-primary">
                    [{s.n}]
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Results ───────────────────────────────────────── */}
        <section id="results" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <SectionTag label="Results" index={3} total={3} />
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="max-w-md text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
                  Consistency beats intensity.{" "}
                  <Highlight>We make it easy to stay consistent.</Highlight>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground">
                  A plan you actually follow is the one that works. FitChamp
                  keeps your program realistic, structured, and adjustable so the
                  graph keeps going up.
                </p>
                <Button asChild size="lg" className="mt-8">
                  <Link href="/register">
                    Build my plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* CSS bar visual */}
              <Framed className="rounded-lg p-8">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <MonoLabel dot>Adherence over time</MonoLabel>
                  <span className="rounded-sm bg-accent px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-accent-foreground">
                    On track
                  </span>
                </div>
                <div className="mt-8 flex h-48 items-end justify-around gap-6">
                  {progress.map((p, i) => (
                    <div key={p.label} className="flex w-full flex-col items-center gap-3">
                      <div className="flex w-full max-w-[64px] flex-1 items-end">
                        <div
                          className={cn(
                            "w-full rounded-t-sm transition-all",
                            i === progress.length - 1
                              ? "bg-primary"
                              : "bg-primary/35"
                          )}
                          style={{ height: `${p.value}%` }}
                        />
                      </div>
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Framed>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <DotGrid variant="lines" className="opacity-60" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Framed tone="blue" className="rounded-xl px-8 py-14 text-center shadow-2xl md:px-12">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight md:text-5xl">
                Your plan is 60 seconds away.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                Tell us about you, get a complete workout and nutrition plan, and
                start today.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" variant="accent">
                  <Link href="/register">
                    Start free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </Framed>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <Logo size="sm" />
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            Made by Kirtan Suthar · Personalized fitness plans to achieve your goals
          </p>
        </div>
      </footer>
    </div>
  );
}
