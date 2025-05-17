import { Suspense } from "react";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

import { ListData } from "./components/ListData";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { ChangeCalendar } from "./components/ChangeCalendar";
import { ListAppointment } from "./components/listAppointment";

export default async function Appointments({
  params,
}: {
  params: any;
}) {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex flex-col">
      <ChangeCalendar dateURL={params.date} />
      <h2
        className="text-zinc-800 text-2xl font-bold mb-6"
        style={{ marginBottom: 20 }}
      >
        Agendamentos em {format(parseISO(params.date), "dd/MM/yyyy")}
      </h2>

      <Suspense
        fallback={
          <>
            <div className="flex flex-1 gap-4">
              <Skeleton className="flex-1 h-24 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex" />
              <Skeleton className="flex-1 h-24 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex" />
              <Skeleton className="flex-1 h-24 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex" />
            </div>
          </>
        }
      >
        <ListData date={params.date} />
      </Suspense>

      <Suspense
        fallback={
          <>
            <Skeleton
              className="w-full h-16 rounded-md bg-zinc-200 mb-2"
              style={{ marginBottom: 8, marginTop: 32 }}
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
        <ListAppointment date={params.date} />
      </Suspense>
    </div>
  );
}
