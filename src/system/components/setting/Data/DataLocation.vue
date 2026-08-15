<template>
  <div class="data-location row">
    <div
      class="col text-align q-mt-md"
      v-for="(item, index) in dataLocation"
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
  name: "DataLocation",
});
defineProps({
  classDiv: { type: String, default: "col-3 text-align q-mt-md" },
});
const dataLocation = [
  { title: "CEP", value: data.value.account.address_zip_code },
  { title: "Estato", value: data.value.account.address_state ?? "SP" },
  { title: "Cidade", value: data.value.account.address_city ?? "São Paulo" },
  { title: "Cidade", value: data.value.account.address_city ?? "São Paulo" },
  {
    title: "Logradouro",
    value: data.value.account.address_street ?? "Avenida Brasil. 219",
  },
  {
    title: "Bairro",
    value: data.value.account.address_district ?? "Jardim Paraiso",
  },
  {
    title: "Complemento",
    value: data.value.account.address_complement ?? "Bloco A- Sala 04",
  },
];
</script>

<style scoped>
/* Seus estilos aqui */
</style>
