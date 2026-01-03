import type { Metadata } from 'next';
import './globals.css';
import { FavoritesProvider } from '@/components/FavoritesContext';

export const metadata: Metadata = {
  title: 'Restaurant Finder',
  description: 'Find the best restaurants near you',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
