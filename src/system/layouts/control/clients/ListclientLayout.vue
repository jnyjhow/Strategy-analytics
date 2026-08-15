<template>
  <div class="ListclientLayout">
    <!-- Seu conteúdo HTML aqui -->
    <div class="row justify-center">
      <q-table
        title="Clientes"
        :rows="usersClient"
        :columns="columnsClient"
        :filter="filter"
        no-data-label="Não encontrei nenhum usuário para exibir."
        no-results-label="Esse filtro não encontrou nenhum resultado"
        row-key="name"
        :loading="loading"
        v-bind="{ ...$tableStyle }"
      >
        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="sm">
              <img :src="props.row.avatar" />
            </q-avatar>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row justify-end q-gutter-sm">
              <q-btn
                v-for="item in btnActions"
                :key="item"
                v-bind="{ ...$btnTable }"
                :color="item.color"
                :icon="item.icon"
                @click.prevent="handlerAction(item.action, props.row)"
              >
                <q-tooltip class="bg-indigo-14" :offset="[10, 10]">
                  {{ item.tooltipText }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="roleControl" v-bind="{ ...$dialogCard }">
      <roleuser-layout :user="userEdit" />
    </q-dialog>
    <q-dialog v-model="controlIncome" v-bind="{ ...$dialogCard }">
      <income-layout :user="userEdit" />
    </q-dialog>
    <q-dialog v-model="viewExtract" v-bind="{ ...$dialogCard }">
      <extract-layout :user="userEdit" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import useClient from "src/composables/system/Requests/useClient";
import RoleuserLayout from "../users/RoleuserLayout.vue";
import IncomeLayout from "./IncomeLayout.vue";
import ExtractLayout from "./ExtractLayout.vue";
import useClientHelpers from "src/composables/system/Helpers/useClientHelpers";

export default defineComponent({
  name: "ListclientLayout",
  components: {
    RoleuserLayout,
    IncomeLayout,
    ExtractLayout,
  },
  setup() {
    const filter = ref("");
    const { loading, getAllClient, usersClient } = useClient();
    const {
      columnsClient,
      btnActions,
      actions,
      roleControl,
      controlIncome,
      userEdit,
      viewExtract,
      handlerAction,
    } = useClientHelpers();
    onMounted(async () => {
      await getAllClient();
    });
    return {
      filter,
      loading,
      columnsClient,
      usersClient,
      roleControl,
      controlIncome,
      userEdit,
      btnActions,
      viewExtract,
      handlerAction,
    };
  },
  // Outras configurações do componente aqui
});
</script>

<style scoped>
/* Estilos específicos do componente aqui */
</style>
