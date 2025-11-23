"use client";

import { logoutAction } from "@/app/actions"; // Lütfen bu yolun doğruluğunu kontrol edin
import { LogOut } from "lucide-react"; // 'lucide-react' kullandığınızı varsayıyorum

export function LogoutButton() {
  return (
    // Cookie'yi silmek için 'form' ve 'action' kullanmak zorundayız
    <form action={logoutAction}>
      <button
        type="submit"
        // Sizin <div LİNK> stilinizi buraya kopyalıyoruz
        // ve bir butonun varsayılan görünümünü sıfırlıyoruz
        className="flex items-center hover:text-koli-red-dark hover:opacity-60 font-medium cursor-pointer space-x-2.5  rounded-md transition-all duration-200"
      >
        {/* Sizin <div LİNK> içeriğiniz */}
        <span className="underline">Çıkış Yap</span>
        <LogOut size={18} /> {/* İkonun bir boyuta ihtiyacı olabilir */}
      </button>
    </form>
  );
}