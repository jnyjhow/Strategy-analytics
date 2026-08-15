<template>
  <div class="data-location-edit-layout" :class="templateClass">
    <label-form className="col-12 col-sm-3" textLabel="CEP">
      <q-input
        v-model="data.account.address_zip_code"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <label-form className="col-1 col-sm-1" textLabel="Estado">
      <q-select
        placeholder="UF"
        v-model="data.account.address_uf"
        :options="optionsUf"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <label-form className="col-12 col-sm-2" textLabel="Cidade">
      <q-input
        v-model="data.account.address_city"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Logradouro">
      <q-input
        v-model="data.account.address_street"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <div class="col-12"></div>
    <label-form className="col-12 col-sm" textLabel="Bairro">
      <q-input
        v-model="data.account.address_district"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Complemento">
      <q-input
        v-model="data.account.address_state"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import LabelForm from "src/system/components/form/LabelForm.vue";

defineComponent({
  name: "DataLocationEditLayout",
});
defineProps({
  templateClass: { type: String, default: "row q-gutter-x-sm q-mt-md" },
});
const optionsUf = [
  { label: "UF", value: "" },
  { label: "RJ", value: "RJ" },
  { label: "SP", value: "SP" },
  { label: "ES", value: "ES" },
];

const storeUser = useUserStore();
const { data } = storeToRefs(storeUser);
// Seu código aqui
</script>

<style scoped>
/* Seus estilos aqui */
</style>
