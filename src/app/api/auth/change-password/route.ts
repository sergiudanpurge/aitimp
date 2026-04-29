import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const { currentPassword, newPassword } = await request.json()

    const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } })
    if (!dbUser || !dbUser.password) {
      return NextResponse.json({ error: "User negasit" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isValid) {
      return NextResponse.json({ error: "Parola curenta este gresita" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id as string },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: "Parola schimbata cu succes!" })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}