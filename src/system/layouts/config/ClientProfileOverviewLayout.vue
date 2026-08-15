<template>
  <div class="client-profile-overview">
    <q-banner v-if="loadError" rounded class="bg-red-9 text-white q-mb-md">
      {{ loadError }}
      <template #action
        ><q-btn flat color="white" label="Tentar novamente" @click="load"
      /></template>
    </q-banner>
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="38px" />
    </div>
    <template v-else-if="!loadError">
      <q-card class="tool profile-section">
        <div class="section-header">
          <span class="text-weight-bold">Dados pessoais</span>
          <q-btn
            v-if="!editing"
            flat
            dense
            color="white"
            icon="edit"
            label="Editar"
            no-caps
            @click="editing = true"
          />
          <div v-else class="section-actions">
            <q-btn
              flat
              dense
              color="primary"
              icon="check"
              label="Salvar"
              no-caps
              :loading="savingProfile"
              @click="profileForm?.submit()"
            />
            <q-btn
              flat
              dense
              color="grey-5"
              label="Descartar"
              no-caps
              @click="resetProfile"
            />
          </div>
        </div>

        <div v-if="!editing" class="profile-data-grid">
          <div class="profile-data-item">
            <span>Nome completo</span>
            <strong>{{ displayName }}</strong>
          </div>
          <div class="profile-data-item">
            <span>Contato principal</span>
            <strong>{{ primaryContact }}</strong>
          </div>
          <div class="profile-data-item">
            <span>Data de nascimento</span>
            <strong>{{ formatDate(profileFields.birthDate) }}</strong>
          </div>
          <div
            v-for="field in personalFields"
            :key="field.key"
            class="profile-data-item"
          >
            <span>{{ field.label }}</span>
            <strong>{{
              formatValue(profileFields.personalDetails[field.key])
            }}</strong>
          </div>
        </div>

        <div v-else class="section-form">
          <q-form ref="profileForm" @submit.prevent="saveProfile">
            <div class="row q-col-gutter-md">
              <label-form
                class-name="col-12 col-sm-6 col-md-4"
                text-label="Data de nascimento"
              >
                <q-input
                  v-model="profileFields.birthDate"
                  class="edit-field"
                  type="date"
                  outlined
                  dense
                  bg-color="white"
                  color="primary"
                />
              </label-form>
              <label-form
                v-for="field in personalFields"
                :key="field.key"
                class-name="col-12 col-sm-6 col-md-4"
                :text-label="field.label"
              >
                <q-input
                  v-model.trim="profileFields.personalDetails[field.key]"
                  class="edit-field"
                  outlined
                  dense
                  bg-color="white"
                  color="primary"
                />
              </label-form>
            </div>
          </q-form>
        </div>
      </q-card>

      <q-card class="tool profile-section q-mt-lg">
        <div class="section-header">
          <span class="text-weight-bold">Preferências</span>
          <q-btn
            v-if="!editingPreferences"
            flat
            dense
            color="white"
            icon="edit"
            label="Editar"
            no-caps
            @click="startPreferencesEdit"
          />
          <div v-else class="section-actions">
            <q-btn
              flat
              dense
              color="primary"
              icon="check"
              label="Salvar"
              no-caps
              :loading="savingPreferences"
              @click="savePreferences"
            />
            <q-btn
              flat
              dense
              color="grey-5"
              label="Descartar"
              no-caps
              @click="resetPreferences"
            />
          </div>
        </div>

        <div
          v-if="!editingPreferences"
          class="profile-data-grid preferences-grid"
        >
          <div
            v-for="field in preferenceFields"
            :key="field.key"
            class="profile-data-item"
          >
            <span>{{ field.label }}</span>
            <strong>{{ preferenceLabel(field.key) }}</strong>
          </div>
        </div>

        <div v-else class="section-form">
          <div class="row q-col-gutter-md">
            <label-form
              class-name="col-12 col-sm-6 col-md-4"
              text-label="Moeda principal"
              ><q-select
                v-model="preferences.primaryCurrencyCode"
                class="edit-field"
                :options="currencyOptions"
                emit-value
                map-options
                outlined
                dense
                bg-color="white"
                color="primary"
            /></label-form>
            <label-form
              class-name="col-12 col-sm-6 col-md-4"
              text-label="Moeda secundária"
              ><q-select
                v-model="preferences.secondaryCurrencyCode"
                class="edit-field"
                :options="currencyOptions"
                emit-value
                map-options
                clearable
                outlined
                dense
                bg-color="white"
                color="primary"
            /></label-form>
            <label-form
              class-name="col-12 col-sm-6 col-md-4"
              text-label="Idioma"
              ><q-select
                v-model="preferences.languageCode"
                class="edit-field"
                :options="languageOptions"
                emit-value
                map-options
                outlined
                dense
                bg-color="white"
                color="primary"
            /></label-form>
            <label-form
              class-name="col-12 col-sm-6 col-md-4"
              text-label="Fuso horário"
              ><q-select
                v-model="preferences.timeZoneId"
                class="edit-field"
                :options="timeZoneOptions"
                emit-value
                map-options
                outlined
                dense
                bg-color="white"
                color="primary"
            /></label-form>
            <label-form class-name="col-12 col-sm-6 col-md-4" text-label="Tema"
              ><q-select
                v-model="preferences.theme"
                class="edit-field"
                :options="themeOptions"
                emit-value
                map-options
                outlined
                dense
                bg-color="white"
                color="primary"
            /></label-form>
          </div>
        </div>
      </q-card>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import LabelForm from "src/system/components/form/LabelForm.vue";
