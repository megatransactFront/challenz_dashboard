// app/dashboard/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [childrenLoaded, setChildrenLoaded] = useState(false);

  useEffect(() => {
    setChildrenLoaded(true);
  }, []);

  // Updated paths to match actual route structure
  const pageDetails = {
    "/dashboard": {
      title: "Overview Dashboard",
      description: "View your overview metrics",
      footer: (<></>
      )
    },
    "/dashboard/revenues": {
      title: "Revenue Analytics",
      description: "Track your revenue metrics",
      footer: (
        <></>
      )
    },
    "/dashboard/engagements": {
      title: "Engagement Metrics",
      description: "Monitor user engagement",
      footer: (
        <></>
      )
    },
    "/dashboard/coins": {
      title: "",
      description: "",
      footer: (
        <div className="w-full flex justify-center items-center mt-8 bg-white min-h-[100px]">
          <Button className=" px-6 py-3 bg-[#E45664] text-white rounded-lg uppercase font-medium">
            Prospering Together
          </Button>
        </div>
      )
    }
  } as const;

  const currentPageDetails = pageDetails[pathname as keyof typeof pageDetails] || {
    title: "Dashboard",
    description: "View your metrics"
  };

  return (
    <div>
      <div className=" bg-gray-50">
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
      </div>
      {currentPageDetails?.footer && childrenLoaded && (currentPageDetails?.footer)}
    </div>
  );
}
