import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params

    const user = await prisma.user.findUnique({
      where: { id: slug },
      select: {
        id: true, name: true, email: true, role: true, accountType: true,
        avatar: true, phone: true, judet: true, oras: true, description: true,
        facebook: true, instagram: true, tiktok: true, website: true,
        youtube: true, linkedin: true, whatsapp: true, contactEmail: true,
        showEmail: true, showPhone: true, companyId: true,
        company: { select: { id: true, name: true, avatar: true, oras: true, judet: true } },
        provider: {
          select: {
            id: true, gallery: true, rating: true, reviewCount: true,
            workStart: true, workEnd: true,
            services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true, description: true, gallery: true } }
          }
        },
        employees: {
          where: { isActive: true },
          select: {
            id: true, name: true, avatar: true, description: true, oras: true,
            instagram: true, facebook: true,
            provider: {
              select: {
                id: true, gallery: true, rating: true, reviewCount: true,
                workStart: true, workEnd: true,
                services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true, description: true, gallery: true } }
              }
            }
          }
        }
      }
    })

    if (!user) return NextResponse.json({ error: "Profil negasit" }, { status: 404 })

    // Fetch recenzii fara relatii (Review nu are relatii in schema)
    let rawReviews: any[] = []
    if (user.accountType === "company") {
      const empProviderIds = (user as any).employees.map((e: any) => e.provider?.id).filter(Boolean)
      rawReviews = await prisma.review.findMany({
        where: { providerId: { in: empProviderIds } },
        orderBy: { createdAt: "desc" }, take: 20
      })
    } else if ((user as any).provider) {
      rawReviews = await prisma.review.findMany({
        where: { providerId: (user as any).provider.id },
        orderBy: { createdAt: "desc" }, take: 20
      })
    }

    // Fetch clienti separat
    const clientIds = [...new Set(rawReviews.map(r => r.clientId))]
    const clients = await prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, name: true, avatar: true }
    })
    const clientMap = Object.fromEntries(clients.map(c => [c.id, c]))

    const reviews = rawReviews.map(r => ({
      ...r,
      client: clientMap[r.clientId] || { name: "Client", avatar: null }
    }))

    return NextResponse.json({
      provider: user,
      employees: (user as any).employees || [],
      services: (user as any).provider?.services || [],
      reviews,
    })
  } catch (error) {
    console.error("Public profile error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}