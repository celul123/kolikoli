import Logo from "@/components/logo";
import Button from "@/components/ui/button1";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center h-screen flex-col space-y-5">
      <div className="flex items-end">
        <Logo width={150} height={150} />
        <h1 className="text-5xl font-bold text-koli-orange mb-2">KoliKoli</h1>
      </div>
      <Input className="w-1/4 py-2" placeholder="Şifre" ring={false} />
      <Link href="/panel">
        <Button>Giriş Yap</Button>
      </Link>
    </div>
  );
}
