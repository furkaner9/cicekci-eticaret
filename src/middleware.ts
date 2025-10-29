import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/giris?callbackUrl=/admin', req.url))
    }
    
    // Admin kontrolü
    if (req.auth?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Hesabım sayfası
  if (pathname.startsWith('/hesabim')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/giris?callbackUrl=/hesabim', req.url))
    }
  }

  // Giriş ve kayıt sayfaları (zaten giriş yapmışsa)
  if ((pathname === '/giris' || pathname === '/kayit') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/hesabim/:path*', '/giris', '/kayit']
}