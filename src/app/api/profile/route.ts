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

export async function PUT(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const { name, phone, city, cui, avatar, judet, oras, adresa, description, instagram, facebook, website, tiktok, showEmail, showPhone } = await request.json()

    await prisma.user.update({
      where: { id: user.id as string },
      data: {
        name,
        phone,
        city,
        cui,
        avatar,
        judet,
        oras,
        adresa,
        description,
        instagram,
        facebook,
        website,
        tiktok,
        showEmail: showEmail ?? false,
        showPhone: showPhone ?? false,
      }
    })

    return NextResponse.json({ message: "Profil actualizat!" })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}