import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist_Sans to Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Changed from geistSans to inter
  variable: '--font-inter', // Changed CSS variable name
  subsets: ['latin'],
});

// Geist Mono is available if needed, but not explicitly used in the design
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Feature Forge',
  description: 'Generate features for your app ideas with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}> {/* Used inter.variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
