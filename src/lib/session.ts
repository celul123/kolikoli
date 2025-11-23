import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// .env'den gizli anahtarı alıyoruz
const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// JWT'yi şifreleyip cookie'ye yazacak fonksiyon
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // 1 gün geçerlilik süresi (ayarlayabilirsiniz)
    .sign(key);
}

// Cookie'deki JWT'yi deşifre edip doğrulayacak fonksiyon
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Hata durumunda (örn. token süresi dolmuş, imza geçersiz)
    return null;
  }
}

// Oturum oluşturma (Giriş yaparken kullanılacak)
export async function createSession(payload: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 gün
  const session = await encrypt(payload);

  cookies().set("session", session, {
    httpOnly: true, // JavaScript erişemez
    secure: process.env.NODE_ENV === "production", // Sadece HTTPS'te gönder
    expires: expires,
    sameSite: "strict", // CSRF koruması
    path: "/",
  });
}

// Oturumu silme (Çıkış yaparken kullanılacak)
export async function deleteSession() {
  cookies().set("session", "", { expires: new Date(0) });
}

// Mevcut oturumu doğrulama (Middleware ve sayfalarda kullanılacak)
export async function getSession() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  return await decrypt(sessionCookie);
}