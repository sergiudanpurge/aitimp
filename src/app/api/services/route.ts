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

    const provider = await prisma.provider.findUnique({
      where: { userId: user.id as string },
      include: { services: true }
    })

    if (!provider) return NextResponse.json({ services: [] })

    return NextResponse.json({ services: provider.services })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const { name: rawName, duration, price, employeeId, icon } = await request.json()

    if (!name || !duration || !price) {
      return NextResponse.json({ error: "Toate campurile sunt obligatorii" }, { status: 400 })
    }

    const targetUserId = employeeId || user.id as string

    let provider = await prisma.provider.findUnique({
      where: { userId: targetUserId }
    })

    console.log("targetUserId:", targetUserId)
    console.log("provider gasit:", provider?.userId)

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          userId: targetUserId,
          isCompany: false,
        }
      })
      console.log("provider creat:", provider.userId)
    }

    const service = await prisma.service.create({
      data: {
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        providerId: provider.id,
        icon: icon || "✂️",
      }
    })

    return NextResponse.json({ message: "Serviciu adaugat!", service })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}