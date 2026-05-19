import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[ăâ]/gi, 'a').replace(/[î]/gi, 'i')
    .replace(/[șş]/gi, 's').replace(/[țţ]/gi, 't');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qRaw  = searchParams.get("q") || "";
  const q     = qRaw.trim().charAt(0).toUpperCase() + qRaw.trim().slice(1).toLowerCase();
  const judet = searchParams.get("judet") || "";
  const oras  = searchParams.get("oras") || "";
  const rating = parseFloat(searchParams.get("rating") || "0");
  const tip   = searchParams.get("tip") || "";
  const qNorm = normalizeDiacritics(q);
  const qVariants = q ? [...new Set([q, qNorm, q.toLowerCase(), qNorm.toLowerCase()])] : [];

  try {
    const users = await prisma.user.findMany({
      where: {
        provider: { is: { services: { some: {} }, ...(rating > 0 ? { rating: { gte: rating } } : {}) } },
        ...(tip ? { accountType: tip } : {}),
        ...(judet ? { judet: { equals: judet, mode: "insensitive" } } : {}),
        ...(oras ? { oras: { equals: oras, mode: "insensitive" } } : {}),
        ...(qVariants.length > 0 ? {
          OR: [
            ...qVariants.map(v => ({ name: { contains: v, mode: "insensitive" as const } })),
            ...qVariants.map(v => ({ description: { contains: v, mode: "insensitive" as const } })),
            ...qVariants.map(v => ({ provider: { services: { some: { name: { contains: v, mode: "insensitive" as const } } } } })),
          ],
        } : {}),
      },
      select: {
        id: true, name: true, avatar: true, accountType: true,
        judet: true, oras: true, description: true,
        provider: {
          select: {
            rating: true, gallery: true,
            services: {
              where: { isActive: true },
              select: { id: true, name: true, price: true, duration: true, icon: true },
            }
          }
        }
      },
      take: 50,
    });

    const results = users.map(u => {
      const allServices = u.provider?.services || [];
      // Filtram doar serviciile care match-uiesc cautarea
      const matchingServices = qVariants.length > 0
        ? allServices.filter(s =>
            qVariants.some(v =>
              s.name.toLowerCase().includes(v.toLowerCase()) ||
              normalizeDiacritics(s.name).toLowerCase().includes(normalizeDiacritics(v).toLowerCase())
            )
          )
        : allServices;
      return {
        id: u.id, name: u.name, avatar: u.avatar,
        accountType: u.accountType, judet: u.judet, oras: u.oras,
        description: u.description, rating: u.provider?.rating || 0,
        gallery: u.provider?.gallery || [],
        services: matchingServices,
      };
    }).filter(u => u.services.length > 0); // Afisam doar daca are serviciu matching

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}