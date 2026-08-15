<template>
  <div class="client-profile-details">
    <q-card class="tool">
      <q-card-section class="row items-center justify-between q-col-gutter-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">Perfil profissional</div>
          <div class="text-caption text-grey-5">Ocupação, empregador e período do vínculo atual.</div>
        </div>
        <q-btn v-if="!professionalEditing" flat dense color="primary" icon="edit" label="Editar" no-caps :disable="professionalLoading" @click="professionalEditing = true" />
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-banner v-if="professionalError" rounded class="bg-red-9 text-white q-mb-md">
          {{ professionalError }}
          <template #action><q-btn flat color="white" label="Tentar novamente" @click="loadProfessional" /></template>
        </q-banner>
        <div v-if="professionalLoading" class="row justify-center q-pa-lg"><q-spinner color="primary" size="34px" /></div>
        <q-form v-else ref="professionalForm" @submit.prevent="saveProfessional">
          <div class="row q-col-gutter-md">
            <label-form class-name="col-12 col-md-6" text-label="Ocupação"><q-input v-model.trim="professional.occupation" outlined dense dark :readonly="!professionalEditing" :rules="requiredRules" /></label-form>
            <label-form class-name="col-12 col-md-6" text-label="Empregador"><q-input v-model.trim="professional.employerName" outlined dense dark :readonly="!professionalEditing" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Válido desde"><q-input v-model="professional.validFrom" type="date" outlined dense dark :readonly="!professionalEditing" :rules="requiredRules" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Válido até"><q-input v-model="professional.validTo" type="date" outlined dense dark :readonly="!professionalEditing || professional.isCurrent" :rules="endDateRules(professional.validFrom)" /></label-form>
            <div class="col-12 col-md-4 row items-center"><q-checkbox v-model="professional.isCurrent" label="Vínculo atual" color="primary" :disable="!professionalEditing" @update:model-value="onCurrentChanged" /></div>
          </div>
          <div v-if="professionalEditing" class="row justify-end q-gutter-sm q-mt-md">
            <q-btn flat dense label="Descartar" no-caps :disable="professionalSaving" @click="resetProfessional" />
            <q-btn type="submit" flat dense color="primary" icon="save" label="Salvar" no-caps :loading="professionalSaving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card class="tool q-mt-lg">
      <q-card-section class="row items-center justify-between q-col-gutter-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">Perfil financeiro</div>
          <div class="text-caption text-grey-5">Renda, patrimônio declarado, moeda e vigência.</div>
        </div>
        <q-btn v-if="!financialEditing" flat dense color="primary" icon="edit" label="Editar" no-caps :disable="financialLoading" @click="financialEditing = true" />
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-banner v-if="financialError" rounded class="bg-red-9 text-white q-mb-md">
          {{ financialError }}
          <template #action><q-btn flat color="white" label="Tentar novamente" @click="loadFinancial" /></template>
        </q-banner>
        <div v-if="financialLoading" class="row justify-center q-pa-lg"><q-spinner color="primary" size="34px" /></div>
        <q-form v-else ref="financialForm" @submit.prevent="saveFinancial">
          <div class="row q-col-gutter-md">
            <label-form class-name="col-12 col-md-4" text-label="Renda mensal individual"><q-input v-model.number="financial.individualMonthlyIncome" type="number" min="0" step="0.01" outlined dense dark :readonly="!financialEditing" :rules="moneyRules" prefix="R$" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Renda mensal familiar"><q-input v-model.number="financial.householdMonthlyIncome" type="number" min="0" step="0.01" outlined dense dark :readonly="!financialEditing" :rules="moneyRules" prefix="R$" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Patrimônio declarado"><q-input v-model.number="financial.declaredNetWorth" type="number" min="0" step="0.01" outlined dense dark :readonly="!financialEditing" :rules="moneyRules" prefix="R$" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Moeda"><q-input v-model.trim="financial.currencyCode" maxlength="3" outlined dense dark :readonly="!financialEditing" :rules="currencyRules" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Vigência inicial"><q-input v-model="financial.effectiveFrom" type="date" outlined dense dark :readonly="!financialEditing" :rules="requiredRules" /></label-form>
            <label-form class-name="col-12 col-md-4" text-label="Vigência final"><q-input v-model="financial.effectiveTo" type="date" outlined dense dark :readonly="!financialEditing" :rules="endDateRules(financial.effectiveFrom)" /></label-form>
          </div>
          <div v-if="financialEditing" class="row justify-end q-gutter-sm q-mt-md">
            <q-btn flat dense label="Descartar" no-caps :disable="financialSaving" @click="resetFinancial" />
            <q-btn type="submit" flat dense color="primary" icon="save" label="Salvar" no-caps :loading="financialSaving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card class="tool q-mt-lg">
      <q-card-section class="row items-center justify-between q-col-gutter-md">
        <div>
          <div class="text-subtitle1 text-weight-bold">Contatos de confiança</div>
          <div class="text-caption text-grey-5">Pessoas autorizadas como referência para sua conta.</div>
        </div>
        <q-btn flat dense color="primary" icon="add" label="Adicionar" no-caps :disable="contactsLoading" @click="startContactCreate" />
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-banner v-if="contactsError" rounded class="bg-red-9 text-white q-mb-md">
          {{ contactsError }}
          <template #action><q-btn flat color="white" label="Tentar novamente" @click="loadContacts" /></template>
        </q-banner>
        <div v-if="contactsLoading" class="row justify-center q-pa-lg"><q-spinner color="primary" size="34px" /></div>
        <template v-else>
          <div v-if="!contacts.length" class="empty-state q-pa-lg text-center text-grey-5">
            <q-icon name="people_outline" size="34px" class="q-mb-sm" />
            <div>Nenhum contato de confiança cadastrado.</div>
          </div>
          <q-list v-else separator class="rounded-borders">
            <q-item v-for="contact in contacts" :key="contact.id || contact.trustedContactId">
              <q-item-section avatar><q-avatar color="primary" text-color="white" icon="person" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ contact.name }}</q-item-label>
                <q-item-label caption>{{ contact.relationship || "Relação não informada" }}</q-item-label>
                <q-item-label caption>{{ contact.phoneNumber || "Telefone não informado" }}<span v-if="contact.email"> · {{ contact.email }}</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense color="primary" icon="edit" aria-label="Editar contato" @click="startContactEdit(contact)" />
                  <q-btn flat round dense color="negative" icon="delete" aria-label="Excluir contato" @click="confirmDeleteContact(contact)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-card-section>
    </q-card>

    <q-dialog v-model="contactDialog" persistent>
      <q-card class="tool contact-dialog-card">
        <q-card-section class="row items-center justify-between">
          <div class="text-subtitle1 text-weight-bold">{{ editingContactId ? "Editar contato" : "Novo contato" }}</div>
          <q-btn flat round dense icon="close" aria-label="Fechar" :disable="contactSaving" @click="closeContactDialog" />
        </q-card-section>
        <q-separator dark />
        <q-form ref="contactForm" @submit.prevent="saveContact">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <label-form class-name="col-12 col-md-6" text-label="Nome"><q-input v-model.trim="contactDraft.name" outlined dense dark :rules="requiredRules" /></label-form>
              <label-form class-name="col-12 col-md-6" text-label="Relação"><q-input v-model.trim="contactDraft.relationship" outlined dense dark :rules="requiredRules" /></label-form>
              <label-form class-name="col-12 col-md-6" text-label="Telefone"><q-input v-model.trim="contactDraft.phoneNumber" outlined dense dark hint="Formato internacional, por exemplo +5511999990000" :rules="phoneRules" /></label-form>
              <label-form class-name="col-12 col-md-6" text-label="E-mail"><q-input v-model.trim="contactDraft.email" type="email" outlined dense dark :rules="emailRules" /></label-form>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat dense label="Cancelar" no-caps :disable="contactSaving" @click="closeContactDialog" />
            <q-btn type="submit" flat dense color="primary" icon="save" label="Salvar contato" no-caps :loading="contactSaving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="tool delete-dialog-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">Excluir contato</div>
          <div class="q-mt-sm">Deseja excluir {{ deleteTarget?.name }}?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat dense label="Cancelar" no-caps :disable="deleteSaving" @click="deleteDialog = false" />
          <q-btn flat dense color="negative" label="Excluir" no-caps :loading="deleteSaving" @click="removeContact" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineComponent, reactive, ref } from "vue";
