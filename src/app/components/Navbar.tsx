import React from "react";
import MaxWidth from "./MaxWidth";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg tranisiton-all">
      <MaxWidth>
        <div className="flex h-16 items-center justify-between ">
          <Link href={"/"} className="flex z-40 font-semibold">
            Ping <span className="text-brand-700">Panda</span>
          </Link>
        </div>
      </MaxWidth>
    </nav>
  );
}

export default Navbar;
