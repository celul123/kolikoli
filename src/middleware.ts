import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session'; // session.ts'den fonksiyonu al

// Middleware artık SADECE aşağıda 'matcher' içinde 
// belirtilen yollarda çalışacak.
// Bu nedenle "if (path.startsWith...)" kontrolüne GEREK YOKTUR.
export async function middleware(request: NextRequest) {
  
  // 1. Cookie'yi al
  const sessionCookie = request.cookies.get('session')?.value;

  // 2. Cookie yoksa veya geçersizse giriş sayfasına yönlendir
  if (!sessionCookie) {
    // Doğrudan giriş sayfasına yönlendir
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Cookie'yi deşifre et ve doğrula
  const session = await decrypt(sessionCookie);

  // 4. Geçersiz (örn. süresi dolmuş, imza bozuk) cookie ise
  if (!session) {
    // Kullanıcıyı yönlendirirken geçersiz cookie'yi de temizleyelim
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('session', '', { expires: new Date(0), path: '/' });
    return response;
  }
  
  // 5. Cookie geçerliyse: Kullanıcıyı istediği sayfaya bırak
  return NextResponse.next();
}

// === EN ÖNEMLİ DEĞİŞİKLİK BURADA ===
// Middleware'in SADECE bu yollarda çalışmasını sağla:
export const config = {
  /*
   * Korumak istediğimiz yolları burada listeliyoruz:
   * '/panel': Sadece /panel yolunun kendisi.
   * '/panel/:path*': /panel/satislar, /panel/ayarlar/profil gibi
   * /panel altındaki TÜM yolları kapsar.
   */
  matcher: ['/panel', '/panel/:path*'],
};