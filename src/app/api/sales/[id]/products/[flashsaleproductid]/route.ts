import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { flashSaleId: string; flashsaleproductid: string };
  }
) {
  const { bonus_promo_discount, region } = await req.json();

  const { data, error } = await supabase
    .from("flashsaleproducts")
    .update({
      bonus_promo_discount,
      region,
    })
    .eq("flashsaleproductsid", params.flashsaleproductid)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Updated", data });
}
