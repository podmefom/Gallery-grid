import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIXEL_GRID // Media Archive",
  description: "Advanced media storage and filtering system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="ru" 
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-[#050505] text-zinc-100 antialiased min-h-screen">
        {children}
        
        <Toaster 
          theme="dark" 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#09090b',
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#fff',
              fontFamily: 'var(--font-geist-mono)',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '2px'
            },
          }} 
        />
      </body>
    </html>
  );
}