import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=token-invalid", request.url))
    }

    const user = await prisma.user.findFirst({
      where: { verifyToken: token }
    })

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=token-invalid", request.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null }
    })

    return NextResponse.redirect(new URL("/login?verified=true", request.url))

  } catch (error) {
    return NextResponse.redirect(new URL("/login?error=server", request.url))
  }
}