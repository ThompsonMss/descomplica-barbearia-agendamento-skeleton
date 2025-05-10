"use client";

import * as React from "react";
import { format, getDay } from "date-fns";
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

import { useState } from "react";

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

function removePhoneMask(value: string): string {
  const cleanedValue = value.replace(/\D/g, "");

  return cleanedValue;
}

export function Appointment() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [horario, setHorario] = useState("");
  const [loadHorario, setLoadHorario] = useState(true);

  const eDomingo = React.useMemo(() => {
    if (data) {
      return getDay(data) === 0;
    }

    return false;
  }, [data]);

  return (
    <section id="agendamento">
      <div className="content">
        <div className="continer-agendamento">
          <h3>Agende seu horário para um de nossos serviços.</h3>

          <div className="form" style={{ padding: 16 }}>
            <div className="row" style={{ width: "100%", gap: 16 }}>
              <div className="grp-input" style={{ width: "100%" }}>
                <label htmlFor="nome" style={{ fontSize: 14, marginBottom: 4 }}>
                  Nome:
                </label>
                <input
                  className="input"
                  style={{ width: "auto" }} // 30px
                  type="text"
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="grp-input" style={{ width: "100%" }}>
                <label
                  htmlFor="whatsapp"
                  style={{ fontSize: 14, marginBottom: 4 }}
                >
                  Whatsapp:
                </label>
                <input
                  className="input"
                  style={{ width: "auto" }} // 30px
                  type="text"
                  id="whatsapp"
                  placeholder="Seu Whatsapp"
                  value={telefone}
                  onChange={(e) => setTelefone(setMaskAllPhone(e.target.value))}
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: 16 }}>
              <div className="grp-input">
                <label
                  htmlFor="servico"
                  style={{ fontSize: 14, marginBottom: 4 }}
                >
                  Serviços:
                </label>
                <select
                  className="input"
                  style={{ width: "100%" }} //20px
                  name="servico"
                  id="servico"
                  value={servico}
                  defaultValue={""}
                  onChange={(e) => setServico(e.target.value)}
                >
                  <option disabled selected value="">
                    Selecione
                  </option>
                  <option value="Corte">Corte</option>
                  <option value="Barba">Barba</option>
                  <option value="Sobrancelha">Sobrancelha</option>
                  <option value="Corte + Barba (Combo)">
                    Corte + Barba (Combo)
                  </option>
                </select>
              </div>
            </div>

            <div className="row" style={{ marginTop: 16, gap: 16 }}>
              <div className="grp-input">
                <label htmlFor="data" style={{ fontSize: 14, marginBottom: 4 }}>
                  Data:
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      style={{ borderRadius: 4 }}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !data && "text-muted-foreground"
                      )}
                    >
                      <span style={{ paddingLeft: 8, flex: 1, fontSize: 16 }}>
                        {data ? format(data, "dd/MM/yyyy") : "Selecione"}
                      </span>
                      <CalendarIcon style={{ marginRight: 8 }} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={(date) => setData(date)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {!!data ? (
                <>
                  {loadHorario ? (
                    <div className="grp-input">
                      <label
                        htmlFor="servico"
                        style={{ fontSize: 14, marginBottom: 4 }}
                      >
                        Horário:
                      </label>

                      <input
                        className="input"
                        style={{ width: "auto" }} // 30px
                        type="text"
                        placeholder="Carregando..."
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="grp-input">
                      <label
                        htmlFor="servico"
                        style={{ fontSize: 14, marginBottom: 4 }}
                      >
                        Horário:
                      </label>
                      <select
                        disabled={!data}
                        className="input"
                        defaultValue={""}
                        style={
                          !data
                            ? { background: "#CCC", width: "100%" }
                            : { width: "100%" }
                        } //20px
                        name="horario"
                        id="horario"
                        value={horario}
                        onChange={(e) => {
                          if (!data) {
                            alert("Por favor, selecione uma data primeiro.");
                          } else {
                            setHorario(e.target.value);
                          }
                        }}
                      >
                        <option disabled selected value="">
                          Selecione
                        </option>
                        <option value="Corte">10:00</option>
                        <option value="Corte">10:30</option>
                        <option value="Corte">11:00</option>
                        <option value="Corte">11:30</option>
                        <option value="Corte">12:00</option>

                        {!eDomingo && (
                          <>
                            <option value="Corte">13:30</option>
                            <option value="Corte">14:00</option>
                            <option value="Corte">14:30</option>
                            <option value="Corte">15:00</option>
                            <option value="Corte">15:30</option>
                            <option value="Corte">16:00</option>
                            <option value="Corte">16:30</option>
                            <option value="Corte">17:00</option>
                            <option value="Corte">17:30</option>
                            <option value="Corte">18:00</option>
                            <option value="Corte">18:30</option>
                            <option value="Corte">19:00</option>
                            <option value="Corte">19:30</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="grp-input"></div>
              )}
            </div>

            <button
              onClick={() => {
                //submitWpp
              }}
              className="btn-agendamento"
              style={{ marginTop: 20 }}
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