import useNotify from "src/composables/useNotify";
import { getApiErrorMessage } from "src/services/clientAuthService";
import {
  getClientPreferences,
  getClientProfile,
  getClientProfileSummary,
  getPreferenceCatalog,
  updateClientPreferences,
  updateClientProfile,
} from "src/services/clientProfileService";

const { successNotify, errorNotify } = useNotify();
const loading = ref(true),
  loadError = ref(""),
  editing = ref(false),
  editingPreferences = ref(false),
  savingProfile = ref(false),
  savingPreferences = ref(false);
const summary = ref(null),
  profile = ref(null),
  catalog = ref({}),
  profileForm = ref(null);
const profileFields = reactive({ birthDate: null, personalDetails: {} });
const preferences = reactive({
  primaryCurrencyCode: null,
  secondaryCurrencyCode: null,
  languageCode: "",
  timeZoneId: "",
  theme: "",
});
const preferencesSnapshot = ref(null);
const personalFields = [
  { key: "gender", label: "Gênero" },
  { key: "maritalStatus", label: "Estado civil" },
  { key: "nationality", label: "Nacionalidade" },
  { key: "birthCity", label: "Cidade natal" },
  { key: "birthState", label: "Estado natal" },
  { key: "motherName", label: "Nome da mãe" },
  { key: "fatherName", label: "Nome do pai" },
];
const displayName = computed(
  () =>
    summary.value?.displayName ||
    summary.value?.primaryName ||
    profile.value?.names?.find((item) => item.isPrimary)?.displayName ||
    "Meu perfil",
);
const primaryContact = computed(
  () =>
    summary.value?.primaryContact ||
    profile.value?.contacts?.find((item) => item.isPrimary)?.value ||
    "Contato não informado",
);
const toOptions = (
  items = [],
  valueKeys = ["code", "id", "value"],
  labelKeys = ["displayName", "name", "label"],
) =>
  items
    .map((item) =>
      typeof item === "string"
        ? { label: item, value: item }
        : {
            value: valueKeys.map((key) => item?.[key]).find(Boolean),
            label:
              labelKeys.map((key) => item?.[key]).find(Boolean) ||
              valueKeys.map((key) => item?.[key]).find(Boolean),
          },
    )
    .filter((item) => item.value);
