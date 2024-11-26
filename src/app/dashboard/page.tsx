"use client";

import React from "react";
import { usePathname } from "next/navigation";
import OverviewPage from "./overviews/page";
import RevenuePage from "./revenues/page";
import EngagementPage from "./engagements/page";

export default function Dashboard() {
  const pathname = usePathname();

  // Determine page title and description dynamically
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
      case "/dashboard/overviews":
        return { title: "Overview Dashboard", description: "View your overview metrics" };
      case "/dashboard/revenues":
        return { title: "Revenue Analytics", description: "Track your revenue metrics" };
      case "/dashboard/engagements":
        return { title: "Engagement Metrics", description: "Monitor user engagement" };
      default:
        return { title: "Overview Dashboard", description: "View your overview metrics" };
    }
  };

  // Render the appropriate content based on the route
  const renderContent = () => {
    switch (pathname) {
      case "/dashboard":
      case "/dashboard/overviews":
        return <OverviewPage />;
      case "/dashboard/revenues":
        return <RevenuePage />;
      case "/dashboard/engagements":
        return <EngagementPage />;
      default:
        return <OverviewPage />;
    }
  };

  const { title, description } = getPageTitle();

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main Content */}
      <div className="p-8">
        {/* Page Title and Description */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>

        {/* Dynamic Page Content */}
        <div className="py-4">{renderContent()}</div>
      </div>
    </div>
  );
}
