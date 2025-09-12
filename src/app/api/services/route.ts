// app/api/services/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const serviceId = searchParams.get("serviceId");
    const region = searchParams.get("region") || "";
    const q = searchParams.get("q") || "";

    // If serviceId is passed → fetch single service
    if (serviceId) {
      const { data: service, error } = await supabase
        .from("services")
        .select(
          `
          id,
          name,
          region,
          description,
          created_at,
          standardPrice,
          discountedPrice,
          duration_months,
          uwaciCoinsRequired,
          cancellationPolicy,
          minimum_term,
          image_url
        `
        )
        .eq("id", serviceId)
        .single();

      if (error) throw error;
      return NextResponse.json(service);
    }

    // pagination range
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // count query
    let countQuery = supabase
      .from("services")
      .select("id", { count: "exact", head: true });

    if (region) countQuery = countQuery.eq("region", region);
    if (q) countQuery = countQuery.ilike("name", `%${q}%`);

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    // data query
    let servicesQuery = supabase
      .from("services")
      .select(
        `
        id,
        name,
        region,
        description,
        created_at,
        standardPrice,
        discountedPrice,
        duration_months,
        uwaciCoinsRequired,
        cancellationPolicy,
        minimum_term,
        image_url
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (region) servicesQuery = servicesQuery.eq("region", region);
    if (q) servicesQuery = servicesQuery.ilike("name", `%${q}%`);

    const { data: services, error: dataError } = await servicesQuery;
    if (dataError) throw dataError;

    return NextResponse.json({
      services: services || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("API Error (services):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
