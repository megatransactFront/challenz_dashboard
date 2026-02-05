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
    params: Promise<{ flashSaleId: string; flashsaleserviceid: string }>;
  }
) {
  const { flashsaleserviceid } = await params;
  const { bonus_promo_discount } = await req.json();

  const { data, error } = await supabase
    .from("flashsaleservices")
    .update({
      bonus_promo_discount,
    })
    .eq("flashsaleserviceid", flashsaleserviceid)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Updated", data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ flashsaleserviceid: string }> }
) {
  const { flashsaleserviceid: id } = await params;
  const { error } = await supabase
    .from("flashsaleservices")
    .delete()
    .eq("flashsaleserviceid", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Flash Sale service Deleted" });
}
