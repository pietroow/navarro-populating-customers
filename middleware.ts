import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  // Permitir acesso à página de login
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next()
  }

  // Verificar sessão para todas as outras rotas
  const cookieStore = await cookies()
  const session = cookieStore.get("session_user")

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
