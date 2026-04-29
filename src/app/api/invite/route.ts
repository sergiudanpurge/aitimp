import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aitimp-secret-2025")

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } })
    if (!dbUser || dbUser.accountType !== "company") {
      return NextResponse.json({ error: "Doar companiile pot invita angajati" }, { status: 403 })
    }

    const { name, email } = await request.json()
    if (!name || !email) {
      return NextResponse.json({ error: "Nume si email obligatorii" }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "Email deja inregistrat" }, { status: 400 })
    }

    const inviteToken = randomBytes(32).toString("hex")

    const employee = await prisma.user.create({
      data: {
  name,
  email,
  role: "employee",
  accountType: "private",
  emailVerified: false,
  verifyToken: inviteToken,
  password: "",
  companyId: user.id as string
}
    })

    await resend.emails.send({
      from: "Aitimp.ro <noreply@aitimp.ro>",
      to: email,
      subject: `${dbUser.name} te-a invitat pe Aitimp.ro`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;">
          <h1 style="color:#9b6dff;">ai<span style="color:#f97316;">timp</span>.ro</h1>
          <h2>Buna, ${name}!</h2>
          <p><strong>${dbUser.name}</strong> te-a invitat sa te alături echipei pe Aitimp.ro.</p>
          <p>Apasa butonul de mai jos pentru a-ti activa contul si a-ti seta parola:</p>
          <a href="${process.env.NEXTAUTH_URL}/activate?token=${inviteToken}"
             style="display:inline-block;background:#9b6dff;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0;">
            Activeaza contul
          </a>
          <p style="color:#a0a0a0;font-size:13px;">Daca nu cunosti aceasta companie, ignora emailul.</p>
        </div>
      `
    })

    return NextResponse.json({ message: "Invitatie trimisa!", employeeId: employee.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}