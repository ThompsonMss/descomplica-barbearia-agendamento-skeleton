"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { startTransition, useState } from "react";

import { toast } from "sonner";
import { updateUser } from "@/services/users/updateUser";
import { Appointment } from "@prisma/client";
import { format } from "date-fns";
import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";
import { updateAppoitment } from "@/services/appointment/updateAppoitment";

const schema = yup
  .object({
    status: yup.number().required("Status é obrigatório."),
  })
  .required();

interface UpdateAppointmentProps {
  date: string;
  appointment: Required<Appointment>;
  onClose: () => void;
}

type SchemaUser = yup.InferType<typeof schema>;

function setMaskAllPhone(value: string): string {
  const cleanedValue = value.replace(/\D/g, "");

  if (cleanedValue.length === 0) {
    return "";
  }

  if (cleanedValue.length <= 2) {
    return `(${cleanedValue}`;
  }

  if (cleanedValue.length <= 6) {
    return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(2)}`;
  }

  if (cleanedValue.length <= 10) {
    return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(
      2,
      6
    )}-${cleanedValue.substring(6)}`;
  }

  return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(
    2,
    7
  )}-${cleanedValue.substring(7, 11)}`;
}

export function UpdateAppointment(props: UpdateAppointmentProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: props.appointment.status,
    },
  });

  function onSubmit(data: SchemaUser) {
    setLoading(true);

    startTransition(async () => {
      try {
        const newDataCopy: any = {
          ...props.appointment,
          status: Number(data.status),
        };

        if (newDataCopy?.id) {
          delete newDataCopy.id;
        }

        await updateAppoitment(props.appointment.id, newDataCopy, props.date);
        props.onClose();
        toast.success("Agendamento salvo com sucesso.");
        setOpen(false);
      } catch (error: any) {
        toast.error(`Erro ao salvar Agendamento. ${error?.message}`);
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={loading}
        style={{ padding: 4 }}
        className="w-full text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      >
        {loading ? "Atualizando" : "Detalhe"}
      </DialogTrigger>

      <DialogContent
        className="bg-zinc-50 border border-zinc-100 text-zinc-800"
        style={{ padding: 16 }}
      >
        <DialogHeader>
          <DialogTitle className="mb-4" style={{ marginBottom: 16 }}>
            Detalhes Agendamento
          </DialogTitle>

          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <span className="text-zinc-800 text-sm">
              Cliente: {props?.appointment?.client_name || "-"}
            </span>
            <span className="text-zinc-800 text-sm">
              Whatsapp:{" "}
              {setMaskAllPhone(
                props?.appointment?.ddd_phone && props?.appointment?.ddd_phone
                  ? `${props?.appointment?.ddd_phone}${props?.appointment?.phone}`
                  : ""
              )}
            </span>
            <span className="text-zinc-800 text-sm">
              Serviço: {props?.appointment?.service || "-"}
            </span>
            <span className="text-zinc-800 text-sm">
              Data:{" "}
              {props?.appointment?.date
                ? format(props?.appointment?.date, "dd/MM/yyyy")
                : "-"}
            </span>
            <span className="text-zinc-800 text-sm">
              Horário: {props?.appointment?.hour}
            </span>
            <span className="text-zinc-800 text-sm">
              Criado em:{" "}
              {props?.appointment?.created_at
                ? format(props?.appointment?.created_at, "dd/MM/yyyy HH:mm:ss")
                : "-"}
            </span>

            <label htmlFor="nome" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">Nome</span>
              <select
                id="nome"
                className="bg-zinc-50 border border-zinc-200 text-zinc-800"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                {...register("status")}
              >
                <option value={EnumStatusAppointment.ATTENDED}>Atendido</option>
                <option value={EnumStatusAppointment.PENDING}>Pendente</option>
                <option value={EnumStatusAppointment.CANCELED}>
                  Cancelado
                </option>
              </select>

              {!!errors.status?.message && (
                <p className="text-red-400">{errors.status?.message}</p>
              )}
            </label>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant={"secondary"}
                className="cursor-pointer"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                style={{ paddingLeft: 8, paddingRight: 8 }}
              >
                Cancelar
              </Button>

              <Button
                disabled={loading}
                type="submit"
                className="bg-sky-800 hover:bg-sky-900 cursor-pointer"
                style={{ paddingLeft: 8, paddingRight: 8 }}
              >
                {loading ? "Enviando" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
