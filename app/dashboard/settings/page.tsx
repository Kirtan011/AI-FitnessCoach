"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of FitFlow.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>Theme</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account Data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
