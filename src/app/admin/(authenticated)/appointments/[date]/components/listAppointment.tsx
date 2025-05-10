import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { endOfDay, format, parseISO, startOfDay } from "date-fns";

import { PrismaClient, Appointment } from "@prisma/client";
import { ActionListAppointment } from "./actionListAppointment";
import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";

const prisma = new PrismaClient();

export async function ListAppointment({ date }: { date: string }) {
  let hasError = false;
  let data: Appointment[] = [];

  try {
    const dataCurrent = parseISO(date);

    data = await prisma.appointment.findMany({
      where: {
        excluded_at: null,
        date: {
          gte: startOfDay(dataCurrent),
          lte: endOfDay(dataCurrent),
        },
      },
    });
  } catch (error) {
    hasError = true;
  } finally {
    prisma.$disconnect();
  }

  let isEmpty = data.length === 0;

  return (
    <Table style={{ marginTop: 24 }}>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-zinc-300">
          <TableHead className="text-zinc-700 text-sm">Cliente</TableHead>
          <TableHead className="text-zinc-700 text-sm">Horário</TableHead>
          <TableHead className="text-zinc-700 text-sm">Serviço</TableHead>
          <TableHead className="text-zinc-700 text-sm">Status</TableHead>
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
              {hasError && "Erro ao buscar agendamentos"}
              {isEmpty && "Nenhum agendamento cadastrado"}
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
                {itemData.client_name}
              </TableCell>
              <TableCell className="text-base text-zinc-800">
                {format(itemData.date, "dd/MM/yyyy")} {itemData.hour}
              </TableCell>

              <TableCell
                style={{ paddingTop: 8, paddingBottom: 8 }}
                className="font-medium text-base text-zinc-800"
              >
                {itemData.service}
              </TableCell>

              <TableCell className="text-base text-zinc-800">
                {itemData.status === EnumStatusAppointment.PENDING && (
                  <span className="text-sky-500">Pendente</span>
                )}

                {itemData.status === EnumStatusAppointment.CANCELED && (
                  <span className="text-red-500">Cancelado</span>
                )}

                {itemData.status === EnumStatusAppointment.ATTENDED && (
                  <span className="text-green-500">Atendido</span>
                )}
              </TableCell>

              <TableCell className="text-right text-base text-zinc-800">
                <ActionListAppointment date={date} appointment={itemData} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
