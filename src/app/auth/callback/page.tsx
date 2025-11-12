import type { Metadata } from "next";
import Link from "next/link";
import { type ReactElement } from "react";

import { Footer, Navbar } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Authentication Callback | Coastal PASS",
  description: "Return to the Coastal PASS application after signing in.",
};

const AuthCallbackPage = (): ReactElement => (
  <>
    <Navbar />
    <main className="flex min-h-[60vh] items-center justify-center bg-surface-muted px-4 py-20">
      <div className="max-w-xl rounded-3xl border border-white/70 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-brand-heading">
          You are all set
        </h1>
        <p className="mt-4 text-brand-body">
          Authentication completed successfully. You can close this tab or
          return to the app to continue your workflow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="font-semibold text-brand-primary transition hover:text-brand-highlight"
          >
            Back to Home
          </Link>
          <span className="hidden text-brand-body sm:inline">&bull;</span>
          <Link
            href="/contact"
            className="font-semibold text-brand-primary transition hover:text-brand-highlight"
          >
            Need help? Contact us
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default AuthCallbackPage;
