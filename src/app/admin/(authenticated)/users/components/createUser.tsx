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
import { createUser } from "@/services/users/createUser";

import { toast } from "sonner";

const schema = yup
  .object({
    name: yup.string().required("Nome é obrigatório."),
    email: yup
      .string()
      .email("Insira um e-mail válido.")
      .required("E-mail é obrigatório."),
    password: yup
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres.")
      .required("A senha é obrigatória."),
  })
  .required();

export function CreateUser() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit(data: any) {
    setLoading(true);

    startTransition(async () => {
      try {
        await createUser(data);
        toast.success("Usuário salvo com sucesso.");
        reset();
        setOpen(false);
      } catch (error: any) {
        toast.error(`Erro ao salvar usuário. ${error?.message}`);
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-sky-900 bg-sky-800 cursor-pointer"
          style={{ paddingLeft: 8, paddingRight: 8 }}
        >
          Novo Usuário
        </Button>
      </DialogTrigger>

      <DialogContent
        className="bg-zinc-100 border border-zinc-300 text-zinc-100"
        style={{ padding: 16 }}
      >
        <DialogHeader>
          <DialogTitle
            className="mb-4 text-zinc-800"
            style={{ marginBottom: 16 }}
          >
            Cadastrar usuário
          </DialogTitle>

          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="nome" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">Nome</span>
              <Input
                id="nome"
                placeholder="Nome do usuário"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                className="bg-zinc-100 border border-zinc-300 text-zinc-800"
                {...register("name")}
              />
              {!!errors.name?.message && (
                <p className="text-red-400 text-xs">{errors.name?.message}</p>
              )}
            </label>

            <label htmlFor="email" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">E-mail</span>
              <Input
                id="email"
                placeholder="E-mail do usuário"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                className="bg-zinc-100 border border-zinc-300 text-zinc-800"
                {...register("email")}
              />
              {!!errors.email?.message && (
                <p className="text-red-400 text-xs">{errors.email?.message}</p>
              )}
            </label>

            <label htmlFor="senha" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">Senha</span>
              <Input
                type="password"
                id="senha"
                placeholder="Senha do usuário"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                className="bg-zinc-100 border border-zinc-300 text-zinc-800"
                {...register("password")}
              />
              {!!errors.password?.message && (
                <p className="text-red-400 text-xs">{errors.password?.message}</p>
              )}
            </label>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="cursor-pointer"
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
