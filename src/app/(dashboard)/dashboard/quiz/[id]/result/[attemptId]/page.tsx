import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-gray-400">
          Loading result...
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}

async function ResultContent({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { attemptId } = await params;

  return <ResultClient attemptId={attemptId} />;
}