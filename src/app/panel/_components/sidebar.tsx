"use client"; // 👈 ADD THIS LINE at the very top

import Logo from "@/components/logo";
import {
  House,
  Receipt,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation"; // 👈 IMPORT usePathname
import { LogoutButton } from "./LogoutButton"; // 👈 IMPORT the LogoutButton component

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
  const pathname = usePathname(); // 👈 GET the current path

  return (
    <div className="fixed top-0 left-0 bg-sidebar-background flex flex-col text-koli-red-dark h-screen w-[256px]">
      <div className="flex justify-center items-end pt-1 pb-3">
        <Logo width={75} height={75} />
        <h1 className="text-2xl font-bold text-koli-orange mb-1">KoliKoli</h1>
      </div>
      <div className="bg-separator h-[1px]" />

      <div className="flex flex-col justify-between h-full">
        {/* 👇 UPDATED this container (changed padding) */}
        <div className="flex flex-col space-y-3 mt-8 px-4">
          {items.map((item, index) => {
            // 👇 CHECK if this link is active
            const isActive = pathname === item.href;

            return (
              <Link
                href={item.href}
                key={index}
                // 👇 UPDATED className for conditional styling
                className={`
                  font-medium cursor-pointer flex items-center space-x-3 py-2 px-4 rounded-md 
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-koli-red-dark/10 text-koli-red-dark" // Active styles
                      : "hover:text-koli-red-dark hover:opacity-60" // Inactive styles
                  }
                `}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
        <div className="justify-end flex m-2">
          <LogoutButton />
        </div>
     
      </div>
    </div>
  );
};

export default Sidebar;
