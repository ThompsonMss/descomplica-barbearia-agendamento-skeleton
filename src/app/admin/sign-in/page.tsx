"use client";

import { FormEvent, useEffect, useState } from "react";

import Image from "next/image";
import LogoSVG from "../../../assets/logo.png";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Insira um e-mail válido.")
      .required("E-mail é obrigatório."),
    password: yup
      .string()
      .min(8, "Insira no mínimo 8 caracteres.")
      .required("A senha é obrigatória."),
  })
  .required();

export default function SignIn() {
  const router = useRouter();
  useAuth();

  const [loading, setLoading] = useState(false);

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: { email: string; password: string }) {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Credenciais inválidas.");
        return;
      }

      router.replace("/admin/appointments");
    } catch (error) {
      toast.error("Ops! Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-8 gap-8">
      <Image
        src={LogoSVG}
        width={160}
        height={160}
        alt="Logotipo"
        style={{ borderRadius: 12 }}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-md border border-zinc-300 flex flex-col gap-4"
        style={{ padding: 16 }}
      >
        <h3 className="text-zinc-800 text-xl mb-2">Login</h3>

        <label htmlFor="email" className="flex flex-col gap-1">
          <span className="text-zinc-800 text-sm">E-mail</span>
          <Input
            id="email"
            placeholder="Seu e-mail"
            className="bg-zinc-100 border border-zinc-300 text-zinc-800"
            style={{ paddingLeft: 12, paddingRight: 12 }}
            {...register("email")}
          />

          <p className="text-red-400 text-xs">{errors.email?.message || ""}</p>
        </label>

        <label htmlFor="password" className="flex flex-col gap-1">
          <span className="text-zinc-800 text-sm">Senha</span>
          <Input
            id="password"
            placeholder="Sua senha"
            type="password"
            className="bg-zinc-100 border border-zinc-300 text-zinc-800"
            style={{ paddingLeft: 12, paddingRight: 12 }}
            {...register("password")}
          />

          <p className="text-red-400 text-xs">
            {errors.password?.message || ""}
          </p>
        </label>

        <Button
          type="submit"
          className="bg-sky-800 hover:bg-sky-900 cursor-pointer"
        >
          {loading ? "Entrando" : "Entrar"}
        </Button>
      </form>
    </main>
  );
}
