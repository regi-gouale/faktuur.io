"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { ComponentProps, useEffect, useState } from "react";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/get-session");
      const data = await response.json();
      console.log("Session", { data });
      setData(data);
    };
    const fetchOrganizations = async () => {
      const response = await fetch("/api/auth/organization/list");
      const data = await response.json();
      console.log("Organizations", { data });
      // setData(data);
    };
    fetchSession();
    fetchOrganizations();
  }, []);

  if (!data) {
    return;
  }

  if (data.session) {
    const session = data.session as Record<string, unknown>;
    if (session.activeOrganizationId) {
      return <div>{JSON.stringify(session)}</div>;
    }

    return <div>No active organization</div>;
  }
  if (data.user) {
    return <div>{JSON.stringify(data.user)}</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
