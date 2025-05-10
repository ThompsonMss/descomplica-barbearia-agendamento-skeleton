"use server";

import { revalidatePath } from "next/cache";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteUser(id: number) {
  try {
    const updateData = await prisma.user.update({
      where: { id: id },
      data: { excluded_at: new Date() },
    });

    revalidatePath("admin/users");

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
