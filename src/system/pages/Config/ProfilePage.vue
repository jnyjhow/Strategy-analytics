<template>
  <q-page class="profile-page">
    <title-page title="Perfil Completo" subtitle="Área Perfil" :toBack="true">
    </title-page>
    <q-tabs
      v-model="tab"
      active-color="white"
      class="q-ma-md tool"
      align="left"
      no-caps
    >
      <q-tab
        :name="item.value"
        :label="item.label"
        v-for="(item, index) in options"
        :key="index"
      ></q-tab>
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      vertical
      transition-prev="scale"
      transition-next="scale"
      class="bg-transparent"
    >
      <q-tab-panel
        :name="item.value"
        v-for="(item, index) in options"
        :key="index"
      >
        <component :is="componentsMap[item.component]" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import TitlePage from "src/system/components/TitlePage.vue";
import PersonalSettingLayout from "src/system/layouts/config/PersonalSettingLayout.vue";
import ClientProfilesAndTrustedContactsLayout from "src/system/layouts/config/ClientProfilesAndTrustedContactsLayout.vue";
import DocumentationSettingLayout from "src/system/layouts/config/DocumentationSettingLayout.vue";
import AccountBankSettingLayout from "src/system/layouts/config/AccountBankSettingLayout.vue";
import ClientTimelineLayout from "src/system/layouts/config/ClientTimelineLayout.vue";
import ClientAccountSecurityLayout from "src/system/layouts/config/ClientAccountSecurityLayout.vue";
import ClientMediaSharingLayout from "src/system/layouts/config/ClientMediaSharingLayout.vue";
import RegisterAssetsLayout from "src/system/layouts/config/RegisterAssetsLayout.vue";
import TermsContractLayouts from "src/system/layouts/config/TermsContractLayouts.vue";
import { IconArrowLeft } from "@tabler/icons-vue";

const componentsMap = {
  PersonalSettingLayout,
  ClientProfilesAndTrustedContactsLayout,
  DocumentationSettingLayout,
  AccountBankSettingLayout,
  ClientTimelineLayout,
  ClientAccountSecurityLayout,
  ClientMediaSharingLayout,
  RegisterAssetsLayout,
  TermsContractLayouts,
};
defineComponent({
  name: "ProfilePage",
});

const tab = ref("personal");

const options = [
  {
    label: "Dados Pessoais",
    value: "personal",
    component: "PersonalSettingLayout",
  },
  {
    label: "Perfis e Contatos",
    value: "profiles",
    component: "ClientProfilesAndTrustedContactsLayout",
  },
  {
    label: "Documentação",
    value: "documentation",
    component: "DocumentationSettingLayout",
  },
  {
    label: "Contas Bancárias",
    value: "bank",
    component: "AccountBankSettingLayout",
  },
  {
    label: "Timeline",
    value: "timeline",
    component: "ClientTimelineLayout",
  },
  {
    label: "Conta e segurança",
    value: "security",
    component: "ClientAccountSecurityLayout",
  },
  {
    label: "Mídia e compartilhamento",
    value: "sharing",
    component: "ClientMediaSharingLayout",
  },
  {
    label: "Registro de Patrimônios",
    value: "patrimonio",
    component: "RegisterAssetsLayout",
  },
  {
    label: "Contratos e Termos",
    value: "contracts",
    component: "TermsContractLayouts",
  },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
