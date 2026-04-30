import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email obligatoriu" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    })

    if (!user) {
      return NextResponse.json({ message: "Daca emailul exista, vei primi un link." })
    }
    const token = randomBytes(32).toString("hex")

    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken: token }
    })

    await resend.emails.send({
      from: "Aitimp.ro <noreply@aitimp.ro>",
      to: user.email,
      subject: "Reseteaza parola pe Aitimp.ro",
      html: "<p>Reseteaza parola: " + process.env.NEXTAUTH_URL + "/reset-password/new?token=" + token + "</p>"
    })

    return NextResponse.json({ message: "Daca emailul exista, vei primi un link." })
  } catch (error) {
    console.error("EROARE:", error)
    return NextResponse.json({ message: "Eroare server" }, { status: 500 })
  }
}