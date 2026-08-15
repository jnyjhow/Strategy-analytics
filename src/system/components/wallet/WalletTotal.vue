<template>
  <div class="wallet-total col-md-auto col-xs-12">
    <p class="text-h6 text-weight-light">Carteira Total</p>
    <div
      class="text-h3 text-weight-bolder"
      style="line-height: 2rem; margin-top: 1.5rem; transition: all 2s"
      :class="{ 'text-none': dashboard.view_wallet_value }"
    >
      R$ {{ currentWallet }}
      <q-btn
        flat
        @click.prevent="viewValues"
        v-if="!dashboard.view_wallet_value"
      >
        <IconEyeOff />
      </q-btn>
      <q-btn flat v-else @click.prevent="viewValues">
        <IconEye />
      </q-btn>
      <br />
      <b class="text-h6 text-weight-light">
        USD {{ $filters.convertCoin(currentWallet) }}
      </b>
    </div>
    <div
      style="width: 84%; height: 0.4rem; display: flex; border-radius: 8px"
      class="q-my-sm"
    >
      <div
        class="bg-primary"
        style="
          flex: 1 1 20%;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        "
      ></div>
      <div class="bg-info" style="flex: 1 1 45%"></div>
      <div
        class="bg-accent"
        style="
          flex: 1 1 15%;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        "
      ></div>
    </div>
    <div class="actions row q-gutter-md q-mt-sm">
      <q-btn class="btn-pattern-transparent" no-caps @click.prevent="deposit">
        <IconArrowDown
          width="24"
          height="24"
          class="btn-pattern-transparent-icon"
        />
        Depósito
      </q-btn>
      <q-btn
        class="btn-pattern-transparent"
        no-caps
        @click.prevent="dialogTransfer = true"
      >
        <IconTransfer
          width="24"
          height="24"
          class="btn-pattern-transparent-icon"
        />
        Transferência
      </q-btn>
      <q-btn class="btn-pattern-transparent" no-caps :to="{ name: 'Saque' }">
        <IconArrowUp
          width="24"
          height="24"
          class="btn-pattern-transparent-icon"
        />
        Saque
      </q-btn>
    </div>

    <q-dialog v-model="dialogDeposit" persistent>
      <card-deposit />
    </q-dialog>
    <q-dialog v-model="dialogTransfer">
      <card-transfer />
    </q-dialog>
  </div>
</template>

<script setup>
import { IconArrowDown, IconArrowUp, IconTransfer } from "@tabler/icons-vue";
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardDeposit from "src/system/layouts/deposit/CardDeposit.vue";
import CardTransfer from "src/system/layouts/deposit/CardTransfer.vue";
// import { useLayoutStore } from "src/stores/layout";
import useStorage from "src/composables/system/useStorage";
import { useStoreLayout } from "src/stores/layoutStore";
import { storeToRefs } from "pinia";
const storeLayout = useStoreLayout();
const { dashboard } = storeToRefs(storeLayout);
const { setSystemViewValues } = useStorage();
const route = useRoute();
const router = useRouter();
defineComponent({
  name: "WalletTotal",
});
const viewValues = async () => {
  storeLayout.setToggleViewWalletValues();
  await setSystemViewValues();
};

const props = defineProps({
  currentWallet: {
    type: [Number, String],
  },
});
const dialogDeposit = ref(false);
const dialogTransfer = ref(false);
const deposit = () => {
  dialogDeposit.value = true;
};

watch(
  () => route.query.modal,
  async (modal) => {
    if (modal !== "deposit") return;
    dialogDeposit.value = true;
    const query = { ...route.query };
    delete query.modal;
    await router.replace({ query });
  },
  { immediate: true },
);
</script>

<style scoped lang="sass">
/* Seus estilos aqui */
.btn-pattern-transparent-icon
  background: linear-gradient(202.99deg, rgba(0, 0, 0, 0.24) 0.52%, rgba(0, 0, 0, 0.08) 51.12%, rgba(0, 0, 0, 0.04) 99.48%);
  border-radius: 4px
  padding: 4px
  margin-right: 8px
  color:#00A3FF
</style>
