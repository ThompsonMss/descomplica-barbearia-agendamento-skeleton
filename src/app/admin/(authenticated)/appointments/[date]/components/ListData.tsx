export const dynamic = "force-dynamic";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { PrismaClient, Prisma } from "@prisma/client";

import { endOfDay, parseISO, startOfDay, subDays } from "date-fns";
import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";
import { CircleCheck, CircleX } from "lucide-react";

const prisma = new PrismaClient();

export async function ListData({ date }: { date: string }) {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  }

  let hasError = false;

  let data = {
    pendentes: 0,
    realizados: 0,
    cancelados: 0,
  };

  {
    try {
      const dataCurrent = parseISO(date);

      const pendentes = await prisma.appointment.findMany({
        where: {
          status: EnumStatusAppointment.PENDING,
          excluded_at: null,
          date: {
            gte: startOfDay(dataCurrent),
            lte: endOfDay(dataCurrent),
          },
        },
      });

      data.pendentes = pendentes.length;

      const realizados = await prisma.appointment.findMany({
        where: {
          status: EnumStatusAppointment.ATTENDED,
          excluded_at: null,
          date: {
            gte: startOfDay(dataCurrent),
            lte: endOfDay(dataCurrent),
          },
        },
      });

      data.realizados = realizados.length;

      const cancelados = await prisma.appointment.findMany({
        where: {
          status: EnumStatusAppointment.CANCELED,
          excluded_at: null,
          date: {
            gte: startOfDay(dataCurrent),
            lte: endOfDay(dataCurrent),
          },
        },
      });

      data.cancelados = cancelados.length;
    } catch (error) {
      hasError = true;
    } finally {
      prisma.$disconnect();
    }
  }

  if (hasError) {
    return (
      <h3 className="text-red-500 text-2xl font-medium mb-1">
        Erro ao buscar dados.
      </h3>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-stretch justify-between gap-3 flex-col md:flex-row">
        <div
          style={{ padding: 12 }}
          className="flex-1 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex"
        >
          <div className="flex-1 p-4">
            <h3 className="text-zinc-800 text-2xl font-medium mb-1">
              {data.pendentes}
            </h3>
            <span className="text-zinc-600 text-sm">Pendentes</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <ExclamationTriangleIcon className="size-14 text-amber-600 opacity-60" />
          </div>
        </div>

        <div
          style={{ padding: 12 }}
          className="flex-1 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex"
        >
          <div className="flex-1 p-4">
            <h3 className="text-zinc-800 text-2xl font-medium mb-1">
              {data.realizados}
            </h3>
            <span className="text-zinc-600 text-sm">Realizados</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <CircleCheck className="size-14 text-green-600 opacity-60" />
          </div>
        </div>

        <div
          style={{ padding: 12 }}
          className="flex-1 bg-zinc-200 border border-zinc-300 rounded-md flex-row flex"
        >
          <div className="flex-1 p-4">
            <h3 className="text-zinc-800 text-2xl font-medium mb-1">
              {data.cancelados}
            </h3>
            <span className="text-zinc-600 text-sm">Cancelados</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <CircleX className="size-14 text-red-600 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
