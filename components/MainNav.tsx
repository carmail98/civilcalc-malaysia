"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MainNav() {
  const pathname = usePathname() || "/";
  return (
    <>
      {navLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-amber-700 font-semibold border-b-2 border-amber-500 pb-0.5 transition-colors"
                : "text-stone-600 hover:text-amber-700 transition-colors"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
