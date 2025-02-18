"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ERRORS } from "./_statics/errors";
import { METADATA } from "./_statics/metadata";

export default function ErrorBranches({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <PageHeader
          title={METADATA.title}
          description={METADATA.description}
        />
      </div>
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold">{ERRORS.generic}</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {error.message || ERRORS.loading}
          </p>
          <Button size="sm" onClick={reset}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    </>
  );
}
