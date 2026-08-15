<template>
  <div class="data-basic row">
    <div
      class="col-2-7 text-align q-mt-md"
      v-for="(item, index) in dadosBasicos"
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
  name: "DataBasic",
});
defineProps({
  classDiv: { type: String, default: "col-3 text-align q-mt-md" },
});
const dadosBasicos = [
  { title: "Nome Completo", value: data.value.name },
  { title: "Gênero", value: data.value.gender ?? "Masculino" },
  { title: "Estado Civil", value: data.value.maritalStatus ?? "Solteiro" },
  { title: "Nacionalidade", value: data.value.nationality ?? "Brasileira" },
  {
    title: "Naturalidade (Cidade, UF)",
    value: data.value.naturalidade ?? "São Paulo, SP",
  },
  {
    title: "Data de Nascimento",
    value: brDate,
  },
  { title: "Email", value: data.value.email },
  { title: "Celular", value: data.value.account.phone ?? "00.000.000-00" },
  // { title: "CPF", value: data.value.account.person },
  {
    title: "Nome Completo da Mãe",
    value: data.value.account.mother ?? "Maria Aparecida da Silva",
  },
  {
    title: "Nome Completo do Pai",
    value: data.value.account.father ?? "José Carlos Martins",
  },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
