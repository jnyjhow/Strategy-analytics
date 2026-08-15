<template>
  <div class="data-contact row">
    <div
      class="col-2-7 text-align q-mt-md"
      v-for="(item, index) in dataContact"
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
  name: "DataContact",
});
defineProps({
  classDiv: { type: String, default: "col-3 text-align q-mt-md" },
});
const dataContact = [
  { title: "Nome Completo do Contato", value: "Maria Alice da Silva" },
  { title: "Renda Média Mensal (R$)", value: "(18) 91502-2191" },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
