<template>
  <div :class="templateClass" class="basic-data-edit-layout">
    <label-form className="col-12 col-sm-6" textLabel="Nome Completo">
      <q-input v-model="data.name" class="q-mb-md" outlined dense />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Gênero">
      <q-select
        v-model="data.genre"
        :options="optionsGenre"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Estado Civil">
      <q-select
        v-model="data.civil"
        :options="optionsCivil"
        class="q-mb-md"
        outlined
        dense
      />
    </label-form>
    <div class="col-12"></div>
    <label-form className="col-12 col-sm-4" textLabel="Nacionalidade">
      <q-input v-model="data.nacionalidade" class="q-mb-md" outlined dense />
    </label-form>
    <label-form
      className="col-12 col-sm-4"
      textLabel="Naturalidade (Cidade, UF)"
    >
      <q-input
        v-model="data.naturalidade"
        class="q-mb-md"
        outlined
        dense
        placeholder="ex.: São José dos Campos, SP"
      />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Data de Nascimento">
      <q-input
        v-model="data.birthday"
        class="q-mb-md"
        outlined
        dense
        type="date"
      />
    </label-form>
    <div class="col-12"></div>
    <label-form className="col-12 col-sm" textLabel="Email">
      <q-input v-model="data.email" class="q-mb-md" outlined dense>
        <template v-slot:prepend>
          <IconMail width="16" height="16" color="#ece" />
        </template>
      </q-input>
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Celular">
      <q-input
        v-model="data.phone"
        class="q-mb-md"
        outlined
        dense
        placeholder="(DDD) 00000-0000"
      >
        <template v-slot:prepend>
          <IconPhone width="16" height="16" color="#ece" />
        </template>
      </q-input>
    </label-form>
    <div class="col-12"></div>
    <label-form className="col-12 col-sm" textLabel="Nome Completo da Mãe">
      <q-input v-model="data.mother" class="q-mb-md" outlined dense />
    </label-form>
    <label-form className="col-12 col-sm" textLabel="Nome Completo do Pai">
      <q-input v-model="data.father" class="q-mb-md" outlined dense />
    </label-form>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import LabelForm from "src/system/components/form/LabelForm.vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";

defineComponent({
  name: "BasicDataEditLayout",
});
defineProps({
  templateClass: { type: String, default: "row q-gutter-x-sm" },
});
const optionsGenre = [
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
  { label: "Não informar", value: "O" },
];
const optionsCivil = [
  { label: "Casado(a)", value: "M" },
  { label: "Solteiro(a)", value: "F" },
  { label: "Não informar", value: "O" },
];

const storeUser = useUserStore();
const { data } = storeToRefs(storeUser);

// Seu código aqui
</script>

<style scoped>
/* Seus estilos aqui */
</style>
