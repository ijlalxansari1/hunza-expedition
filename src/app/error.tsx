'use client';

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error logged:", error);
  }, [error]);

  return (
    <div className="py-24 sm:py-32 flex items-center justify-center">
      <Container size="narrow" className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            System Notice
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
            Something unexpected occurred
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            We encountered an unexpected error while loading this content. Our system has logged the event.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            icon={<RefreshCw className="w-4 h-4 ml-1" />}
          >
            Try Again
          </Button>
          <Button href="/" variant="outline" size="md" icon={<Home className="w-4 h-4 ml-1" />}>
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
