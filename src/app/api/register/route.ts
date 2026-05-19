import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
const { name, email, password, accountType, phone, tara, judet, oras, cui, adresa } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Toate câmpurile sunt obligatorii" }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "Email-ul este deja înregistrat" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyToken = randomBytes(32).toString("hex")

    await prisma.user.create({
     data: {
  name,
  email,
  password: hashedPassword,
  accountType: accountType || "private",
  role: "client",
  emailVerified: false,
  verifyToken,
  phone: phone || null,
  city: oras || null,
  judet: judet || null,
  oras: oras || null,
  adresa: adresa || null,
  cui: cui || null,
}
    })

    await resend.emails.send({
      from: "Aitimp.ro <noreply@aitimp.ro>",
      to: email,
      subject: "Confirmă-ți contul pe Aitimp.ro",
      html: `
  <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;background:#0f0e0b;color:#F2ECD8;">
    <h1 style="color:#C9A84C;font-size:26px;margin-bottom:4px;">Aitimp<sup style="font-size:11px;">.ro</sup></h1>
    <hr style="border:none;border-top:1px solid rgba(201,168,76,0.2);margin:16px 0 28px;" />
    <h2 style="font-size:20px;font-weight:700;margin-bottom:12px;">Bună, ${name}! 👋</h2>
    <p style="color:#7A7060;margin-bottom:28px;line-height:1.7;">Îți mulțumim că te-ai înregistrat pe Aitimp.ro. Apasă butonul de mai jos pentru a-ți confirma adresa de email și a-ți activa contul.</p>
    <a href="${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verifyToken}"
       style="display:inline-block;background:#C9A84C;color:#090806;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.05em;">
      Confirmă contul
    </a>
    <p style="color:#5A5040;font-size:12px;margin-top:32px;line-height:1.6;">Dacă nu tu ai creat acest cont, ignoră acest email.<br/>© 2025 Aitimp.ro — Toate drepturile rezervate.</p>
  </div>
`
    })

    return NextResponse.json({ message: "Cont creat! Verifică email-ul pentru confirmare." })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}