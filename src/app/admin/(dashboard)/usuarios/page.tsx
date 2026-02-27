import { getAllUsersWithConfig } from "@/lib/actions/usuarios";
import { UsuariosClient } from "./usuarios-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUser = session?.user as any;

  const users = await getAllUsersWithConfig();

  return (
    <UsuariosClient
      users={JSON.parse(JSON.stringify(users))}
      currentUserId={currentUser?.id}
      currentUserRole={currentUser?.role}
    />
  );
}
