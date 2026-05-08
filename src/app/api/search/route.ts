import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q       = searchParams.get("q") || "";
  const judet   = searchParams.get("judet") || "";
  const oras    = searchParams.get("oras") || "";
  const pretMin = parseFloat(searchParams.get("pretMin") || "0");
  const pretMax = parseFloat(searchParams.get("pretMax") || "999999");
  const rating  = parseFloat(searchParams.get("rating") || "0");
  const tip     = searchParams.get("tip") || "";

  try {
    const users = await prisma.user.findMany({
      where: {
        provider: {
          is: {
            services: { some: {} },
            ...(rating > 0 ? { rating: { gte: rating } } : {}),
          }
        },
        ...(tip ? { accountType: tip } : {}),
        ...(judet ? { judet: { equals: judet, mode: "insensitive" } } : {}),
        ...(oras ? { oras: { equals: oras, mode: "insensitive" } } : {}),
        ...(q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { provider: { services: { some: { name: { contains: q, mode: "insensitive" } } } } },
          ],
        } : {}),
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        accountType: true,
        judet: true,
        oras: true,
        description: true,
        provider: {
          select: {
            rating: true,
            services: {
              where: { isActive: true },
              select: { id: true, name: true, price: true, duration: true, icon: true },
              take: 5,
            }
          }
        }
      },
      take: 50,
    });

    const results = users.map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      accountType: u.accountType,
      judet: u.judet,
      oras: u.oras,
      description: u.description,
      rating: u.provider?.rating || 0,
      services: u.provider?.services || [],
      minPrice: u.provider?.services?.length
        ? Math.min(...u.provider.services.map(s => s.price))
        : null,
    }));

    // Sortare după rating
    results.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[/api/search]", err);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}