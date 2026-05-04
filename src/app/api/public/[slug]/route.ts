import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params
    const slug = params.slug
    console.log("Public profile slug:", slug)

    const user = await prisma.user.findUnique({
      where: { id: slug },
      include: {
        provider: { include: { services: true } },
        employees: {
          include: {
            provider: { include: { services: true } }
          }
        }
      }
    })

    console.log("User found:", user?.id, user?.name)

    if (!user) return NextResponse.json(null, { status: 404 })

    const result = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      accountType: user.accountType,
      oras: user.oras,
      judet: user.judet,
      phone: user.phone,
      email: user.email,
      cui: user.cui,
      description: user.provider?.description || null,
      rating: user.provider?.rating || null,
      reviewCount: user.provider?.reviewCount || 0,
      reviews: [],
      employees: user.accountType === "company" ? (user.employees || []).map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        avatar: emp.avatar,
        rating: emp.provider?.rating || null,
        services: emp.provider?.services || [],
      })) : [],
      services: user.provider?.services || [],
      provider: user.provider || null,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Public profile error:", error)
    return NextResponse.json(null, { status: 500 })
  }
}