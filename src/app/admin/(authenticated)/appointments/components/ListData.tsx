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

import { endOfDay, startOfDay, subDays } from "date-fns";

const prisma = new PrismaClient();

export async function ListData() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/admin/sign-in");
  }

  let hasError = false;

  let data = {
    atual: 0,
    pagarHoje: 0,
    receberHoje: 0,
    despesasAtrasadas: 0,
    receitasAtrasadas: 0,
  };

  {
    /**
    try {
    const dataCurrent = new Date();

    // Recuperando movimentações para pagar hoje.
    const pagaHoje = await prisma.movimento.findMany({
      where: {
        taPago: false,
        tipo: "D",
        excluidoEm: null,
        dataMovimento: {
          gte: startOfDay(dataCurrent),
          lte: endOfDay(dataCurrent),
        },
      },
    });

    data.pagarHoje = pagaHoje.length;

    // Recuperando movimentações para receber hoje.
    const receberHoje = await prisma.movimento.findMany({
      where: {
        taPago: false,
        tipo: "R",
        excluidoEm: null,
        dataMovimento: {
          gte: startOfDay(dataCurrent),
          lte: endOfDay(dataCurrent),
        },
      },
    });

    data.receberHoje = receberHoje.length;

    // Recuperando movimentações de despesas atrasadas.
    const despesasAtrasadas = await prisma.movimento.findMany({
      where: {
        taPago: false,
        tipo: "D",
        excluidoEm: null,
        dataMovimento: {
          lte: endOfDay(subDays(dataCurrent, 1)),
        },
      },
    });

    data.despesasAtrasadas = despesasAtrasadas.length;

    // Recuperando movimentações de receitas atrasadas.
    const receitasAtrasadas = await prisma.movimento.findMany({
      where: {
        taPago: false,
        tipo: "R",
        excluidoEm: null,
        dataMovimento: {
          lte: endOfDay(subDays(dataCurrent, 1)),
        },
      },
    });

    data.receitasAtrasadas = receitasAtrasadas.length;
  } catch (error) {
    hasError = true;
  } finally {
    prisma.$disconnect();
  } */
  }

  if (hasError) {
    return (
      <h3 className="text-red-700 text-2xl font-medium mb-1">
        Erro ao buscar dados.
      </h3>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-stretch justify-between gap-3 flex-col md:flex-row">
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex">
          <div className="flex-1 p-4">
            <h3 className="text-zinc-100 text-2xl font-medium mb-1">
              {data.pagarHoje}
            </h3>
            <span className="text-zinc-400 text-sm">Pagar hoje</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <ArrowUpIcon className="size-14 text-amber-300 opacity-60" />
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex">
          <div className="flex-1 p-4">
            <h3 className="text-zinc-100 text-2xl font-medium mb-1">
              {data.receberHoje}
            </h3>
            <span className="text-zinc-400 text-sm">Receber hoje</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <ArrowDownIcon className="size-14 text-emerald-300 opacity-60" />
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex">
          <div className="flex-1 p-4">
            <h3 className="text-zinc-100 text-2xl font-medium mb-1">
              {" "}
              {data.despesasAtrasadas}
            </h3>
            <span className="text-zinc-400 text-sm">D. Atrasadas</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <ExclamationTriangleIcon className="size-14 text-red-300 opacity-60" />
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex">
          <div className="flex-1 p-4">
            <h3 className="text-zinc-100 text-2xl font-medium mb-1">
              {" "}
              {data.receitasAtrasadas}
            </h3>
            <span className="text-zinc-400 text-sm">R. Atrasadas</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <ExclamationTriangleIcon className="size-14 text-emerald-300 opacity-60" />
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md flex-row flex">
          <div className="flex-1 p-4">
            <h3 className="text-zinc-100 text-2xl font-medium mb-1">R$ </h3>
            <span className="text-zinc-400 text-sm">Caixa Atual</span>
          </div>
          <div className="ml-1 flex items-end mb-1 mr-1">
            <CurrencyDollarIcon className="size-14 text-blue-400 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
