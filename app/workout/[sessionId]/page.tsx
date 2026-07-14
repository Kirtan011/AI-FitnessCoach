import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActiveWorkout } from "@/components/active-workout";

export default async function WorkoutSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const workoutSession = await prisma.workoutSession.findUnique({
    where: { id: params.sessionId },
    include: { fitnessPlan: true },
  });

  if (!workoutSession || workoutSession.userId !== session.user.id) {
    redirect("/dashboard");
  }

  if (workoutSession.status === "COMPLETED") {
    redirect("/dashboard/history");
  }

  // Find the exercises from the fitness plan
  const planData = workoutSession.fitnessPlan?.plan as any;
  const dayPrefix = workoutSession.workoutName.split(" - ")[0];
  const workoutDay = planData?.workoutPlan?.find(
    (day: any) => day.day === dayPrefix
  );

  if (!workoutDay) {
    return <div>Workout not found in plan.</div>;
  }

  return (
    <ActiveWorkout
      sessionData={workoutSession}
      workoutDay={workoutDay}
      warmup={planData.warmup || []}
      cooldown={planData.cooldown || []}
    />
  );
}
