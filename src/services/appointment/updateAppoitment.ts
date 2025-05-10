"use server";

import { revalidatePath } from "next/cache";

import { PrismaClient, Appointment } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateAppoitment(
  id: number,
  data: Appointment,
  date: string
) {
  try {
    const hasUser = await prisma.user.findFirst({
      where: { id: id, excluded_at: null },
    });

    if (!hasUser) throw new Error(`Agendamento não localizado.`);

    const updateData = await prisma.appointment.update({
      data: data,
      where: { id: id },
    });

    revalidatePath(`admin/appointments/${date}`);

    return {
      hasError: false,
      data: updateData,
    };
  } catch (error: any) {
    throw new Error(error?.message);
  } finally {
    prisma.$disconnect();
  }
}
