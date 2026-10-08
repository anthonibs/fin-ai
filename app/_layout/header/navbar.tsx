"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transações" },
  { href: "/subscription", label: "Assinaturas" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label="Navegação principal">
      {NAV_LINKS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-accent/70 text-foreground/90 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
