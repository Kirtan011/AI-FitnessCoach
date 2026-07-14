"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserForm } from "@/components/user-form";
import { LoadingScreen } from "@/components/loading-screen";
import { Header } from "@/components/header";
import type { UserProfile } from "@/lib/types";

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (profile: UserProfile) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, isRegenerate: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate plan. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-6 md:py-10">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
