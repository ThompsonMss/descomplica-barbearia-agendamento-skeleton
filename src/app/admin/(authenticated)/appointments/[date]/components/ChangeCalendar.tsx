"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";

export function ChangeCalendar({ dateURL }: { dateURL: string }) {
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(parseISO(dateURL));

  const debounce = React.useRef<NodeJS.Timeout>(null);

  function changeDate(dateValue: Date | undefined) {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    if (dateValue) {
      debounce.current = setTimeout(() => {
        router.push(`/admin/appointments/${format(dateValue, "yyyy-MM-dd")}`);
      }, 1000);
    }

    setDate(dateValue);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <span className="text-zinc-700 text-sm">Filtro:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              style={{ marginBottom: 16, paddingLeft: 8, paddingRight: 8 }}
            >
              <span style={{ flex: 1 }}>
                {date ? format(date, "dd/MM/yyyy") : ""}
              </span>
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={changeDate}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
