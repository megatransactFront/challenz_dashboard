// app/dashboard/page.tsx
"use client";

import React from 'react';
import OverviewPage from "./overviews/page";
import supabase from "@/config/supabaseClient"


export default function DashboardOverview() {
  console.log(supabase)
  return <OverviewPage />;
} 