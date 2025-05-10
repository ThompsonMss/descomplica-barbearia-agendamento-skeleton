import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions as any);

  if (session) {
    redirect("/admin/appointments");
  } else {
    redirect("/admin/sign-in");
  }

  return <></>;
}