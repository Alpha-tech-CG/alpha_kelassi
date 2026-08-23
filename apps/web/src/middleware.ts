import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/update-password', '/verify-otp', '/mfa-challenge', '/cgu', '/confidentialite']
const AUTH_ROUTES = ['/login', '/register']

/**
 * Préfixes consultables sans compte : le catalogue de cours est ouvert pour que
 * n'importe qui puisse découvrir le programme (et pour le référencement). La
 * lecture du contenu d'une leçon reste protégée — la garde est posée dans la
 * page de chapitre, pas ici, car elle dépend du contenu affiché.
 */
const PUBLIC_PREFIXES = ['/cours']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Redirige vers /dashboard si déjà connecté et sur une page auth
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirige vers /login si non connecté et sur une page protégée
  // Les routes /api/ gèrent leur propre authentification (pas de redirect)
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith('/auth'))
    || PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    || pathname.startsWith('/api/')
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
