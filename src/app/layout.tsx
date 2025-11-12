import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/tailwind.css';

import { ClientProviders } from '@/components/providers/ClientProviders';
import { env } from '@/lib/env';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Coastal PASS | Precision Agriculture',
  description: 'High-tech advantage with old fashioned service.',
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): ReactElement => (
  <html lang="en" className={fontSans.variable} suppressHydrationWarning>
    <body className="bg-white text-slate-900 antialiased">
      <ClientProviders>{children}</ClientProviders>
    </body>
  </html>
);

export default RootLayout;
