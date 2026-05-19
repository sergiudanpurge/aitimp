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
// GET - toate favoritele userului
export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ favorites: [] })
    const favs = await prisma.favorite.findMany({
      where: { userId: user.id as string },
      select: { serviceId: true }
    })
    return NextResponse.json({ favorites: favs.map(f => f.serviceId) })
  } catch (error) {
    return NextResponse.json({ favorites: [] })
  }
}
// POST - toggle favorite
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const { serviceId } = await request.json()
    const existing = await prisma.favorite.findUnique({
      where: { userId_serviceId: { userId: user.id as string, serviceId } }
    })
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ isFavorite: false })
    } else {
      await prisma.favorite.create({ data: { userId: user.id as string, serviceId } })
      return NextResponse.json({ isFavorite: true })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}