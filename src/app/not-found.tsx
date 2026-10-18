import React from "react";
import { Mountain, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 flex items-center justify-center">
      <Container size="narrow" className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-[#12283a]">
          <Mountain className="w-8 h-8 text-[#b4532a]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            404 Error • Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
            The trail you are looking for does not exist
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The destination or page you requested may have been moved, renamed, or is currently under review by our editorial team.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4 ml-1" />}>
            Return to Homepage
          </Button>
          <Button href="/destinations" variant="outline" size="md">
            Browse All Destinations
          </Button>
        </div>
      </Container>
    </div>
  );
}
