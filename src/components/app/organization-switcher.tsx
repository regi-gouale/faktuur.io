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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentSlug: string;
}

export function OrganizationSwitcher({
  organizations,
  currentSlug,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const currentOrg = organizations.find((org) => org.slug === currentSlug);

  const handleOrganizationChange = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  const handleCreateOrganization = () => {
    router.push("/create-organization");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          size="default"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-6 w-6">
              {currentOrg?.logo && (
                <AvatarImage
                  src={currentOrg.logo}
                  alt={currentOrg.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-xs">
                {currentOrg?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-sm">
              {currentOrg?.name || "Sélectionner"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Mes organisations
        </DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleOrganizationChange(org.slug)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="h-6 w-6">
                {org.logo && (
                  <AvatarImage
                    src={org.logo}
                    alt={org.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-xs">
                  {org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="truncate text-sm font-medium">{org.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {org.role}
                </span>
              </div>
              {org.slug === currentSlug && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCreateOrganization}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Créer une organisation</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
