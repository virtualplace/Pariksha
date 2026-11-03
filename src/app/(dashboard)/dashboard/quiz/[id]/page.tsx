import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-gray-400">
          Loading quiz...
        </div>
      }
    >
      <QuizContent params={params} />
    </Suspense>
  );
}

async function QuizContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <QuizClient quizId={id} />;
}