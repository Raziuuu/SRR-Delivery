import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'SRR Fresh - Express Grocery Delivery',
  description: 'Farm-fresh vegetables, organic fruits, dairy & daily essentials delivered directly to your doorstep in Melkar, BC Road, and surrounding areas.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="bg-neutral-50 text-neutral-900 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
