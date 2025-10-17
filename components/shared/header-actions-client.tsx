"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface HeaderActionsClientProps {
  initialUser?: User | null;
  initialOrgSlug?: string;
}

export function HeaderActionsClient({
  initialUser,
  initialOrgSlug,
}: HeaderActionsClientProps) {
  const [user] = useState<User | null | undefined>(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En production, les données sont passées via les props
    // Pas besoin de refetch
    setIsLoading(false);
  }, [initialUser, initialOrgSlug]);

  if (isLoading) {
    return null;
  }

  // Si l'utilisateur est connecté
  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href={initialOrgSlug ? `/dashboard/${initialOrgSlug}` : "/dashboard"}
          className="hidden sm:block"
        >
          <Button variant="outline" size="sm">
            Accéder à l&apos;application
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-2 sm:px-3"
            >
              <Avatar className="size-7 sm:size-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-xs sm:text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={
                  initialOrgSlug ? `/dashboard/${initialOrgSlug}` : "/dashboard"
                }
              >
                <ArrowRight className="mr-2 size-4" />
                Aller sur l&apos;application
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href="/login">
        <Button variant="ghost" size="sm" className="px-3 sm:px-4">
          <span className="hidden sm:inline">Connexion</span>
          <span className="sm:hidden">Se connecter</span>
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm" className="px-3 sm:px-4">
          <span className="hidden sm:inline">Commencer</span>
          <span className="sm:hidden">Démarrer</span>
          <ArrowRight className="ml-1 sm:ml-2 size-3 sm:size-4" />
        </Button>
      </Link>
    </div>
  );
}
