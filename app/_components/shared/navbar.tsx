"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-solid px-5 py-4">
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" alt="Finance AI" width={174} height={40} />

        <Link
          href={"/"}
          className={pathname === "/" ? "text-primary font-bold" : "text-muted-foreground"}
        >
          Dashboard
        </Link>
        <Link
          href={"/transactions"}
          className={
            pathname === "/transactions" ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href={"/subscription"}
          className={
            pathname === "/subscription" ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Assinaturas
        </Link>
      </div>

      <UserButton showName />
    </nav>
  );
};

export default Navbar;
