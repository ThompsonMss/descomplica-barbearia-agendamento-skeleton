"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
import { UpdateAppointment } from "./updateAppointment";
import { Prisma, Appointment } from "@prisma/client";

interface ActionListAppointmentProps {
  appointment: Required<Appointment>;
  date: string
}

export function ActionListAppointment(props: ActionListAppointmentProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="bg-zinc-50 border p-2 rounded-sm border-zinc-400 hover:bg-zinc-200">
        <EllipsisVerticalIcon className="size-5 text-zinc-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-zinc-50 border border-zinc-200"
        style={{ padding: 4 }}
      >
        <DropdownMenuItem asChild>
          <UpdateAppointment date={props.date} appointment={props.appointment} onClose={() => setOpen(false)} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
