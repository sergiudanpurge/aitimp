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

export async function DELETE(request: Request, context: any) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const params = await context.params
    const id = params.id
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ message: "Serviciu sters!" })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const params = await context.params
    const id = params.id
    const { name, price, duration, icon, description } = await request.json()
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        icon: icon || "✂️",
      }
    })
    return NextResponse.json({ message: "Serviciu actualizat!", service })
  } catch (error) {
    console.error("PUT error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}