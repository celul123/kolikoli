import Logo from "@/components/logo";
import {
  House,
  LogOut,
  Receipt,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const items = [
  {
    title: "Ana Sayfa",
    icon: <House />,
    href: "/panel",
  },
  {
    title: "Satışlar",
    icon: <Receipt />,
    href: "/panel/satislar",
  },
  {
    title: "Ürünler",
    icon: <ShoppingBasket />,
    href: "/panel/urunler",
  },
  {
    title: "Müşteriler",
    icon: <UsersRound />,
    href: "/panel/musteriler",
  },
];

const Sidebar = () => {
  return (
    <div className="bg-sidebar-background flex flex-col text-koli-red-dark h-screen w-[256px]">
      <div className="flex justify-center items-end pt-1 pb-3">
        <Logo width={75} height={75} />
        <h1 className="text-2xl font-bold text-koli-orange mb-1">KoliKoli</h1>
      </div>
      <div className="bg-separator h-[1px]" />

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col space-y-5 mt-8 pl-8">
          {items.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="hover:text-koli-red-dark hover:opacity-60 font-medium cursor-pointer flex space-x-2 rounded-md transition-all duration-200"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        <Link href=" /">
          <div className="flex justify-end hover:text-koli-red-dark hover:opacity-60 font-medium cursor-pointer space-x-2.5 py-2 px-3 rounded-md transition-all duration-200">
            <span className="underline">Çıkış Yap</span>
            <LogOut />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
