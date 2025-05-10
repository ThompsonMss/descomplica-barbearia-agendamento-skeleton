import { Suspense } from "react";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { format } from "date-fns";

export default async function Appointments() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  } else {
    redirect(`/admin/appointments/${format(new Date(), "yyyy-MM-dd")}`);
  }

  return <></>;
}
