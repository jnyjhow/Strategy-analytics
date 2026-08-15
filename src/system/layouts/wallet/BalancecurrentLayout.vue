<template>
  <q-card class="BalancecurrentLayout bg-transparent row q-mt-sm card-wallet">
    <q-card-section class="col-12 row q-mb-sm justify-between">
      <wallet-total :currentWallet="setCurrentWallet" />
      <chart-wallet />
    </q-card-section>
  </q-card>
  <!-- {{ setCurrentWallet }} -->
  <div class="row justify-center">
    <div
      class="col-12 col-lg-10 row q-gutter-md justify-center q-mt-xs-lg q-mt-md-none"
    >
      <balance-items
        v-for="(item, index) in optionsBalance"
        :key="index"
        :loading="loading"
        :icon="item.icon"
        :title="item.name"
        :brCoin="item.brCoin"
        :objText="item.objText"
        :colorItem="item.colorItem"
        :balance="item.balance"
        :btnBgColor="item.btnBgColor"
        :bgBadgeBank="item.bgBadgeBank"
        :tooltip="item.tooltip"
        :viewValues="dashboard.view_wallet_value"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "src/stores/user";
import { useStoreLayout } from "src/stores/layoutStore";
import useDataUser from "src/composables/system/Requests/useDataUser";
import CurrentBalance from "src/system/components/wallet/CurrentBalance.vue";
import BalanceItems from "src/system/components/wallet/BalanceItems.vue";
import TransictionsInvestments from "src/system/components/wallet/TransictionsInvestments.vue";
import WalletTotal from "src/system/components/wallet/WalletTotal.vue";
import ChartWallet from "src/system/components/ChartWallet.vue";

export default defineComponent({
  name: "BalancecurrentLayout",
  components: {
    CurrentBalance,
    BalanceItems,
    TransictionsInvestments,
    WalletTotal,
    ChartWallet,
  },
  setup() {
    const getInve = computed(() => wallet.value.current_investment);

    const teste = ref(true);
    const userStore = useUserStore();
    const { wallet, setCurrentWallet, getAvailableToInvest, getCurrentInvest } =
      storeToRefs(userStore);
    const { getWallet, loading } = useDataUser();
    const storeLayout = useStoreLayout();
    const { system, getColorTheme, dashboard } = storeToRefs(storeLayout);
    const classBadge = computed(() => {
      return `${system.value.theme}-invest`;
    });
    const colorItem = computed(() => {
      return `${system.value.theme}-color-bank`;
    });
    const bgBtn = computed(() => {
      return `${system.value.theme}-btn-bank`;
    });
    const bgBadgeBank = computed(() => {
      return `${system.value.theme}-badge-bank`;
    });
    onMounted(async () => {
      await getWallet();
    });

    const optionsLinks = [
      {
        name: "Retirada",
        icon: "img:/system/icons/wallet-set.svg",
        link: "#",
        disabled: true,
      },
      {
        name: "Câmbio",
        // icon: "fa-solid fa-arrow-right-arrow-left",
        icon: "img:/system/icons/wallet-cambio.svg",
        link: "#",
        disabled: true,
      },
      {
        name: "Depósita",
        icon: "img:/system/icons/wallet-get.svg",
        link: "/deposit",
        disabled: false,
      },
    ];
    const optionsBalance = ref([
      {
        name: "Investimentos",
        brCoin: true,
        objText: false,
        balance: "15.312,95",
        colorItem: "bg-primary",
        tooltip: "InvestmentTips",
      },
      {
        name: "Saldo Investível",
        brCoin: true,
        objText: false,
        balance: "34.454,15",
        colorItem: "bg-info",
        tooltip: "InvestableTips",
      },
      {
        name: "Banking",
        brCoin: true,
        objText: false,
        balance: "11.484,71",
        colorItem: "bg-accent",
        tooltip: "BaseBalance",
      },
    ]);
    return {
      getInve,
      wallet,
      loading,
      teste,
      optionsLinks,
      optionsBalance,
      classBadge,
      colorItem,
      bgBadgeBank,
      bgBtn,
      getColorTheme,
      setCurrentWallet,
      getAvailableToInvest,
      getCurrentInvest,
      dashboard,
    };
  },
  // Outras configurações do componente aqui
});
</script>

<style scoped lang="sass">
.span-trans:hover
  transform: scale(1.05)
.card-wallet
  opacity: 1
  border-radius: 8px
  border-width: 1px
  padding: 14px
  background: linear-gradient(224.8deg, rgba(121, 24, 35, 0.4) 0.17%, rgba(51, 10, 15, 0.4) 9.09%, rgba(9, 12, 21, 0.4) 39.13%, rgba(9, 41, 62, 0.4) 73.45%, rgba(17, 77, 118, 0.4) 99.83%);
  border: 1px solid #EFEFEF14
  backdrop-filter: blur(32px)
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.24)
</style>
