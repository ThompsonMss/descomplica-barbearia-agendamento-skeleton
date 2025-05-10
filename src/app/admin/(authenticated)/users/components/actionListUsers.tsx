"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { DeleteUser } from "./deleteUser";

import { useState } from "react";
import { UpdateUser } from "./updateUser";
import { Prisma, User } from "@prisma/client";

interface ActionListUsersProps {
  user: Required<User>;
}

export function ActionListUsers(props: ActionListUsersProps) {
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
          <UpdateUser user={props.user} onClose={() => setOpen(false)} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteUser
            onClose={() => setOpen(false)}
            id={props.user.id}
            name={props.user.name}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
