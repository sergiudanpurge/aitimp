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
      where: { id: user.id },
      select: { role: true, accountType: true }
    })
    let reviews;
    if (fullUser?.accountType === "company") {
      const employees = await prisma.user.findMany({
        where: { companyId: user.id },
        select: { provider: { select: { id: true } } }
      })
      const providerIds = employees.map((e) => e.provider?.id).filter(Boolean)
      reviews = await prisma.review.findMany({
        where: { providerId: { in: providerIds } },
        include: { client: { select: { id: true, name: true, avatar: true } }, provider: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
        orderBy: { createdAt: "desc" }
      })
    } else if (fullUser?.role === "employee") {
      const provider = await prisma.provider.findUnique({ where: { userId: user.id }, select: { id: true } })
      reviews = await prisma.review.findMany({
        where: { providerId: provider?.id },
        include: { client: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" }
      })
    } else {
      reviews = await prisma.review.findMany({
        where: { clientId: user.id },
        include: { provider: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
        orderBy: { createdAt: "desc" }
      })
    }
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Reviews error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}