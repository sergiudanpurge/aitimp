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
     html: `
  <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;background:#0f0e0b;color:#F2ECD8;">
    <h1 style="color:#C9A84C;font-size:26px;margin-bottom:4px;">Aitimp<sup style="font-size:11px;">.ro</sup></h1>
    <hr style="border:none;border-top:1px solid rgba(201,168,76,0.2);margin:16px 0 28px;" />
    <h2 style="font-size:20px;font-weight:700;margin-bottom:12px;">Resetare parolă</h2>
    <p style="color:#7A7060;margin-bottom:28px;line-height:1.7;">Ai solicitat resetarea parolei pentru contul tău Aitimp.ro. Apasă butonul de mai jos — linkul este valabil 1 oră.</p>
    <a href="${process.env.NEXTAUTH_URL}/reset-password/new?token=${token}"
       style="display:inline-block;background:#C9A84C;color:#090806;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.05em;">
      Resetează parola
    </a>
    <p style="color:#5A5040;font-size:12px;margin-top:32px;line-height:1.6;">Dacă nu tu ai solicitat resetarea, ignoră acest email.<br/>© 2025 Aitimp.ro — Toate drepturile rezervate.</p>
  </div>
`
    })

    return NextResponse.json({ message: "Daca emailul exista, vei primi un link." })
  } catch (error) {
    console.error("EROARE:", error)
    return NextResponse.json({ message: "Eroare server" }, { status: 500 })
  }
}