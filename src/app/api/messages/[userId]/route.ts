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
    const otherId = params.userId

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: user.id as string, toId: otherId },
          { fromId: otherId, toId: user.id as string },
        ]
      },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}