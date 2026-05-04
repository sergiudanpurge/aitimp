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
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const params = await context.params
    const id = params.id

    console.log("Cautam provider pentru userId:", id)

    const employee = await prisma.user.findUnique({
      where: { id }
    })

    if (!employee) return NextResponse.json({ error: "Angajat negasit" }, { status: 404 })

    const provider = await prisma.provider.findUnique({
      where: { userId: id },
      include: { services: true }
    })

    console.log("Provider gasit:", provider?.id)
    console.log("Servicii:", provider?.services?.length)

    return NextResponse.json({ 
      employee, 
      services: provider?.services || [],
      provider
    })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const params = await context.params
    const id = params.id
    const { isActive } = await request.json()

    await prisma.user.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json({ message: "Angajat actualizat!" })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}