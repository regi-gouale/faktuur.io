"use client";

import { OrganizationSwitcher } from "@/components/app/organization-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Building2,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface DashboardSidebarProps {
  organizations: Organization[];
  currentSlug: string;
  user: User;
}

export function DashboardSidebar({
  organizations,
  currentSlug,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Tableau de bord",
      href: `/dashboard/${currentSlug}`,
      icon: Home,
    },
    {
      name: "Factures",
      href: `/dashboard/${currentSlug}/invoices`,
      icon: FileText,
    },
    {
      name: "Clients",
      href: `/dashboard/${currentSlug}/clients`,
      icon: Users,
    },
    {
      name: "Paramètres",
      href: `/dashboard/${currentSlug}/settings`,
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href={`/dashboard/${currentSlug}`}
          className="flex items-center gap-2 px-2"
        >
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Faktuur.io</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <OrganizationSwitcher
              organizations={organizations}
              currentSlug={currentSlug}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="rounded-lg">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Se déconnecter"
              onClick={async () => {
                await fetch("/api/auth/sign-out", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                });
                redirect("/");
              }}
            >
              <LogOut />
              <span>Se déconnecter</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
