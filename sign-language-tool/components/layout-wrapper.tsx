'use client';

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <Navigation />}
      <main className={`flex-1 ${!isLoginPage ? 'pt-16' : ''}`}>{children}</main>
      {!isLoginPage && <Footer />}
    </div>
  );
} 