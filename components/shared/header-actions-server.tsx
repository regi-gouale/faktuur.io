import { getUserFirstOrganizationSlug } from "@/lib/dal/organization";
import { validatePublicUser } from "@/lib/schemas/user";
import { HeaderActionsClient } from "./header-actions-client";

interface HeaderActionsServerProps {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export async function HeaderActionsServer({ user }: HeaderActionsServerProps) {
  let orgSlug: string | undefined;
  let validatedUser = null;

  if (user?.id) {
    // Récupérer l'organisation en parallèle
    orgSlug = await getUserFirstOrganizationSlug(user.id);
  }

  if (user && "email" in user && "name" in user) {
    const result = validatePublicUser({
      name: user.name,
      email: user.email,
      image: user.image ?? undefined,
    });

    if (!("error" in result)) {
      validatedUser = result;
    }
  }

  return (
    <HeaderActionsClient initialUser={validatedUser} initialOrgSlug={orgSlug} />
  );
}
