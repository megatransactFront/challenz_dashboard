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

  const pageDetails: { [key: string]: { title: string; description: string; footer: React.ReactNode } } = {
    "/dashboard": {
      title: "Overview Dashboard",
      description: "View your overview metrics",
      footer: null,
    },
    "/dashboard/revenues": {
      title: "Revenue Analytics",
      description: "Track your revenue metrics",
      footer: null,
    },
    "/dashboard/engagements": {
      title: "Engagement Metrics",
      description: "Monitor user engagement",
      footer: null,
    },
    "/dashboard/coins": {
      title: "",
      description: "",
      footer: (
        <div className="w-full flex justify-center items-center m-0 p-0 mt-0 bg-white min-h-[100px]">
          <Button className="px-6 py-3 bg-secondary text-white rounded-lg uppercase font-medium">
            Prospering Together
          </Button>
        </div>
      ),
    },
    "/dashboard/coins/history/*": {
      title: "",
      description: "",
      footer: (
        <div className="w-full flex justify-center items-center m-0 p-0 mt-0 bg-white min-h-[100px]">
          <Button className="px-6 py-3 bg-secondary text-white rounded-lg uppercase font-medium">
            Prospering Together
          </Button>
        </div>
      ),
    },
  };

  const resolvePageDetails = (path: string) => {
    const entry = Object.entries(pageDetails).find(([pattern]) => {
      if (pattern.includes("*")) {
        const base = pattern.replace("/*", "");
        return path.startsWith(base);
      }
      return pattern === path;
    });
    return entry?.[1] ?? { title: "", description: "", footer: null };
  };

  const currentPageDetails = resolvePageDetails(pathname);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-gray-50">
        <div className="p-8">
          {currentPageDetails.title && (
            <div>
              <h1 className="text-2xl font-bold">{currentPageDetails.title}</h1>
              <p className="text-gray-500">{currentPageDetails.description}</p>
            </div>
          )}
          {children}
        </div>
      </div>
      {currentPageDetails.footer && childrenLoaded && currentPageDetails.footer}
    </div>
  );
}