export type ConnectionStatus = "connected" | "offline" | "unknown";
export type ConnectionState = {
  isConnected?: boolean;
  isInternetReachable?: boolean;
  type?: string;
};

export function classifyConnection(state: ConnectionState): ConnectionStatus {
  if (state.isConnected === false || state.isInternetReachable === false || state.type === "NONE") return "offline";
  if (state.isConnected === true || state.isInternetReachable === true) return "connected";
  return "unknown";
}

// O estado do sistema é um indício de conexão, não uma garantia de resposta dos serviços.
export async function readConnectionStatus(
  read: () => Promise<ConnectionState>,
  timeoutMs = 3000,
): Promise<ConnectionStatus> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      read().then(classifyConnection),
      new Promise<ConnectionStatus>((resolve) => { timer = setTimeout(() => resolve("unknown"), timeoutMs); }),
    ]);
  } catch {
    return "unknown";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function externalActionBlock(status: ConnectionStatus): string | null {
  if (status === "offline") return "Sem conexão. A consulta local continua disponível; conecte-se e tente abrir a navegação novamente.";
  if (status === "unknown") return "Não foi possível confirmar a conexão. Verifique a rede e tente abrir a navegação novamente.";
  return null;
}
