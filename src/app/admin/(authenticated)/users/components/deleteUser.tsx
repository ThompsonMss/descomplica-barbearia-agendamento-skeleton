"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/services/users/deleteUser";
import { startTransition, useState } from "react";
import { toast } from "sonner";

interface DeleteUserProps {
  disabled?: boolean;
  id: number;
  name: string;

  onClose: () => void;
}

export function DeleteUser(props: DeleteUserProps) {
  const [loading, setLoading] = useState(false);

  function handleDeleteUser() {
    setLoading(true);

    startTransition(async () => {
      try {
        await deleteUser(props.id);
        toast.success("Usuário excluído.");
        props.onClose();
      } catch (error: any) {
        toast.error(`Erro ao excluír usuário. ${error?.message}`);
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={loading}
        style={{ padding: 4 }}
        className="w-full text-red-500 hover:bg-zinc-100 hover:text-red-700 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      >
        {loading ? "Excluíndo" : "Excluír"}
      </AlertDialogTrigger>

      <AlertDialogContent
        style={{ padding: 16 }}
        className="bg-zinc-50 border border-zinc-200 text-zinc-800"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-800">
            Atenção!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-600">
            Tem certeza que deseja excluír {`"${props.name}"`}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant={"secondary"}
              style={{ paddingLeft: 8, paddingRight: 8 }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant={"destructive"}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteUser}
              style={{ paddingLeft: 8, paddingRight: 8 }}
            >
              Excluír
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
