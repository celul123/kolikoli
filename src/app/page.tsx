"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, CircleAlert } from "lucide-react";

import Logo from "@/components/logo";
import Button from "@/components/ui/button1";
import { Input } from "@/components/ui/input";

import { loginAction, type FormState } from "./actions";

// (LoginButton bileşeninde değişiklik yok)
function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? "Giriş Yapılıyor..." : "Giriş Yap"}
    </Button>
  );
}

// Ana sayfa bileşeni
export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  
  // Hata gösterimini yönetmek için local state
  const [displayError, setDisplayError] = useState<string | null>(null);

  const initialState: FormState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useActionState(loginAction, initialState);

  // 'useActionState'den gelen hatayı local state'e aktarma
  useEffect(() => {
    if (state.message) {
      setDisplayError(state.message);
    }
  }, [state]);

  // Kullanıcı input'a yazmaya başladığında hatayı temizle
  const handleInput = () => {
    if (displayError) {
      setDisplayError(null);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen flex-col">
      <div className="flex items-end mb-5">
        <Logo width={150} height={150} />
        <h1 className="text-5xl font-bold text-koli-orange mb-2">KoliKoli</h1>
      </div>

      <form
        action={formAction}
        className="flex flex-col items-center space-y-5 w-1/4"
      >
        {/* === BURASI DEĞİŞTİ === */}
        {/* Dıştaki div'i 'relative' olmaktan çıkarıp 
          sadece w-full olarak güncelledik.
        */}
        <div className="w-full">
          
          {/* Göz ikonu için bu 'relative' container'ı koruyoruz */}
          <div className="relative w-full">
            <Input
              // Hata varsa 'border-red-500' sınıfını ekliyoruz.
              // 'Input' bileşeniniz zaten border stillerine sahipse
              // 'border-2' veya 'ring-1 ring-red-500' gibi 
              // daha belirgin sınıflar kullanabilirsiniz.
              className={`w-full py-2 pr-10 ${
                displayError ? 'border-red-500' : ''
              }`}
              placeholder="Şifre"
              ring={false}
              type={showPassword ? "text" : "password"}
              name="password"
              required
              // Hata yoksa odaklan
              autoFocus={!displayError}
              // Hata varken input'u KİLİTLEMİYORUZ (kullanıcı hatayı düzeltebilmeli)
              // disabled={!!displayError} <-- KALDIRILDI
              
              // Kullanıcı yazmaya başladığında hatayı temizle
              onInput={handleInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Şifreyi göster/gizle"
              // Hata varken butonu KİLİTLEMİYORUZ
              // disabled={!!displayError} <-- KALDIRILDI
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Hata Mesajı: Input'un altına taşındı */}
          {displayError && (
            <div
              className="flex items-center space-x-2 text-red-600 font-medium text-sm mt-2"
              role="alert"
            >
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}
        </div>
        {/* === DEĞİŞİKLİK SONU === */}

        <LoginButton />
      </form>
    </div>
  );
}