// app/dashboard/layout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Updated paths to match actual route structure
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
    },
    "/dashboard/coins": {
      title: "",
      description: ""
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
        {
          currentPageDetails?.title === "" ? (<></>
          ) : (
            <div className="">
              <h1 className="text-2xl font-bold">{currentPageDetails.title}</h1>
              <p className="text-gray-500">{currentPageDetails.description}</p>
            </div>
          )}
        {children}
      </div>

      {/* Footer */}
      <div className="w-full flex justify-center items-center mt-8 bg-white min-h-[100px]">
        <Button className=" px-6 py-3 bg-[#E45664] text-white rounded-lg uppercase font-medium">
          Prospering Together
        </Button>
      </div>
    </div>
  );
}
