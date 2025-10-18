import { HeaderActionsClient } from "./header-actions-client";

export async function HeaderActionsServer() {
  // Le composant client récupère les données d'authentification via le hook useSession
  // Pas besoin de récupérer les données côté serveur pour les pages statiques
  return <HeaderActionsClient />;
}
