import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token și parolă obligatorii" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Parola trebuie să aibă minim 8 caractere" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { verifyToken: token }
    })

    if (!user) {
      return NextResponse.json({ message: "Link invalid sau expirat" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verifyToken: null
      }
    })

    return NextResponse.json({ message: "Parolă schimbată cu succes!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Eroare server" }, { status: 500 })
  }
}