import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";
import { PrismaClient } from "@prisma/client";
import { parseISO, startOfDay, endOfDay } from "date-fns";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Parâmetro 'date' é obrigatório." },
        { status: 400 }
      );
    }

    const dataCurrent = parseISO(`${date}T15:00:00.000Z`);

    if (isNaN(dataCurrent.getTime())) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }

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

    return NextResponse.json(pendentes.map((p) => ({ hour: p.hour })));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
