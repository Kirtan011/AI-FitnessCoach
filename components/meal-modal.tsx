"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Meal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Flame, RefreshCcw, Info, ListOrdered, Clock, Utensils, LoaderIcon } from "lucide-react";
import { SaladIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MealModalProps {
  meal: Meal | null;
  mealType: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapMeal?: (mealType: string, preference: "veg" | "non-veg") => Promise<void>;
}

export function MealModal({ meal, mealType, isOpen, onClose, onSwapMeal }: MealModalProps) {
  const [isSwapping, setIsSwapping] = useState(false);

  if (!meal) return null;

  const handleSwap = async (preference: "veg" | "non-veg") => {
    if (!onSwapMeal || !mealType) return;
    try {
      setIsSwapping(true);
      await onSwapMeal(mealType, preference);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-display pr-6">
            <span className="flex items-center gap-2 truncate">
              <SaladIcon className="h-5 w-5 text-green-500 shrink-0" />
              <span className="truncate">{meal.name}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4 relative">
          {isSwapping && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-lg">
              <LoaderIcon className="h-8 w-8 animate-spin text-primary mb-2" />
              <span className="font-medium text-sm text-primary">Finding alternative...</span>
            </div>
          )}

          {/* Generated Meal Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-border bg-secondary/30 relative">
            <img 
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
                `${meal.name}, delicious healthy food, professional food photography, high quality, appetizing`
              )}?width=800&height=400&nologo=true`}
              alt={meal.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {meal.description}
            </p>
            {onSwapMeal && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-4 shrink-0" disabled={isSwapping}>
                    <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                    Change Food
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSwap("veg")} className="cursor-pointer">
                    Swap to Veg
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSwap("non-veg")} className="cursor-pointer">
                    Swap to Non-Veg
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg border bg-secondary/30 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Cals</p>
              <p className="font-semibold text-sm flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                {meal.calories}
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/30 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Protein</p>
              <p className="font-semibold text-sm">{meal.protein}</p>
            </div>
            <div className="rounded-lg border bg-secondary/30 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Carbs</p>
              <p className="font-semibold text-sm">{meal.carbs}</p>
            </div>
            <div className="rounded-lg border bg-secondary/30 p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fats</p>
              <p className="font-semibold text-sm">{meal.fats}</p>
            </div>
          </div>

          {/* Meta Info */}
          {(meal.prepTime || meal.servingSize) && (
            <div className="flex flex-wrap gap-3">
              {meal.prepTime && (
                <Badge variant="outline" className="flex items-center gap-1.5 font-normal">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Prep time: {meal.prepTime}
                </Badge>
              )}
              {meal.servingSize && (
                <Badge variant="outline" className="flex items-center gap-1.5 font-normal">
                  <Utensils className="h-3.5 w-3.5 text-primary" />
                  Servings: {meal.servingSize}
                </Badge>
              )}
            </div>
          )}

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <Info className="h-4 w-4 text-primary" /> Ingredients
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    <span className="leading-tight">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && meal.instructions.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <ListOrdered className="h-4 w-4 text-primary" /> Instructions
              </h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {meal.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-foreground">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
