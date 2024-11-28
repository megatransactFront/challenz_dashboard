// app/dashboard/layout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pageDetails = {
    "/dashboard": {
      title: "Overview Dashboard",
      description: "View your overview metrics"
    },
    "/dashboard/revenues": {
      title: "Revenue Analytics",
      description: "Track your revenue metrics"
    },
    "/dashboard/engagements": {
      title: "Engagement Metrics",
      description: "Monitor user engagement"
    }
  } as const;

  const currentPageDetails = pageDetails[pathname as keyof typeof pageDetails] || {
    title: "Dashboard",
    description: "View your metrics"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Page Title and Description */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{currentPageDetails.title}</h1>
          <p className="text-gray-500">{currentPageDetails.description}</p>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}