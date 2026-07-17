import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FitnessPlan, UserProfile, WorkoutDay, DietDay, Exercise, Meal } from "./types";

export function generateFitnessPlanPDF(plan: FitnessPlan, userProfile: UserProfile) {
  const doc = new jsPDF();
  const primaryColor: [number, number, number] = [41, 128, 185]; // A nice blue
  const secondaryColor: [number, number, number] = [44, 62, 80]; // Dark blue/gray

  // --- Title & Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.text("FitFlow", 14, 22);

  doc.setFontSize(16);
  doc.setTextColor(...secondaryColor);
  doc.text(`Personalized Fitness Plan for ${userProfile.name}`, 14, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Goal: ${userProfile.fitnessGoal.replace("-", " ").toUpperCase()}`, 14, 40);
  doc.text(`Level: ${userProfile.fitnessLevel.toUpperCase()}`, 14, 46);
  doc.text(`Dietary Preference: ${userProfile.dietaryPreference.toUpperCase()}`, 14, 52);
  
  if (plan.motivation) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    const motivationLines = doc.splitTextToSize(`"${plan.motivation}"`, 180);
    doc.text(motivationLines, 14, 62);
  }

  let currentY = plan.motivation ? 66 + (doc.splitTextToSize(`"${plan.motivation}"`, 180).length * 5) : 62;

  // --- Workout Plan ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text("Workout Plan", 14, currentY + 10);
  currentY += 16;

  plan.workoutPlan.forEach((day: WorkoutDay) => {
    // Add page if needed
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text(`${day.day}: ${day.focus}`, 14, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Duration: ${day.duration} | Est. Burn: ${day.caloriesBurned}`, 14, currentY + 6);
    currentY += 10;

    if (day.exercises && day.exercises.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Exercise', 'Sets', 'Reps', 'Rest', 'Notes / Instructions']],
        body: day.exercises.map((ex: Exercise) => [
          ex.name,
          ex.sets?.toString() || "-",
          ex.reps || "-",
          ex.restTime || "-",
          ex.instructions || ex.notes || "-"
        ]),
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 15 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("Rest day or active recovery.", 14, currentY);
      currentY += 10;
    }
  });

  // --- Diet Plan ---
  doc.addPage();
  currentY = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text("Diet & Nutrition Plan", 14, currentY);
  currentY += 8;

  if (plan.dietPlan) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.text(`Total Daily Calories: ${plan.dietPlan.totalCalories || '-'}`, 14, currentY);
    currentY += 8;

    const meals = [
      { type: "Breakfast", meal: plan.dietPlan.breakfast },
      { type: "Mid-Morning Snack", meal: plan.dietPlan.midMorningSnack },
      { type: "Lunch", meal: plan.dietPlan.lunch },
      { type: "Evening Snack", meal: plan.dietPlan.eveningSnack },
      { type: "Dinner", meal: plan.dietPlan.dinner }
    ];

    const mealData: any[] = [];
    meals.forEach(({ type, meal }) => {
      if (meal && meal.name) {
        mealData.push([
          type,
          meal.name,
          meal.calories || '-',
          `${meal.protein || '-'} P | ${meal.carbs || '-'} C | ${meal.fats || '-'} F`,
          meal.description || '-'
        ]);
      }
    });

    if (mealData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Meal', 'Name', 'Cals', 'Macros', 'Description']],
        body: mealData,
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: 'bold' },
          1: { cellWidth: 35 },
          2: { cellWidth: 15 },
          3: { cellWidth: 35 },
          4: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("Diet plan details not available.", 14, currentY);
    currentY += 12;
  }

  // --- Tips ---
  if (plan.tips && plan.tips.length > 0) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("Safety Tips & Guidance", 14, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    
    plan.tips.forEach((tip) => {
      const tipLines = doc.splitTextToSize(`• ${tip}`, 180);
      doc.text(tipLines, 14, currentY);
      currentY += (tipLines.length * 5) + 2;
      
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }
    });
  }

  // Save the PDF
  const filename = `FitFlow-Plan-${userProfile.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}
