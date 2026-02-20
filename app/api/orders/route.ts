import { NextResponse } from "next/server";
import { addOrder } from "@/lib/orders";

export async function GET() {
  // simple list for debugging
  const { readOrders } = await import("@/lib/orders");
  const orders = await readOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }
    const order = await addOrder({ items: body.items, total: body.total, source: body.source, customer: body.customer });
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
