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

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params
    const id = params.id
    const provider = await prisma.provider.findUnique({ where: { id } })
    if (!provider) return NextResponse.json({ gallery: [] })
    return NextResponse.json({ gallery: provider.gallery || [] })
  } catch (error) {
    console.error("GET gallery error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const params = await context.params
    const id = params.id
    const { gallery } = await request.json()
    console.log("PUT gallery id:", id)
    console.log("PUT gallery images:", gallery?.length)
    await prisma.provider.update({
      where: { id },
      data: { gallery }
    })
    return NextResponse.json({ message: "Galerie salvata!", gallery })
  } catch (error) {
    console.error("PUT gallery error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}