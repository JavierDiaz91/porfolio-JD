import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "lib/data/profile-data.json")

// Datos por defecto hardcodeados iniciales
const defaultProfile = {
  name: "Javier Diaz",
  title: "Full Stack Developer",
  subtitle: "Backend .NET, Frontend Next.js",
  bio: "Soy desarrollador Full Stack con experiencia en backend .NET y frontend con Next.js.",
  email: "contacto@javierdiaz.dev",
  phone: "",
  location: "Rafaela, Santa Fe, Argentina",
  githubUrl: "https://github.com/javierdiaz",
  linkedinUrl: "https://linkedin.com/in/javierdiaz",
  avatarUrl: "",
  resumeUrl: "",
  available: true,
}

// Handler para leer los datos (GET)
export async function GET() {
  try {
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, "utf-8")
      return NextResponse.json(JSON.parse(fileData))
    }
    return NextResponse.json(defaultProfile)
  } catch (error) {
    console.error("Error al leer el perfil:", error)
    return NextResponse.json(defaultProfile)
  }
}

// Handler para guardar los datos (POST)
export async function POST(request: Request) {
  try {
    const updatedProfile = await request.json()

    if (!updatedProfile || !updatedProfile.name) {
      return NextResponse.json({ error: "Datos de perfil inválidos." }, { status: 400 })
    }

    const dirPath = path.dirname(dataPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Guardado físico real en disco
    fs.writeFileSync(dataPath, JSON.stringify(updatedProfile, null, 2), "utf-8")

    return NextResponse.json({ success: true, message: "Perfil persistido con éxito." })
  } catch (error) {
    console.error("Error crítico en el backend de perfil:", error)
    return NextResponse.json({ error: "Error interno al persistir el perfil." }, { status: 500 })
  }
}