import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchVehicles } from "@/lib/vehicles";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const [activeVehicles, archivedVehicles] = await Promise.all([
      searchVehicles(q, { archived: false }),
      searchVehicles(q, { archived: true }),
    ]);

    const results = [
      ...activeVehicles.map((v) => ({ ...v, isArchived: false })),
      ...archivedVehicles.map((v) => ({ ...v, isArchived: true })),
    ].slice(0, 8); // Limit to top 8 items for clean dropdown display

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
