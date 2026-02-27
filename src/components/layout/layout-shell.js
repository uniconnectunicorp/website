"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import WhatsappFloat from "@/components/layout/Whatsapp";

export function LayoutShell() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <>
      <Footer />
      <WhatsappFloat />
    </>
  );
}

// Default export to ensure compatibility when imported without named destructuring
export default LayoutShell;
