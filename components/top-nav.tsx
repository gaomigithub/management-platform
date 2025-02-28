"use client";

import { demoHttp } from "@/service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TopNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "数据总览" },
    { href: "/detection-history", label: "检测历史" },
    { href: "/sensitive-content-strategy", label: "敏感内容识别策略管理" },
  ];

  useEffect(() => {
    demoHttp.updateToken(""); // auth token, todo
  });

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">管理平台</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
