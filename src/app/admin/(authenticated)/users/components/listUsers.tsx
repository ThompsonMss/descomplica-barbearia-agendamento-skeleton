import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";

import { PrismaClient, User } from "@prisma/client";
import { ActionListUsers } from "./actionListUsers";

const prisma = new PrismaClient();

export async function ListData() {
  let hasError = false;
  let data: User[] = [];

  try {
    data = await prisma.user.findMany({
      where: {
        excluded_at: null,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    hasError = true;
  } finally {
    prisma.$disconnect();
  }

  let isEmpty = data.length === 0;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-zinc-300">
          <TableHead className="text-zinc-700 text-sm">Nome</TableHead>
          <TableHead className="text-zinc-700 text-sm">E-mail</TableHead>
          <TableHead className="text-zinc-700 text-sm">Criado em</TableHead>
          <TableHead className="text-zinc-700 text-sm text-right">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(hasError || isEmpty) && (
          <TableRow className="hover:bg-transparent border-zinc-700">
            <TableCell
              colSpan={4}
              className="font-medium text-center text-base text-zinc-800"
              style={{ paddingTop: 16 }}
            >
              {hasError && "Erro ao buscar usuários"}
              {isEmpty && "Nenhum usuário cadastrado"}
            </TableCell>
          </TableRow>
        )}

        {data.map((itemData) => {
          return (
            <TableRow
              key={itemData.id}
              className="hover:bg-transparent border-zinc-300"
              style={{ paddingTop: 8, paddingBottom: 8 }}
            >
              <TableCell
                style={{ paddingTop: 8, paddingBottom: 8 }}
                className="font-medium text-base text-zinc-800"
              >
                {itemData.name}
              </TableCell>
              <TableCell className="text-base text-zinc-800">
                {itemData.email}
              </TableCell>
              <TableCell className="text-base text-zinc-800">
                {format(itemData.created_at, "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="text-right text-base text-zinc-800">
                <ActionListUsers user={itemData} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
