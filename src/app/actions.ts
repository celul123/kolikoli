"use server";

import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'crypto'; // Node.js'in güvenli karşılaştırma modülü
import { createSession, deleteSession } from '@/lib/session';

export type FormState = {
  success: boolean;
  message: string;
};

// Güvenli şifre karşılaştırması için bir yardımcı fonksiyon
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    // Farklı uzunluktaki şifreler asla eşleşemez.
    // timingSafeEqual'in hata vermemesi için de bu kontrol şart.
    if (bufA.length !== bufB.length) {
      return false;
    }

    // Sabit zamanda karşılaştırma yapar
    return timingSafeEqual(bufA, bufB);
  } catch (error) {
    console.error("Şifre karşılaştırma hatası:", error);
    return false;
  }
}

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const password = formData.get("password") as string;
  const correctPassword = process.env.LOGIN_PASSWORD;

  if (!correctPassword) {
    console.error("HATA: LOGIN_PASSWORD .env.local dosyasında ayarlanmamış.");
    return { success: false, message: "Sunucu hatası." };
  }

  // 4. Şifreleri GÜVENLİ karşılaştır
  // if (password === correctPassword) { <-- YERİNE
  if (safeCompare(password, correctPassword)) {
    // Şifre DOĞRU ise:
    
    // 1. Oturum (session) oluştur ve cookie'yi ayarla
    await createSession({ user: "admin", loggedInAt: new Date() });

    // 2. /panel sayfasına yönlendir.
    redirect("/panel");

  } else {
    // Şifre YANLIŞ ise:
    return { success: false, message: "Hatalı şifre!" };
  }
}


export async function logoutAction() {
  // 1. lib/session.ts'deki fonksiyonu çağırarak cookie'yi siliyoruz
  await deleteSession();
  
  // 2. Kullanıcıyı ana sayfaya (giriş ekranına) yönlendiriyoruz
  redirect('/');
}