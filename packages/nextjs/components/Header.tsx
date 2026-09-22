import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="navbar bg-base-100/95 backdrop-blur min-h-0 shrink-0 border-b border-base-300 px-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-0.5 hedera-gradient" />

      <Link href="/" className="flex items-center gap-3 py-3">
        <div className="relative w-9 h-9">
          <Image alt="Hedera icon" className="dark:hidden" fill src="/Hedera-Icon-Dark.svg" />
          <Image alt="Hedera icon" className="hidden dark:block" fill src="/Hedera-Icon-White.svg" />
        </div>

        <div className="flex flex-col">
          <span className="font-bold leading-tight text-base">Proof Anchor</span>
          <span className="text-[10px] tracking-wider uppercase text-base-content/50 font-medium">
            Scaffold-HBAR Template
          </span>
        </div>
      </Link>
    </div>
  );
};
