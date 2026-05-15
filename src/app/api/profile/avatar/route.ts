import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

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

    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "Niciun fisier" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    const formDataCloud = new FormData()
    formDataCloud.append("file", dataUri)
    formDataCloud.append("upload_preset", uploadPreset!)
    formDataCloud.append("folder", "avatars")

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formDataCloud,
    })

    const data = await res.json()
    if (!data.secure_url) return NextResponse.json({ error: "Upload esuat" }, { status: 500 })

    await prisma.user.update({
      where: { id: user.id as string },
      data: { avatar: data.secure_url },
    })

    return NextResponse.json({ url: data.secure_url })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Eroare server" }, { status: 500 })
  }
}