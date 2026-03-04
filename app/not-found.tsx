import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-bg"
      aria-label="Page not found"
    >
      <div className="text-center px-6">
        <p className="text-label text-accent mb-4">404</p>
        <h1 className="text-h1 text-fg mb-4">Page not found</h1>
        <p className="text-body-lg text-fg-secondary mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="primary" size="lg">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </section>
  );
}
