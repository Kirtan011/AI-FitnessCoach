import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotGrid, Logo } from "@/components/shared";

export const metadata: Metadata = { title: "Sign up - FitChamp" };

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <DotGrid className="opacity-70" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="/" size="lg" />
        </div>
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
              Get started
            </p>
            <CardTitle className="font-display text-2xl font-bold">
              Create your account
            </CardTitle>
            <CardDescription>
              Start your personalized fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
