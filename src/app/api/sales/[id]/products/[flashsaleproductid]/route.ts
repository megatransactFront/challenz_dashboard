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
  const { bonus_promo_discount } = await req.json();

  const { data, error } = await supabase
    .from("flashsaleproducts")
    .update({
      bonus_promo_discount,
    })
    .eq("flashsaleproductsid", params.flashsaleproductid)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Updated", data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { flashsaleproductid: string } }
) {
  const id = params.flashsaleproductid;
  const { error } = await supabase
    .from("flashsaleproducts")
    .delete()
    .eq("flashsaleproductsid", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Flash Sale Product Deleted" });
}
