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

    if (!user) return NextResponse.json({ error: "Prestator negăsit" }, { status: 404 })

    // Luam serviciile proprii
    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
      include: { services: true }
    })

    // Luam angajatii daca e companie
    let employees: any[] = []
    if (user.accountType === "company") {
      const emps = await prisma.user.findMany({
        where: { companyId: user.id },
        include: {
          provider: {
            include: { services: true }
          }
        }
      })
      employees = emps.map(e => ({
        ...e,
        services: e.provider?.services || []
      }))
    }

    return NextResponse.json({
      provider: {
        ...user,
        password: undefined,
      },
      employees,
      services: provider?.services || []
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}