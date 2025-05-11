"use client";

import * as React from "react";
import { format, getDay, parseISO } from "date-fns";
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
import { toast } from "sonner";
import { createAppoitment } from "@/services/appointment/createAppoitment";

import { EnumStatusAppointment } from "@/enum/EnumStatusAppointment";

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

  const [horariosBlock, setHorariosBlock] = useState<{ hour: string }[]>([]);

  const eDomingo = React.useMemo(() => {
    if (data) {
      return getDay(data) === 0;
    }

    return false;
  }, [data]);

  React.useEffect(() => {
    if (!data) return;

    // Buscar horários quando a data for selecionada
    const fetchHorarios = async () => {
      try {
        setLoadHorario(true);

        const response = await fetch(
          `/api/horario?date=${format(data, "yyyy-MM-dd")}`
        );

        const dataReq = await response.json();

        if (response.ok) {
          setHorariosBlock(dataReq);
        } else {
          setHorariosBlock([]);
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        setHorariosBlock([]);
      } finally {
        setLoadHorario(false);
      }
    };

    fetchHorarios();
  }, [data]);

  const [loading, setLoading] = useState(false);

  function onSubmit() {
    setLoading(true);

    // Validacoes
    if (!nome) {
      setLoading(false);
      return alert("Por favor, preencha seu nome.");
    }

    if (!telefone) {
      setLoading(false);
      return alert("Por favor, preencha seu telefone.");
    } else {
      if (telefone.length < 14) {
        setLoading(false);
        return alert("Por favor, preencha um telefone válido.");
      }
    }

    if (!servico) {
      setLoading(false);
      return alert("Por favor, selecione um serviço.");
    }

    if (!data) {
      setLoading(false);
      return alert("Por favor, preencha uma data.");
    }

    if (!horario) {
      setLoading(false);
      return alert("Por favor, preencha um horário.");
    }

    React.startTransition(async () => {
      try {
        const phone = removePhoneMask(telefone);

        const dataInsert: any = {
          client_name: nome,
          date: data
            ? parseISO(`${format(data, "yyyy-MM-dd")}T15:00:00.000Z`)
            : new Date(),
          hour: horario,
          ddd_phone: Number(phone.slice(0, 2)),
          phone: Number(phone.slice(2)),
          service: servico,
          status: EnumStatusAppointment.PENDING,
        };

        await createAppoitment(dataInsert);

        //Repopulando horários
        const dateQuery = data
          ? parseISO(`${format(data, "yyyy-MM-dd")}T15:00:00.000Z`)
          : new Date();

        const response = await fetch(
          `/api/horario?date=${format(dateQuery, "yyyy-MM-dd")}`
        );

        const dataReq = await response.json();

        if (response.ok) {
          setHorariosBlock(dataReq);
        } else {
          setHorariosBlock([]);
        }

        //Limpando
        setNome("");
        setTelefone("");
        setServico("");
        setData(new Date());
        setHorario("");

        alert("Agendamento salvo com sucesso.");
      } catch (error: any) {
        alert(`Erro ao salvar Agendamento. ${error?.message}`);
      } finally {
        setLoading(false);
      }
    });
  }

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
                      onSelect={(date) => {
                        setData(date);
                        setHorario("");
                      }}
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
                        <option
                          value="10:00:00"
                          disabled={
                            !!horariosBlock.find((h) => {
                              return h.hour === "10:00:00";
                            })
                          }
                        >
                          10:00
                        </option>
                        <option
                          value="10:30:00"
                          disabled={
                            !!horariosBlock.find((h) => {
                              return h.hour === "10:30:00";
                            })
                          }
                        >
                          10:30
                        </option>
                        <option
                          value="11:00:00"
                          disabled={
                            !!horariosBlock.find((h) => {
                              return h.hour === "11:00:00";
                            })
                          }
                        >
                          11:00
                        </option>
                        <option
                          value="11:30:00"
                          disabled={
                            !!horariosBlock.find((h) => {
                              return h.hour === "11:30:00";
                            })
                          }
                        >
                          11:30
                        </option>
                        <option
                          value="12:00:00"
                          disabled={
                            !!horariosBlock.find((h) => {
                              return h.hour === "12:00:00";
                            })
                          }
                        >
                          12:00
                        </option>

                        {!eDomingo && (
                          <>
                            <option
                              value="13:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "13:30:00";
                                })
                              }
                            >
                              13:30
                            </option>
                            <option
                              value="14:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "14:00:00";
                                })
                              }
                            >
                              14:00
                            </option>
                            <option
                              value="14:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "14:30:00";
                                })
                              }
                            >
                              14:30
                            </option>
                            <option
                              value="15:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "15:00:00";
                                })
                              }
                            >
                              15:00
                            </option>
                            <option
                              value="15:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "15:30:00";
                                })
                              }
                            >
                              15:30
                            </option>
                            <option
                              value="16:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "16:00:00";
                                })
                              }
                            >
                              16:00
                            </option>
                            <option
                              value="16:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "16:30:00";
                                })
                              }
                            >
                              16:30
                            </option>
                            <option
                              value="17:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "17:00:00";
                                })
                              }
                            >
                              17:00
                            </option>
                            <option
                              value="17:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "17:30:00";
                                })
                              }
                            >
                              17:30
                            </option>
                            <option
                              value="18:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "18:00:00";
                                })
                              }
                            >
                              18:00
                            </option>
                            <option
                              value="18:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "18:30:00";
                                })
                              }
                            >
                              18:30
                            </option>
                            <option
                              value="19:00:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "19:00:00";
                                })
                              }
                            >
                              19:00
                            </option>
                            <option
                              value="19:30:00"
                              disabled={
                                !!horariosBlock.find((h) => {
                                  return h.hour === "19:30:00";
                                })
                              }
                            >
                              19:30
                            </option>
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
              onClick={onSubmit}
              className="btn-agendamento"
              style={{ marginTop: 20 }}
            >
              {loading ? "Enviando" : "Agendar"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
