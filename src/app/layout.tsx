import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConsultPrep - Duolingo for Consulting',
  description: 'Master consulting interviews with adaptive micro-learning. Personalized drills, industry insights, and case practice.',
  keywords: ['consulting', 'interview prep', 'McKinsey', 'BCG', 'Bain', 'case interview'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
