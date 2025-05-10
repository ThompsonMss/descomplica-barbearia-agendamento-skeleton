"use server";

import { PrismaClient, Appointment } from "@prisma/client";
import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";

const prisma = new PrismaClient();

export async function createAppoitment(data: Appointment) {
  try {
    // Verificando se existe usuário ativo com esse e-mail.
    const hasAppointment = await prisma.appointment.findFirst({
      where: {
        date: data.date,
        hour: data.hour,
        status: EnumStatusAppointment.PENDING,
        excluded_at: null,
      },
    });

    if (hasAppointment)
      throw new Error(`O horário "${data.hour}" já tem agendamento marcado.`);

    const createData = await prisma.appointment.create({ data: data });

    return {
      hasError: false,
      data: createData,
    };
  } catch (error: any) {
    throw new Error(error?.message);
  } finally {
    prisma.$disconnect();
  }
}
