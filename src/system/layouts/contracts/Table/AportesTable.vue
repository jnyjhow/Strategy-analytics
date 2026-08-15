<template>
  <q-table
    :rows="props.aportesHistory"
    :columns="historyColumns"
    row-key="id"
    dark
    flat
    :rows-per-page-options="[5, 10, 20]"
    class="bg-transparent"
  >
    <template v-slot:body-cell-usuario="props">
      <q-td :props="props">
        <q-avatar size="24px" class="q-mr-sm">
          <img :src="`${props.row.avatar}`" />
        </q-avatar>
        {{ props.row.usuario }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { defineComponent } from "vue";

defineComponent({
  name: "AportesTable",
});
const props = defineProps({
  aportesHistory: { type: [Array, Object] },
});
const historyColumns = [
  {
    name: "usuario",
    required: true,
    label: "Usuário",
    align: "left",
    field: "usuario",
    sortable: true,
  },
  {
    name: "valor_aporte",
    label: "Valor do Aporte (R$)",
    align: "right",
    field: "valor_aporte",
    sortable: true,
  },
  {
    name: "data",
    label: "Data",
    align: "center",
    field: "data",
    sortable: true,
  },
];
// Seu código aqui
</script>

<style scoped>
/* Seus estilos aqui */
</style>
