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
import { User } from "@prisma/client";

const schema = yup
  .object({
    name: yup.string().required("Nome é obrigatório."),
    email: yup
      .string()
      .email("Insira um e-mail válido.")
      .required("E-mail é obrigatório."),
    password: yup.string().optional(),
  })
  .required();

interface UpdateUserProps {
  user: Required<User>;
  onClose: () => void;
}

type SchemaUser = yup.InferType<typeof schema>;

export function UpdateUser(props: UpdateUserProps) {
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
      email: props.user.email,
      name: props.user.name,
    },
  });

  function onSubmit(data: SchemaUser) {
    // Verificando se senha foi preenchida.
    if (data?.password) {
      if (data?.password.length > 0) {
        if (data?.password.length < 8) {
          setError("password", {
            message: "A senha deve ter no mínimo 8 caracteres.",
          });
          return;
        }
      }
    }

    setLoading(true);

    startTransition(async () => {
      try {
        await updateUser(props.user.id, data as any);
        props.onClose();
        toast.success("Usuário salvo com sucesso.");
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
      <DialogTrigger
        disabled={loading}
        style={{ padding: 4 }}
        className="w-full text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      >
        {loading ? "Atualizando" : "Atualizar"}
      </DialogTrigger>

      <DialogContent
        className="bg-zinc-50 border border-zinc-100 text-zinc-800"
        style={{ padding: 16 }}
      >
        <DialogHeader>
          <DialogTitle className="mb-4" style={{ marginBottom: 16 }}>
            Atualizar usuário
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
                className="bg-zinc-50 border border-zinc-200 text-zinc-800"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                {...register("name")}
              />
              {!!errors.name?.message && (
                <p className="text-red-400">{errors.name?.message}</p>
              )}
            </label>

            <label htmlFor="email" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">E-mail</span>
              <Input
                id="email"
                placeholder="E-mail do usuário"
                className="bg-zinc-50 border border-zinc-200 text-zinc-800"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                {...register("email")}
              />
              {!!errors.email?.message && (
                <p className="text-red-400">{errors.email?.message}</p>
              )}
            </label>

            <label htmlFor="senha" className="flex flex-col gap-1">
              <span className="text-zinc-800 text-sm">Senha</span>
              <Input
                type="password"
                id="senha"
                placeholder="Senha do usuário"
                className="bg-zinc-50 border border-zinc-100 text-zinc-800"
                style={{ paddingLeft: 8, paddingRight: 8 }}
                {...register("password")}
              />
              {!!errors.password?.message && (
                <p className="text-red-400">{errors.password?.message}</p>
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
