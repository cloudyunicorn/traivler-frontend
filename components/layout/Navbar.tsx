"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-accent-light flex items-center justify-center transition-transform group-hover:scale-110">
            <HiOutlineGlobeAlt className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Traivler</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/plan"
            className="btn-primary !py-2 !px-5 !text-sm !rounded-lg flex items-center gap-2"
          >
            Plan Trip
          </Link>
        </div>
      </div>
    </nav>
  );
}