const currencyOptions = computed(() => toOptions(catalog.value.currencies));
const languageOptions = computed(() =>
  toOptions(catalog.value.languages, ["code", "languageCode", "value"]),
);
const timeZoneOptions = computed(() =>
  toOptions(catalog.value.timeZones || catalog.value.timezones, [
    "id",
    "timeZoneId",
    "value",
  ]),
);
const themeOptions = computed(() =>
  toOptions(catalog.value.themes, ["value", "code", "id"]),
);
const preferenceFields = [
  {
    key: "primaryCurrencyCode",
    label: "Moeda principal",
    options: currencyOptions,
  },
  {
    key: "secondaryCurrencyCode",
    label: "Moeda secundária",
    options: currencyOptions,
  },
  { key: "languageCode", label: "Idioma", options: languageOptions },
  { key: "timeZoneId", label: "Fuso horário", options: timeZoneOptions },
  { key: "theme", label: "Tema", options: themeOptions },
];
const formatValue = (value) => value || "Não informado";
const formatDate = (value) => {
  if (!value) return "Não informado";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
};
const preferenceLabel = (key) => {
  const field = preferenceFields.find((item) => item.key === key);
  const value = preferences[key];
  return (
    field?.options.value.find((item) => item.value === value)?.label ||
    formatValue(value)
  );
};
const fillProfile = () => {
  profileFields.birthDate = profile.value?.birthDate?.slice(0, 10) || null;
  profileFields.personalDetails = { ...profile.value?.personalDetails };
};
const resetProfile = () => {
  fillProfile();
  editing.value = false;
  profileForm.value?.resetValidation();
};
const startPreferencesEdit = () => {
  preferencesSnapshot.value = { ...preferences };
  editingPreferences.value = true;
};
const resetPreferences = () => {
  if (preferencesSnapshot.value)
    Object.assign(preferences, preferencesSnapshot.value);
  editingPreferences.value = false;
};
const load = async () => {
  loading.value = true;
  loadError.value = "";
  try {
    const [summaryData, profileData, preferenceData, catalogData] =
      await Promise.all([
        getClientProfileSummary(),
        getClientProfile(),
        getClientPreferences(),
        getPreferenceCatalog(),
      ]);
    summary.value = summaryData || {};
    profile.value = profileData || {};
    catalog.value = catalogData || {};
    fillProfile();
    Object.assign(preferences, {
      primaryCurrencyCode: preferenceData?.primaryCurrencyCode ?? null,
      secondaryCurrencyCode: preferenceData?.secondaryCurrencyCode ?? null,
      languageCode: preferenceData?.languageCode ?? "",
      timeZoneId: preferenceData?.timeZoneId ?? "",
      theme: preferenceData?.theme ?? "",
    });
  } catch (error) {
    loadError.value = getApiErrorMessage(
      error,
      "Não foi possível carregar seu perfil.",
    );
  } finally {
    loading.value = false;
  }
};
const saveProfile = async () => {
  try {
    savingProfile.value = true;
    await updateClientProfile({
      birthDate: profileFields.birthDate || null,
      names: profile.value?.names ?? [],
      contacts: profile.value?.contacts ?? [],
      addresses: profile.value?.addresses ?? [],
      personalDetails: { ...profileFields.personalDetails },
    });
    profile.value = await getClientProfile();
    fillProfile();
    editing.value = false;
    successNotify("Dados pessoais atualizados.");
  } catch (error) {
    errorNotify(
      getApiErrorMessage(error, "Não foi possível salvar seus dados."),
    );
  } finally {
    savingProfile.value = false;
  }
};
const savePreferences = async () => {
  try {
    savingPreferences.value = true;
    await updateClientPreferences({ ...preferences });
    preferencesSnapshot.value = { ...preferences };
    editingPreferences.value = false;
    successNotify("Preferências atualizadas.");
  } catch (error) {
    errorNotify(
      getApiErrorMessage(error, "Não foi possível salvar suas preferências."),
    );
  } finally {
    savingPreferences.value = false;
  }
};

load();
</script>

<style scoped>
.client-profile-overview {
  width: 100%;
}

.profile-section {
  padding: 24px;
}

.section-header,
.section-actions {
  display: flex;
  align-items: center;
}

.section-header {
  min-height: 32px;
  gap: 8px;
}

.section-actions {
  gap: 4px;
}

.profile-data-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 22px 32px;
  margin-top: 24px;
}

.preferences-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.profile-data-item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.profile-data-item span {
  color: #989898;
  font-size: 14px;
  line-height: 20px;
}

.profile-data-item strong {
  overflow-wrap: anywhere;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
}

.section-form {
  margin-top: 24px;
}

.edit-field :deep(.q-field__native),
.edit-field :deep(.q-field__input),
.edit-field :deep(.q-field__marginal) {
  color: #1d1d1d;
}

.edit-field :deep(.q-field__control) {
  min-height: 40px;
  border-radius: 4px;
}

@media (max-width: 1023px) {
  .profile-data-grid,
  .preferences-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .profile-section {
    padding: 16px;
  }

  .section-header {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .profile-data-grid,
  .preferences-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 20px;
  }
}
</style>
