import { clientApi } from "./clientApi";

/**
 * Login do cliente na API (codebiz).
 * Endpoint: POST /api/v1/auth/login
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ accessToken: string, refreshToken: string, expiresAt: string, user: object }>}
 */
export async function login({ email, password }) {
  const { data } = await clientApi.post("/api/v1/auth/login", { email, password });
  return data?.data ?? data;
}

/**
 * Retorna o usuário autenticado (valida o token).
 * Endpoint: GET /api/v1/auth/me
 *
 * @returns {Promise<object>} { id, name, email, roles, workspaceId, workspaceIds }
 */
export async function getCurrentUser() {
  const { data } = await clientApi.get("/api/v1/auth/me");
  return data?.data ?? data;
}

/**
 * Verifica acesso de escopo cliente.
 * Endpoint: GET /api/v1/client/auth/ping -> { scope: "client" }
 *
 * @returns {Promise<object>}
 */
export async function clientPing() {
  const { data } = await clientApi.get("/api/v1/client/auth/ping");
  return data?.data ?? data;
}

export async function refresh(refreshToken) {
  const { data } = await clientApi.post("/api/v1/auth/refresh", { refreshToken }, { skipAuthRefresh: true });
  return data?.data ?? data;
}

/**
 * Encerra a sessão na API.
 * Endpoint: POST /api/v1/auth/logout
 *
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export async function logout(refreshToken) {
  if (!refreshToken) return;
  await clientApi.post("/api/v1/auth/logout", { refreshToken });
}

/**
 * Extrai mensagem legível do erro da API ({ errors: [{ message }] }).
 * @param {unknown} error
 * @param {string} fallback
 * @returns {string}
 */
export function getApiErrorMessage(error, fallback = "Não foi possível entrar. Verifique suas credenciais.") {
  const status = error?.response?.status;
  const code = error?.response?.data?.code || error?.response?.data?.errors?.[0]?.code || "";
  if (status === 409) return code.toLowerCase().includes("requirement") ? "O requisito documental mudou. Atualize a tela e tente novamente." : "Os dados foram alterados em outra operação. Atualize a tela e tente novamente.";
  if (status === 422) return code.toLowerCase().includes("file") ? "O arquivo enviado não atende aos requisitos." : "Revise os dados informados e tente novamente.";
  if (status === 503 || code.toLowerCase().includes("storage")) return "O armazenamento está temporariamente indisponível. Tente novamente mais tarde.";
  if (error?.response?.status === 403) {
    const payload = error.response?.data?.data ?? error.response?.data ?? {};
    const action = payload.requiredAction || payload.requiredStep || payload.onboardingStep;
    const labels = { Deposit: "Faça o depósito inicial para continuar.", ConfirmEmail: "Confirme seu e-mail para continuar.", ConfirmPhone: "Confirme seu telefone para continuar.", CompleteProfile: "Complete seu perfil para continuar." };
    if (action) return labels[action] || `Conclua a etapa de onboarding “${action}” para continuar.`;
  }
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length) {
    const message = errors.map((e) => e.message).filter(Boolean).join(" ");
    if (message.includes("not linked to a customer profile")) {
      return "Seu usuário ainda não está vinculado a um perfil de cliente. Entre em contato com o suporte.";
    }
    return message || fallback;
  }
  const message = error?.response?.data?.message || error?.message;
  if (message?.includes("not linked to a customer profile")) {
    return "Seu usuário ainda não está vinculado a um perfil de cliente. Entre em contato com o suporte.";
  }
  return message || fallback;
}
