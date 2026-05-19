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

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    // Daca e admin (company), returnam si serviciile angajatilor
    if (user.accountType === "company") {
      // Serviciile companiei
      const companyProvider = await prisma.provider.findUnique({
        where: { userId: user.id as string },
        include: { services: { orderBy: { createdAt: "desc" } } }
      })

      // Angajatii si serviciile lor
      const employees = await prisma.user.findMany({
        where: { companyId: user.id as string },
        include: {
          provider: {
            include: { services: { orderBy: { createdAt: "desc" } } }
          }
        }
      })

      const companyServices = (companyProvider?.services || []).map(s => ({ ...s, _owner: "company", _ownerName: "Companie" }))
      const employeeServices = employees.flatMap(emp =>
        (emp.provider?.services || []).map(s => ({ ...s, _owner: "employee", _ownerName: emp.name || "Angajat", _employeeId: emp.id }))
      )

      return NextResponse.json({ services: [...companyServices, ...employeeServices] })
    }

    // User simplu sau angajat - doar serviciile proprii
    const provider = await prisma.provider.findUnique({
      where: { userId: user.id as string },
      include: { services: { orderBy: { createdAt: "desc" } } }
    })
    return NextResponse.json({ services: provider?.services || [] })
  } catch (error: any) {
    console.error("Services GET error:", error?.message)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const { name: rawName, duration, price, employeeId, icon, description, gallery } = await request.json()
    const name = (rawName || "").trim().charAt(0).toUpperCase() + (rawName || "").trim().slice(1).toLowerCase()
    if (!name || !duration || !price) {
      return NextResponse.json({ error: "Completati toate campurile obligatorii" }, { status: 400 })
    }
    const targetUserId = employeeId || user.id as string
    let provider = await prisma.provider.findUnique({ where: { userId: targetUserId } })
    if (!provider) {
      provider = await prisma.provider.create({
        data: { userId: targetUserId, isCompany: user.accountType === "company" && !employeeId }
      })
    }
    const service = await prisma.service.create({
      data: {
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        providerId: provider.id,
        icon: icon || "✂️",
        description: description || null,
        gallery: gallery || [],
      }
    })
    return NextResponse.json({ message: "Serviciu adaugat!", service })
  } catch (error: any) {
    console.error("Services POST error:", error?.message)
    return NextResponse.json({ error: error?.message || "Eroare server" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const { id, name: rawName, duration, price, icon, description, gallery, isActive } = await request.json()
    if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
    const name = rawName ? (rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1).toLowerCase()) : undefined
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(duration ? { duration: parseInt(duration) } : {}),
        ...(price ? { price: parseFloat(price) } : {}),
        ...(icon ? { icon } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(gallery ? { gallery } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      }
    })
    return NextResponse.json({ service })
  } catch (error: any) {
    console.error("Services PUT error:", error?.message)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ message: "Serviciu sters!" })
  } catch (error: any) {
    console.error("Services DELETE error:", error?.message)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}