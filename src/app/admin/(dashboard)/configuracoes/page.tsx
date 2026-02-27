import { getAllUsers } from "@/lib/actions/configuracoes";
import { ConfiguracoesClient } from "./configuracoes-client";

export default async function ConfiguracoesPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie permissões e usuários do sistema</p>
      </div>

      <ConfiguracoesClient users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
