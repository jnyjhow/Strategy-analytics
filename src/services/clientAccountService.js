import { clientApi } from "./clientApi";

const unwrap = (response) => response.data?.data ?? response.data;
export const getOnboardingStatus = async () => unwrap(await clientApi.get("/api/v1/client/onboarding/status"));
export const requestEmailConfirmation = async (email) => unwrap(await clientApi.post("/api/v1/auth/email-confirmation/request", { email }));
export const confirmEmail = async (email, code) => unwrap(await clientApi.post("/api/v1/auth/email-confirmation/confirm", { email, code }));
export const requestPasswordReset = async (email) => unwrap(await clientApi.post("/api/v1/auth/password-reset/request", { email }));
export const completePasswordReset = async (payload) => unwrap(await clientApi.post("/api/v1/auth/password-reset/complete", payload));
export const changeCurrentPassword = async (currentPassword, newPassword) => unwrap(await clientApi.patch("/api/v1/users/me/password", { currentPassword, newPassword }));
export const requestPhoneVerification = async (phoneNumber) => unwrap(await clientApi.post("/api/v1/users/me/phone-verification/request", { phoneNumber }));
export const confirmPhoneVerification = async (phoneNumber, code) => unwrap(await clientApi.post("/api/v1/users/me/phone-verification/confirm", { phoneNumber, code }));
export const listSessions = async () => unwrap(await clientApi.get("/api/v1/users/me/sessions"));
export const revokeSession = async (sessionId) => unwrap(await clientApi.delete(`/api/v1/users/me/sessions/${sessionId}`));
export const revokeOtherSessions = async () => unwrap(await clientApi.delete("/api/v1/users/me/sessions", { params: { keepCurrentSession: true } }));

export const onboardingAction = (error) => {
  if (error?.response?.status !== 403) return null;
  const payload = error.response?.data?.data ?? error.response?.data ?? {};
  return payload.requiredAction || payload.requiredStep || payload.onboardingStep || payload.code || "CompleteOnboarding";
};
