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

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const { providerId, serviceId, date, time } = await request.json()

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) return NextResponse.json({ error: "Serviciu negasit" }, { status: 404 })

    const provider = await prisma.provider.findUnique({ where: { id: providerId } })
    if (!provider) return NextResponse.json({ error: "Provider negasit" }, { status: 404 })

    function generateSlots(start: string, end: string): string[] {
      const slots: string[] = []
      const [startH, startM] = start.split(":").map(Number)
      const [endH, endM] = end.split(":").map(Number)
      let h = startH, m = startM
      while (h < endH || (h === endH && m < endM)) {
        slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`)
        m += 30
        if (m >= 60) { h++; m = 0 }
      }
      return slots
    }

    const allSlots = generateSlots(provider.workStart, provider.workEnd)
    const startIndex = allSlots.indexOf(time)
    const slotsNeeded = service.duration

    if (startIndex === -1 || startIndex + slotsNeeded > allSlots.length) {
      return NextResponse.json({ error: "Slot invalid" }, { status: 400 })
    }

    const slotsToBook = allSlots.slice(startIndex, startIndex + slotsNeeded)

    const existing = await prisma.availabilitySlot.findMany({
      where: { providerId, date, time: { in: slotsToBook }, isBooked: true }
    })

    if (existing.length > 0) {
      return NextResponse.json({ error: "Sloturile sunt deja ocupate!" }, { status: 400 })
    }

    await prisma.availabilitySlot.createMany({
      data: slotsToBook.map(t => ({ providerId, date, time: t, isBooked: true }))
    })

    const booking = await prisma.booking.create({
      data: {
        clientId: user.id as string,
        providerId,
        serviceId,
        date,
        time,
        status: "pending",
        totalPrice: service.price,
      }
    })

    return NextResponse.json({ message: "Rezervare creata!", booking })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

    const bookings = await prisma.booking.findMany({
      where: { clientId: user.id as string },
      include: { service: true, provider: { include: { user: true } } },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}