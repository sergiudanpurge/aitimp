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

    const { name, duration, price, employeeId } = await request.json()

    if (!name || !duration || !price) {
      return NextResponse.json({ error: "Toate campurile sunt obligatorii" }, { status: 400 })
    }

    let provider = await prisma.provider.findUnique({
      where: { userId: employeeId || user.id as string }
    })

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          userId: user.id as string,
          isCompany: false,
        }
      })
    }

    const service = await prisma.service.create({
      data: {
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        providerId: provider.id,
      }
    })

    return NextResponse.json({ message: "Serviciu adaugat!", service })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}