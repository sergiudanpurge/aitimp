import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    }
    const { payload } = await jwtVerify(token, secret)
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountType: true,
        city: true,
        phone: true,
        avatar: true,
        cui: true,
        isActive: true,
        judet: true,
        oras: true,
        adresa: true,
        description: true,
        facebook: true,
        instagram: true,
        tiktok: true,
        website: true,
        youtube: true,
        linkedin: true,
        whatsapp: true,
        contactEmail: true,
        showEmail: true,
        showPhone: true,
        provider: {
          select: {
            gallery: true,
            description: true,
            rating: true,
            reviewCount: true,
          }
        },
      }
    })

    if (!user) return NextResponse.json({ error: "User negasit" }, { status: 404 })
    
    // Merge provider data in user
    const userWithGallery = {
      ...user,
      gallery: (user as any).provider?.gallery || [],
      rating: (user as any).provider?.rating || 0,
      reviewCount: (user as any).provider?.reviewCount || 0,
    }
    
    return NextResponse.json({ user: userWithGallery })
  } catch {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 })
  }
}