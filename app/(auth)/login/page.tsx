import type { Metadata } from "next";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <DotGrid className="opacity-70" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="/" size="lg" />
        </div>
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
              Welcome back
            </p>
            <CardTitle className="font-display text-2xl font-bold">
              Sign in to FitFlow
            </CardTitle>
            <CardDescription>Continue to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
