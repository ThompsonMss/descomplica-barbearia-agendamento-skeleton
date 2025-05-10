export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { CreateUser } from "./components/createUser";
import { ListData } from "./components/listUsers";

import { Skeleton } from "@/components/ui/skeleton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function Users() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-end">
        <CreateUser />
      </div>

      <div
        className="bg-zinc-50 border border-zinc-200 p-8 rounded-md"
        style={{ marginTop: 20, padding: 32 }}
      >
        <h2 className="text-zinc-800 text-2xl" style={{ marginBottom: 16 }}>
          Usuários
        </h2>

        <Suspense
          fallback={
            <>
              <Skeleton
                className="w-full h-16 rounded-md bg-zinc-200 mb-2"
                style={{ marginBottom: 8 }}
              />
              <Skeleton
                className="w-full h-16 rounded-md bg-zinc-200 mb-2"
                style={{ marginBottom: 8 }}
              />
              <Skeleton
                className="w-full h-16 rounded-md bg-zinc-200 mb-2"
                style={{ marginBottom: 8 }}
              />
              <Skeleton className="w-full h-16 rounded-md bg-zinc-200" />
            </>
          }
        >
          <ListData />
        </Suspense>
      </div>
    </div>
  );
}
