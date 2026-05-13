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

    const body = await request.json()
    const { name, phone, judet, oras, adresa, description, instagram, facebook, website, tiktok, youtube, linkedin } = body

    const data: any = {}
    if (name !== undefined) data.name = name
    if (phone !== undefined) data.phone = phone
    if (judet !== undefined) data.judet = judet
    if (oras !== undefined) data.oras = oras
    if (adresa !== undefined) data.adresa = adresa
    if (description !== undefined) data.description = description
    if (instagram !== undefined) data.instagram = instagram
    if (facebook !== undefined) data.facebook = facebook
    if (website !== undefined) data.website = website
    if (tiktok !== undefined) data.tiktok = tiktok
    if (youtube !== undefined) data.youtube = youtube
    if (linkedin !== undefined) data.linkedin = linkedin
    if (whatsapp !== undefined) data.whatsapp = whatsapp
    if (contactEmail !== undefined) data.contactEmail = contactEmail

    await prisma.user.update({
      where: { id: user.id as string },
      data,
    })

    return NextResponse.json({ message: "Profil actualizat!" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}