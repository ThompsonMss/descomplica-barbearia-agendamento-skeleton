"use server";

import { revalidatePath } from "next/cache";

import { PrismaClient, User } from "@prisma/client";
import { encryptData } from "@/lib/crypt";

const prisma = new PrismaClient();

export async function createUser(data: User) {
  try {
    // Verificando se existe usuário ativo com esse e-mail.
    const hasUser = await prisma.user.findFirst({
      where: { email: data.email, excluded_at: null },
    });

    if (hasUser)
      throw new Error(`O e-mail "${data.email}" já está sendo usado.`);

    data.password = encryptData(data.password);

    const createUser = await prisma.user.create({ data: data });

    revalidatePath("admin/users");

    return {
      hasError: false,
      data: createUser,
    };
  } catch (error: any) {
    throw new Error(error?.message);
  } finally {
    prisma.$disconnect();
  }
}
