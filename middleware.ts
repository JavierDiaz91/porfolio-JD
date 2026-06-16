import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // 1. Obtener las credenciales guardadas en las variables de entorno
  const adminUser = process.env.ADMIN_USER
  const adminPassword = process.env.ADMIN_PASSWORD

  // 2. Extraer los datos que el usuario pone en el cartel de autenticación del navegador
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')

  if (authHeader) {
    // El header viene como "Basic Base64Strings==", lo separamos y decodificamos
    const auth = authHeader.split(' ')[1]
    const [user, password] = atob(auth).split(':')

    // 3. Si el usuario y contraseña coinciden, lo dejamos pasar al panel
    if (user === adminUser && password === adminPassword) {
      return NextResponse.next()
    }
  }

  // 4. Si los datos están mal o todavía no puso nada, disparamos el prompt del navegador
  return new NextResponse('Acceso denegado. Se requieren credenciales.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Panel de Administracion Portfolio"',
    },
  })
}

// 🎯 CONFIGURACIÓN CRUCIAL: Indicamos que este Middleware SOLO se ejecute en las rutas de administración
export const config = {
  matcher: ['/admin/:path*', '/admin'], // Ajustá "/admin" si tu carpeta del panel se llama de otra forma
}