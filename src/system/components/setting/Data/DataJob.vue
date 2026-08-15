<template>
  <div class="data-job row">
    <div
      class="col-2-7 text-align q-mt-md"
      v-for="(item, index) in dataJob"
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
const { data, isDirty, isDirtyData } = storeToRefs(store);
let dateCurrent = new Date(data.value.account.birthday + " 00:00:00");
let brDate = date.formatDate(dateCurrent, "DD/MM/YYYY");
defineComponent({
  name: "DataJob",
});
defineProps({
  classDiv: { type: String, default: "col-3 text-align q-mt-md" },
});
const dataJob = [
  { title: "Atividade Trabalhista", value: "Empresário" },
  { title: "Renda Média Mensal (R$)", value: "R$ 20.000,00" },
  { title: "Renda Média Mensal da Família (R$)", value: "R$ 31.000,00" },
  { title: "Valor Aproximado Dos Seus Bens (R$)", value: "R$ 510.000,00" },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
