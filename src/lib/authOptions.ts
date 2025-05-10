import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaClient } from "@prisma/client";

import { decryptData } from "./crypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { email, password } = credentials as any;

        try {
          const hasUser = await prisma.user.findFirst({
            where: { email: email, excluded_at: null },
          });

          if (!hasUser) {
            return null;
          }

          const senhaDecrypted = decryptData(hasUser.password);

          if (senhaDecrypted != password) {
            return null;
          }

          return hasUser as any;
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          prisma.$disconnect();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/appointments",
  },
};
