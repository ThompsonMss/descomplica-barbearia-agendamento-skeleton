import {
  CalendarIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DrawerProps {
  openDrawer: boolean;
  handleOpenDrawer: () => void;
}

export function Drawer(props: DrawerProps) {
  const pathname = usePathname();

  return (
    <div className="relative">
      {/** Backdrop */}
      <div
        className={`w-full backdrop-blur-sm h-screen ${
          props.openDrawer ? "fixed" : "hidden"
        } top-16 z-30`}
      ></div>

      {/** Drawer */}
      <nav
        style={{ paddingTop: 16, paddingLeft: 16 }}
        className={`top-16 z-40 fixed left-0 w-full h-[calc(100vh_-_4rem)] bg-zinc-50 border-r-2 border-r-zinc-200 ${
          !props.openDrawer ? "md:-translate-x-72 -translate-x-full" : ""
        } transition-all pt-11 px-5 md:w-72`}
      >
        <ul className="w-full flex flex-col justify-start md:items-start items-center gap-4">
          <Link
            href={"/admin/appointments"}
            prefetch={false}
            onClick={props.handleOpenDrawer}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <CalendarIcon
              className={`${
                pathname === "/admin/appointments"
                  ? "text-sky-800"
                  : "text-zinc-800"
              } size-5 group-hover:text-zinc-600`}
            />
            <span
              className={`${
                pathname === "/admin/appointments"
                  ? "text-sky-800"
                  : "text-zinc-800"
              } text-lg group-hover:text-zinc-600`}
            >
              Agendamentos
            </span>
          </Link>

          <Link
            href={"/admin/users"}
            prefetch={false}
            onClick={props.handleOpenDrawer}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <UserIcon
              className={`${
                pathname === "/admin/users" ? "text-sky-800" : "text-zinc-800"
              } size-5 group-hover:text-zinc-600`}
            />
            <span
              className={`${
                pathname === "/admin/users" ? "text-sky-800" : "text-zinc-800"
              } text-lg group-hover:text-zinc-600`}
            >
              Usuários
            </span>
          </Link>

          <div
            onClick={() => {
              props.handleOpenDrawer();
              signOut();
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <XCircleIcon className="text-red-400 size-5 group-hover:text-red-300" />
            <span className="text-red-400 text-lg group-hover:text-red-300">
              Sair
            </span>
          </div>
        </ul>
      </nav>
    </div>
  );
}
