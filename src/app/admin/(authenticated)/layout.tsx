"use client";

import { Drawer } from "@/components/Drawer";
import { Header } from "@/components/HeaderAdmin";
import { useState } from "react";

export default function LayoutAuthenticated({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openDrawer, setOpenDrawer] = useState(
    typeof window !== "undefined"
      ? !!localStorage.getItem("openDrawer") || false
      : false
  );

  function handleOpenDrawer(): void {
    if (openDrawer === true) {
      localStorage.removeItem("openDrawer");
    } else {
      localStorage.setItem("openDrawer", "true");
    }

    setOpenDrawer(!openDrawer);
  }

  return (
    <div className="w-full min-h-screen bg-zinc-100 relative">
      <Header openDrawer={openDrawer} handleOpenDrawer={handleOpenDrawer} />
      <Drawer openDrawer={openDrawer} handleOpenDrawer={handleOpenDrawer} />
      <div
        className="w-full p-5 pt-[5.25rem]"
        style={{ padding: 20, paddingTop: 84 }}
      >
        <div
          className="w-full max-w-5xl m-auto"
          style={{ maxWidth: 1024, margin: "auto", width: "100%" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
