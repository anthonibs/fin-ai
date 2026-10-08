import Image from "next/image";
import Link from "next/link";
import Navbar from "./navbar";
import Profile from "./profile";

const Header = () => {
  return (
    <header className="bg-background-muted border-muted-foreground/12 h-16 border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Finance AI - Página inicial">
            <Image src="/logo.svg" alt="" width={154} height={40} priority />
          </Link>

          <Navbar />
        </div>

        <div className="flex items-center">
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
