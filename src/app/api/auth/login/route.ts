import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
  return NextResponse.json({ error: "Email sau parolă greșită" }, { status: 401 })
}

if (!user.emailVerified) {
  return NextResponse.json({ error: "Te rugăm confirmă email-ul înainte de a te autentifica!" }, { status: 401 })
}

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Email sau parolă greșită" }, { status: 401 })
    }

    const token = await new SignJWT({ 
      id: user.id, email: user.email, name: user.name, role: user.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret)

    const response = NextResponse.json({ 
      message: "Autentificat!", 
      user: { id: user.id, name: user.name, email: user.email } 
    })
    
    response.cookies.set("auth-token", token, { 
      httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" 
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}