import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
const prisma = new PrismaClient()
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")
async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  const { payload } = await jwtVerify(token, secret)
  return payload
}
export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { role: true, accountType: true }
    })
    let rawReviews: any[] = [];
    if (fullUser?.accountType === "company") {
      const employees = await prisma.user.findMany({
        where: { companyId: user.id as string },
        select: { provider: { select: { id: true } } }
      })
      const providerIds = employees.map((e) => e.provider?.id).filter(Boolean) as string[]
      rawReviews = await prisma.review.findMany({
        where: { providerId: { in: providerIds } },
        orderBy: { createdAt: "desc" }
      })
    } else if (fullUser?.role === "employee") {
      const provider = await prisma.provider.findUnique({ where: { userId: user.id as string }, select: { id: true } })
      rawReviews = await prisma.review.findMany({
        where: { providerId: provider?.id },
        orderBy: { createdAt: "desc" }
      })
    } else {
      rawReviews = await prisma.review.findMany({
        where: { clientId: user.id as string },
        orderBy: { createdAt: "desc" }
      })
    }

    // Fetch related users separately
    const clientIds = [...new Set(rawReviews.map(r => r.clientId))]
    const providerIds2 = [...new Set(rawReviews.map(r => r.providerId))]
    
    const clients = await prisma.user.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, name: true, avatar: true }
    })
    const providers = await prisma.provider.findMany({
      where: { id: { in: providerIds2 } },
      select: { id: true, user: { select: { id: true, name: true, avatar: true } } }
    })

    const reviews = rawReviews.map(r => ({
      ...r,
      client: clients.find(c => c.id === r.clientId) || null,
      provider: providers.find(p => p.id === r.providerId) || null,
    }))

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Reviews error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}
