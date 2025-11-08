// src/utils/anonymousUser.ts

/**
 * Gera ou recupera um ID anônimo persistente no localStorage.
 */
export function getAnonymousUserId(): string {
  const key = "anonymous_user_id";

  // Se estiver no servidor, não tente acessar localStorage
  if (typeof window === "undefined") {
    return "";
  }

  let id = localStorage.getItem(key);

  if (!id) {
    // Usa a API web corretamente
    if (window.crypto?.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      // Fallback caso o browser seja antigo
      id = Math.random().toString(36).substring(2, 12);
    }

    localStorage.setItem(key, id);
  }

  return id;
}
