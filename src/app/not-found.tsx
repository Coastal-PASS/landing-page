import Image from 'next/image';
import Link from 'next/link';
import { type ReactElement } from 'react';

const NotFound = (): ReactElement => (
  <main className="flex min-h-[60vh] items-center justify-center bg-surface-muted px-4 py-20">
    <div className="max-w-2xl space-y-6 text-center">
      <div className="mx-auto w-60">
        <Image src="/assets/img/error.png" alt="Page not found" width={240} height={200} />
      </div>
      <h1 className="text-3xl font-semibold text-brand-heading">Page not found</h1>
      <p className="text-brand-body">
        Sorry, we can&apos;t find that page. The link may be broken or the page may have been removed.
      </p>
      <Link href="/" className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary/90">
        Back to Home
      </Link>
    </div>
  </main>
);

export default NotFound;
