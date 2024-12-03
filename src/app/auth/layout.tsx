// app/auth/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Challenz",
  description: "Sign in to your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}