import LabelForm from "src/system/components/form/LabelForm.vue";
import useNotify from "src/composables/useNotify";
import { getApiErrorMessage } from "src/services/clientAuthService";
import {
  createClientTrustedContact,
  deleteClientTrustedContact,
  getClientFinancialProfile,
  getClientProfessionalProfile,
  getClientTrustedContacts,
  updateClientFinancialProfile,
  updateClientProfessionalProfile,
  updateClientTrustedContact,
} from "src/services/clientProfileService";

defineComponent({ name: "ClientProfilesAndTrustedContactsLayout" });

const { successNotify, errorNotify } = useNotify();
const professionalForm = ref(null), financialForm = ref(null), contactForm = ref(null);
const professionalLoading = ref(true), professionalSaving = ref(false), professionalEditing = ref(false), professionalError = ref("");
const financialLoading = ref(true), financialSaving = ref(false), financialEditing = ref(false), financialError = ref("");
const contactsLoading = ref(true), contactSaving = ref(false), contactsError = ref(""), contacts = ref([]), contactDialog = ref(false), editingContactId = ref(null);
const deleteDialog = ref(false), deleteSaving = ref(false), deleteTarget = ref(null);
const professional = reactive({ occupation: "", employerName: "", validFrom: "", validTo: null, isCurrent: true });
const savedProfessional = ref({});
const financial = reactive({ individualMonthlyIncome: null, householdMonthlyIncome: null, declaredNetWorth: null, currencyCode: "BRL", effectiveFrom: "", effectiveTo: null });
const savedFinancial = ref({});
const contactDraft = reactive({ name: "", relationship: "", phoneNumber: "", email: "" });

