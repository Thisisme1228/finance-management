"use client";

import { useState } from "react";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import EditProfileDialog from "./EditProfileDialog";
interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn("flex-none rounded-full", className)}>
            <UserAvatar avatarUrl={user.avatarUrl} size={40} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Logged in as @{user.displayName}{" "}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <UserIcon className="mr-2 size-4" />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              //The clear method clears all connected caches.
              queryClient.clear();
              logout();
            }}
          >
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
