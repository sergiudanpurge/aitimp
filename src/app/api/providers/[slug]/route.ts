import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params
    const slug = params.slug

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: slug },
          { name: { equals: slug, mode: "insensitive" } }
        ]
      }
    })

    if (!user) return NextResponse.json({ error: "Prestator negasit" }, { status: 404 })

    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
      include: { services: true }
    })

    let employees: any[] = []
    if (user.accountType === "company") {
      const emps = await prisma.user.findMany({
        where: { companyId: user.id },
        include: { provider: { include: { services: true } } }
      })
      employees = emps.map(e => ({ ...e, services: e.provider?.services || [] }))
    }

    const safeUser = {
      ...user,
      password: undefined,
      verifyToken: undefined,
      email: user.showEmail ? user.email : undefined,
      phone: user.showPhone ? user.phone : undefined,
    }

    return NextResponse.json({ provider: safeUser, employees, services: provider?.services || [] })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}