const requiredRules = [(value) => value !== null && value !== undefined && String(value).trim() !== "" || "Campo obrigatório"];
const moneyRules = [(value) => value === null || value === "" || Number(value) >= 0 || "Informe um valor igual ou maior que zero"];
const currencyRules = [...requiredRules, (value) => /^[A-Za-z]{3}$/.test(value || "") || "Use o código de moeda com três letras"];
const phoneRules = [...requiredRules, (value) => /^\+[1-9]\d{7,14}$/.test(value || "") || "Use o formato internacional, como +5511999990000"];
const emailRules = [...requiredRules, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") || "Informe um e-mail válido"];
const endDateRules = (start) => [(value) => !value || !start || value >= start || "A data final deve ser posterior à inicial"];
const dateOnly = (value) => value ? String(value).slice(0, 10) : null;
const contactId = (contact) => contact.id || contact.trustedContactId;
const collectionFrom = (value) => Array.isArray(value) ? value : value?.items || value?.trustedContacts || value?.data || [];

const applyProfessional = (value = {}) => {
  Object.assign(professional, { occupation: value.occupation || "", employerName: value.employerName || "", validFrom: dateOnly(value.validFrom) || "", validTo: dateOnly(value.validTo), isCurrent: value.isCurrent ?? !value.validTo });
  savedProfessional.value = { ...professional };
};
const loadProfessional = async () => {
  professionalLoading.value = true; professionalError.value = "";
  try { applyProfessional(await getClientProfessionalProfile() || {}); }
  catch (error) { professionalError.value = getApiErrorMessage(error, "Não foi possível carregar o perfil profissional."); }
  finally { professionalLoading.value = false; }
};
const resetProfessional = () => { Object.assign(professional, savedProfessional.value); professionalEditing.value = false; professionalForm.value?.resetValidation(); };
const onCurrentChanged = (current) => { if (current) professional.validTo = null; };
const saveProfessional = async () => {
  professionalSaving.value = true;
  try {
    const payload = { ...professional, validTo: professional.isCurrent ? null : professional.validTo || null };
    applyProfessional(await updateClientProfessionalProfile(payload) || payload); professionalEditing.value = false; successNotify("Perfil profissional atualizado.");
  } catch (error) { errorNotify(getApiErrorMessage(error, "Não foi possível salvar o perfil profissional.")); }
  finally { professionalSaving.value = false; }
};

const applyFinancial = (value = {}) => {
  Object.assign(financial, { individualMonthlyIncome: value.individualMonthlyIncome ?? null, householdMonthlyIncome: value.householdMonthlyIncome ?? null, declaredNetWorth: value.declaredNetWorth ?? null, currencyCode: value.currencyCode || "BRL", effectiveFrom: dateOnly(value.effectiveFrom) || "", effectiveTo: dateOnly(value.effectiveTo) });
  savedFinancial.value = { ...financial };
};
const loadFinancial = async () => {
  financialLoading.value = true; financialError.value = "";
  try { applyFinancial(await getClientFinancialProfile() || {}); }
  catch (error) { financialError.value = getApiErrorMessage(error, "Não foi possível carregar o perfil financeiro."); }
  finally { financialLoading.value = false; }
};
const resetFinancial = () => { Object.assign(financial, savedFinancial.value); financialEditing.value = false; financialForm.value?.resetValidation(); };
const saveFinancial = async () => {
  financialSaving.value = true;
  try {
    const payload = { ...financial, currencyCode: financial.currencyCode.toUpperCase(), effectiveTo: financial.effectiveTo || null };
    applyFinancial(await updateClientFinancialProfile(payload) || payload); financialEditing.value = false; successNotify("Perfil financeiro atualizado.");
  } catch (error) { errorNotify(getApiErrorMessage(error, "Não foi possível salvar o perfil financeiro.")); }
  finally { financialSaving.value = false; }
};

const loadContacts = async () => {
  contactsLoading.value = true; contactsError.value = "";
  try { contacts.value = collectionFrom(await getClientTrustedContacts()); }
  catch (error) { contactsError.value = getApiErrorMessage(error, "Não foi possível carregar os contatos de confiança."); }
  finally { contactsLoading.value = false; }
};
const clearContactDraft = () => Object.assign(contactDraft, { name: "", relationship: "", phoneNumber: "", email: "" });
const startContactCreate = () => { editingContactId.value = null; clearContactDraft(); contactDialog.value = true; };
const startContactEdit = (contact) => { editingContactId.value = contactId(contact); Object.assign(contactDraft, { name: contact.name || "", relationship: contact.relationship || "", phoneNumber: contact.phoneNumber || "", email: contact.email || "" }); contactDialog.value = true; };
const closeContactDialog = () => { if (contactSaving.value) return; contactDialog.value = false; editingContactId.value = null; clearContactDraft(); contactForm.value?.resetValidation(); };
const saveContact = async () => {
  contactSaving.value = true;
  try {
    const payload = { ...contactDraft };
    if (editingContactId.value) await updateClientTrustedContact(editingContactId.value, payload); else await createClientTrustedContact(payload);
    await loadContacts(); successNotify(editingContactId.value ? "Contato atualizado." : "Contato adicionado."); contactSaving.value = false; closeContactDialog();
  } catch (error) { errorNotify(getApiErrorMessage(error, "Não foi possível salvar o contato.")); }
  finally { contactSaving.value = false; }
};
const confirmDeleteContact = (contact) => { deleteTarget.value = contact; deleteDialog.value = true; };
const removeContact = async () => {
  deleteSaving.value = true;
  try { await deleteClientTrustedContact(contactId(deleteTarget.value)); await loadContacts(); deleteDialog.value = false; deleteTarget.value = null; successNotify("Contato excluído."); }
  catch (error) { errorNotify(getApiErrorMessage(error, "Não foi possível excluir o contato.")); }
  finally { deleteSaving.value = false; }
};

loadProfessional(); loadFinancial(); loadContacts();
</script>

<style scoped>
.client-profile-details { max-width: 1180px; margin: 0 auto; }
.contact-dialog-card { width: min(720px, calc(100vw - 32px)); }
.delete-dialog-card { width: min(440px, calc(100vw - 32px)); }
.empty-state { border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 8px; }
</style>
