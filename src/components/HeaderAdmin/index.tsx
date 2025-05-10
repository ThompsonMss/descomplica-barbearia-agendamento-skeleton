import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

import LogoSVG from "../../assets/logo.png";
import Image from "next/image";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface HeaderProps {
  openDrawer: boolean;
  handleOpenDrawer: () => void;
}

export function Header(props: HeaderProps) {
  const { data } = useSession();

  return (
    <div
      style={{ paddingLeft: 16, paddingRight: 16 }}
      className="z-10 w-full h-16 bg-zinc-50 border-b-2 border-b-zinc-200 flex flex-row items-center justify-between fixed top-0 left-0"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={props.handleOpenDrawer}
          className="h-8 w-8 border border-zinc-400 rounded-sm m-0 p-0 hover:bg-zinc-200 transition-all flex items-center justify-center"
        >
          {props.openDrawer ? (
            <XMarkIcon className="h-6 w-6 text-zinc-500" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-zinc-500" />
          )}
        </button>

        <Link href={"/dashboard"}>
          <Image src={LogoSVG} width={50} height={50} alt="Logotipo" />
        </Link>
        
      </div>

      <span className="text-base text-zinc-800">Olá, {data?.user?.name}</span>
    </div>
  );
}
