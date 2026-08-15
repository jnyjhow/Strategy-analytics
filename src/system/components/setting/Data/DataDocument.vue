<template>
  <div class="data-document row">
    <div
      class="col-2-7 text-align q-mt-md"
      v-for="(item, index) in dataDocuments"
      :key="index"
    >
      <p class="text-grey">{{ item.title }}</p>
      <p>{{ item.value }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { date } from "quasar";

const store = useUserStore();
const { data } = storeToRefs(store);

defineComponent({
  name: "DataDocument",
});
defineProps({
  classDiv: { type: String, default: "col-3 text-align q-mt-md" },
});
const dataDocuments = [
  { title: "CPF", value: data.value.account.person },
  { title: "RG", value: data.value.account.rg ?? "00.000.000-0" },
  { title: "Orgão Emissor", value: data.value.account.rg_emissor ?? "SSP" },
  { title: "UF de Expedição", value: data.value.account.rg_expedidor ?? "SP" },
  {
    title: "Data de Expedição",
    value: data.value.account.rg_date_expedidor ?? "12/08/1990",
  },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
