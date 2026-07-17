"use client";

import React, { useEffect, useState } from "react";
import Model from "react-body-highlighter";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface MuscleSelectorProps {
  selectedMuscles: string[];
  onSelectMuscle: (muscle: string) => void;
  className?: string;
  type?: "anterior" | "posterior";
}

export function MuscleSelector({ selectedMuscles, onSelectMuscle, className, type = "anterior" }: MuscleSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = selectedMuscles.length > 0 ? [{ name: "Target", muscles: selectedMuscles }] : [];

  const handleClick = React.useCallback(
    ({ muscle }: { muscle: string }) => {
      onSelectMuscle(muscle);
    },
    [onSelectMuscle]
  );

  return (
    <div className={cn("muscle-selector-container relative", className)}>
      <style dangerouslySetInnerHTML={{__html: `
        .muscle-selector-container .rbh polygon { transition: fill 0.2s ease; cursor: pointer; }
        .muscle-selector-container .rbh polygon:hover { fill: #fdba74 !important; }
      `}} />
      <Model
        data={data}
        style={{ width: "100%", height: "100%", padding: "1rem" }}
        onClick={handleClick as any}
        highlightedColors={["#f97316", "#f97316"]} // Vibrant orange
        bodyColor={mounted && resolvedTheme === "dark" ? "#52525b" : "#e4e4e7"} // Distinct dark gray or light gray
        type={type}
      />
    </div>
  );
}
