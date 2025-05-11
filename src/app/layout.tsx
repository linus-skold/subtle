'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AppProvider } from '@/context/AppContext';
import { TaskProvider } from '@/context/TaskContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <TaskProvider>{children}</TaskProvider>
        </AppProvider>
      </body>
    </html>
  );
}
