import { clientApi } from "./clientApi";

const unwrap = (response) => response.data?.data ?? response.data;

export async function getClientProfileSummary() { return unwrap(await clientApi.get("/api/v1/client/profile/summary")); }
export async function getClientProfile() { return unwrap(await clientApi.get("/api/v1/client/profile")); }
export async function updateClientProfile(profile) { return unwrap(await clientApi.patch("/api/v1/client/profile", profile)); }
export async function getClientPreferences() { return unwrap(await clientApi.get("/api/v1/client/profile/preferences")); }
export async function updateClientPreferences(preferences) { return unwrap(await clientApi.patch("/api/v1/client/profile/preferences", preferences)); }
export async function getPreferenceCatalog() { return unwrap(await clientApi.get("/api/v1/preferences/catalog")); }
export async function getClientProfessionalProfile() { return unwrap(await clientApi.get("/api/v1/client/profile/professional-profile")); }
export async function updateClientProfessionalProfile(profile) { return unwrap(await clientApi.put("/api/v1/client/profile/professional-profile", profile)); }
export async function getClientFinancialProfile() { return unwrap(await clientApi.get("/api/v1/client/profile/financial-profile")); }
export async function updateClientFinancialProfile(profile) { return unwrap(await clientApi.put("/api/v1/client/profile/financial-profile", profile)); }
export async function getClientTrustedContacts() { return unwrap(await clientApi.get("/api/v1/client/profile/trusted-contacts")); }
export async function createClientTrustedContact(contact) { return unwrap(await clientApi.post("/api/v1/client/profile/trusted-contacts", contact)); }
export async function updateClientTrustedContact(contactId, contact) { return unwrap(await clientApi.put(`/api/v1/client/profile/trusted-contacts/${contactId}`, contact)); }
export async function deleteClientTrustedContact(contactId) { return unwrap(await clientApi.delete(`/api/v1/client/profile/trusted-contacts/${contactId}`)); }
export async function listClientBanks(params = {}) { return unwrap(await clientApi.get("/api/v1/client/banks", { params })); }
export async function listClientBankAccounts(params = {}) { return unwrap(await clientApi.get("/api/v1/client/profile/bank-accounts", { params })); }
export async function getClientBankAccount(accountId) { return unwrap(await clientApi.get(`/api/v1/client/profile/bank-accounts/${accountId}`)); }
export async function createClientBankAccount(account) { return unwrap(await clientApi.post("/api/v1/client/profile/bank-accounts", account)); }
export async function updateClientBankAccount(accountId, account) { return unwrap(await clientApi.patch(`/api/v1/client/profile/bank-accounts/${accountId}`, account)); }
export async function setPrimaryClientBankAccount(accountId) { return unwrap(await clientApi.post(`/api/v1/client/profile/bank-accounts/${accountId}/primary`)); }
export async function archiveClientBankAccount(accountId) { return unwrap(await clientApi.post(`/api/v1/client/profile/bank-accounts/${accountId}/archive`)); }
export async function getClientDocumentOverview() { return unwrap(await clientApi.get("/api/v1/client/profile/documents/overview")); }
export async function getClientDocumentProgress() { return unwrap(await clientApi.get("/api/v1/client/profile/documents/progress")); }
export async function listClientDocuments(params = {}) { return unwrap(await clientApi.get("/api/v1/client/profile/documents", { params })); }
export async function listClientDocumentTypes(params = {}) { return unwrap(await clientApi.get("/api/v1/client/profile/document-types", { params })); }
export async function getClientDocumentDataDefinition(documentTypeId, countryId) { return unwrap(await clientApi.get(`/api/v1/client/profile/document-types/${documentTypeId}/countries/${countryId}/data-definition`)); }
export async function uploadClientDocument(formData) { return unwrap(await clientApi.post("/api/v1/client/profile/documents", formData)); }
export async function replaceClientDocument(documentId, formData) { return unwrap(await clientApi.post(`/api/v1/client/profile/documents/${documentId}/replace`, formData)); }
export async function downloadClientDocument(documentId) { return clientApi.get(`/api/v1/client/profile/documents/${documentId}/download`, { responseType: "blob" }); }
export async function getClientDocumentTemporaryUrl(documentId, expiresInMinutes = 15) { return unwrap(await clientApi.get(`/api/v1/client/profile/documents/${documentId}/temporary-url`, { params: { expiresInMinutes } })); }
export async function getClientTimeline(params = {}) { return unwrap(await clientApi.get("/api/v1/client/profile/timeline", { params })); }
