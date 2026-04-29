import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token si parola obligatorii" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { verifyToken: token }
    })

    if (!user) {
      return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: true,
        verifyToken: null
      }
    })

    await prisma.provider.create({
      data: {
        userId: user.id,
        isCompany: false,
        workStart: "09:00",
        workEnd: "18:00"
      }
    })

    return NextResponse.json({ message: "Cont activat cu succes!" })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}