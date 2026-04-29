import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json({ user: payload })
  } catch {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 })
  }
}