// app/page.tsx
"use client"

import React from "react";
import Dashboard from "./dashboard/page";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
}