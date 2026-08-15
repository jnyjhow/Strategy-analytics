<template>
  <div class="ListwaintingLayout">
    <q-table
      title="depositos"
      :filter="filter"
      :rows="waintings"
      no-data-label="Não há nenhuma deposito pendente de confirmação."
      no-results-label="Esse não encontramos nenhuma dados com o valor da pesquisa"
      :columns="columnsWainting"
      row-key="transaction_code"
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
          <div class="row justify-center q-gutter-sm">
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
    <q-dialog v-model="viewDeposit" v-bind="{ ...$dialogCard }">
      <statuschange-layout :deposit="depositEdit" />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDepositStore } from "src/stores/deposit";
import useDeposit from "src/composables/system/Requests/useDeposit";
import useDepositHelpers from "src/composables/system/Helpers/useDepositHelpers";
import StatuschangeLayout from "./StatuschangeLayout.vue";

export default defineComponent({
  name: "ListwaintingLayout",
  components: { StatuschangeLayout },
  setup() {
    const filter = ref("");
    const { getWaintings } = useDeposit();
    const depositStore = useDepositStore();
    const { waintings } = storeToRefs(depositStore);
    const {
      columnsWainting,
      btnActions,
      viewDeposit,
      depositEdit,
      handlerAction,
    } = useDepositHelpers();
    onMounted(async () => {
      await getWaintings();
    });
    return {
      filter,
      columnsWainting,
      waintings,
      btnActions,
      handlerAction,
      depositEdit,
      viewDeposit,
    };
  },
});
</script>
<style lang=""></style>
