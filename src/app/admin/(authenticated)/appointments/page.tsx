import { Suspense } from "react";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

import { ListData } from "./components/ListData";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Appointments() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-zinc-200 text-2xl font-bold mb-6">Dashboard</h2>

      <Suspense
        fallback={
          <div className="flex w-full items-stretch justify-between gap-3 flex-col md:flex-row">
            <Skeleton className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex" />
            <Skeleton className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex" />
            <Skeleton className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex" />
            <Skeleton className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex" />
            <Skeleton className="flex-1 h-24 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex" />
          </div>
        }
      >
        <ListData />
      </Suspense>
    </div>
  );
}
