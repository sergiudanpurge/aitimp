import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const loc = searchParams.get("loc") || ""

    const providers = await prisma.provider.findMany({
      include: {
        user: true,
        services: true,
      }
    })

    let results = providers.map((p: any) => ({
      id: p.userId,
      name: p.user.name,
      avatar: p.user.avatar,
      accountType: p.user.accountType,
      oras: p.user.oras,
      city: p.user.city,
      rating: p.rating || null,
      services: p.services,
      minPrice: p.services.length > 0 ? Math.min(...p.services.map((s: any) => s.price)) : null,
    }))

    if (q) {
      results = results.filter((r: any) =>
        r.name?.toLowerCase().includes(q.toLowerCase()) ||
        r.services?.some((s: any) => s.name?.toLowerCase().includes(q.toLowerCase()))
      )
    }

    if (loc) {
      results = results.filter((r: any) =>
        r.oras?.toLowerCase().includes(loc.toLowerCase()) ||
        r.city?.toLowerCase().includes(loc.toLowerCase())
      )
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}