import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, password, accountType } = await request.json()

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
        verifyToken
      }
    })

    await resend.emails.send({
      from: "Aitimp.ro <noreply@aitimp.ro>",
      to: email,
      subject: "Confirmă-ți contul pe Aitimp.ro",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;">
          <h1 style="color:#9b6dff;">ai<span style="color:#f97316;">timp</span>.ro</h1>
          <h2>Bună, ${name}!</h2>
          <p>Mulțumim că te-ai înregistrat pe Aitimp.ro.</p>
          <p>Apasă butonul de mai jos pentru a-ți confirma contul:</p>
          <a href="${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verifyToken}" 
             style="display:inline-block;background:#9b6dff;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0;">
            Confirmă contul
          </a>
          <p style="color:#a0a0a0;font-size:13px;">Dacă nu tu ai creat acest cont, ignoră acest email.</p>
        </div>
      `
    })

    return NextResponse.json({ message: "Cont creat! Verifică email-ul pentru confirmare." })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}