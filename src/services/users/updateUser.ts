"use server";

import { revalidatePath } from "next/cache";

import { PrismaClient, User } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export async function updateUser(id: number, data: User) {
  try {
    const hasUser = await prisma.user.findFirst({
      where: { id: id, excluded_at: null },
    });

    if (!hasUser) throw new Error(`Usuário não localizado.`);

    // Verificando se o e-mail alterou.
    if (hasUser.email !== data.email) {
      // Verificando se existe usuário ativo com esse e-mail.
      const hasUserWithEmail = await prisma.user.findFirst({
        where: { email: data.email, excluded_at: null },
      });

      if (hasUserWithEmail)
        throw new Error(`O e-mail "${data.email}" já está sendo usado.`);
    }

    const newData: any = {
      name: data.name,
      email: data.email,
    };

    // Verificando se precisa atualizar a senha.
    if (data.password.length > 0) {
      let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
      let encrypted = cipher.update(data.password);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      newData.password = encrypted.toString("hex");
    }

    const updateUser = await prisma.user.update({
      data: newData,
      where: { id: id },
    });

    revalidatePath("users");

    return {
      hasError: false,
      data: updateUser,
    };
  } catch (error: any) {
    throw new Error(error?.message);
  } finally {
    prisma.$disconnect();
  }
}