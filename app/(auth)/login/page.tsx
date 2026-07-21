import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotGrid, Logo } from "@/components/shared";

export const metadata: Metadata = { title: "Sign in - FitFlow" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 lg:p-0">
      <DotGrid className="opacity-70" />
      
      <Card className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-2xl p-0">
        {/* Left side: Illustration (Hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-secondary/20 p-12 relative overflow-hidden border-r border-border">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[320px]">
            <Image src="/clipart/undraw_personal-trainer_bqkg.svg" alt="Personal Trainer" width={320} height={320} className="w-full h-auto drop-shadow-md" />
          </div>
          <div className="relative z-10 mt-10 text-center">
            <h2 className="text-2xl font-display font-bold">Your AI Fitness Journey</h2>
            <p className="mt-2 text-muted-foreground text-sm max-w-xs mx-auto">Sign in to access your personalized workout and diet plans generated instantly.</p>
          </div>
        </div>
        
        {/* Right side: Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Logo href="/" size="lg" />
          </div>
          <CardHeader className="p-0 mb-6 text-center lg:text-left space-y-2">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
              Welcome back
            </p>
            <CardTitle className="font-display text-2xl sm:text-3xl font-bold">
              Sign in to FitFlow
            </CardTitle>
            <CardDescription className="text-sm">Continue to your dashboard</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <LoginForm />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
