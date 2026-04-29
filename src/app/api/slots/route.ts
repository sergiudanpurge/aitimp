import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const date = searchParams.get("date")
    const duration = parseInt(searchParams.get("duration") || "1")

    if (!providerId || !date) {
      return NextResponse.json({ error: "providerId si date sunt obligatorii" }, { status: 400 })
    }

    const provider = await prisma.provider.findUnique({
      where: { id: providerId }
    })

    if (!provider) return NextResponse.json({ error: "Provider negasit" }, { status: 404 })

    const allSlots = generateSlots(provider.workStart, provider.workEnd)

    const bookedSlots = await prisma.availabilitySlot.findMany({
      where: { providerId, date, isBooked: true }
    })

    const bookedTimes = bookedSlots.map(s => s.time)

    const availableSlots = allSlots.filter((slot, index) => {
      for (let i = 0; i < duration; i++) {
        if (!allSlots[index + i] || bookedTimes.includes(allSlots[index + i])) {
          return false
        }
      }
      return true
    })

    return NextResponse.json({ 
      allSlots, 
      bookedTimes, 
      availableSlots 
    })
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}