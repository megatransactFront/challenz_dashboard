'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Cookies from 'js-cookie';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const isAdmin = Cookies.get('isAdmin');
    setIsAuthenticated(isAdmin === 'true');
  }, [pathname]);

  // Check if on login page
  const isLoginPage = pathname === '/login';

  // Only show sidebar and navbar if authenticated and not on login page
  const showNavigation = isAuthenticated && !isLoginPage;

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-light">
        <UserProvider>
          <div className="flex h-screen overflow-hidden">
            {showNavigation && <Sidebar />}
            <div className="flex-1 flex flex-col min-w-0">
              {showNavigation && <Navbar />}
              <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
                {children}
              </main>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}