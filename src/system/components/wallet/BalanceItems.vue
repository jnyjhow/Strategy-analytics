<template>
  <q-inner-loading
    :showing="loading"
    label="Please wait..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
  <div class="balance-items col-12 col-sm q-mt-md-lg q-mt-xs-md">
    <div class="display-none">
      <!--
          :target="true"
         no-parent-event -->
      <q-tooltip
        v-model="showing"
        class="bg-transparent z-max"
        :anchor="anchor"
        :self="self"
      >
        <component
          :is="componentMaps[tooltip]"
          @closed="showing = false"
          :color="colorItem"
        />
      </q-tooltip>
    </div>

    <div class="tool">
      <div class="q-mb-sm">
        <div class="row items-center">
          <div
            style="width: 12px; height: 12px; border-radius: 1px"
            class="q-mr-sm"
            :class="colorItem"
          ></div>
          <span class="text-roboto-15-500 text-weight-bolder">{{ title }}</span>
          <q-btn flat @click.prevent="showTooltip">
            <IconInfoCircle />
          </q-btn>
        </div>
      </div>
      <div
        class="row justify-between items-center q-mt-lg"
        :class="{ 'text-none': viewValues }"
      >
        <div class="col-lg-auto col-12" style="display: flex; align-items: end">
          <div style="line-height: 1rem">
            <p class="text-roboto-32-700">
              {{ $filters.currentValue(balance, brCoin) }}
            </p>
            <p class="text-weight-light">
              (USD {{ $filters.convertCoin(balance) }})
            </p>
          </div>
        </div>
        <p class="text-roboto-16-400 text-muted col-lg-auto col-12">
          +2% vs. período anterior
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { IconInfoCircle } from "@tabler/icons-vue";
import { defineComponent, ref } from "vue";
import InvestmentTips from "src/system/layouts/wallet/tooltips/InvestmentTips.vue";
import InvestableTips from "src/system/layouts/wallet/tooltips/InvestableTips.vue";
import BaseBalance from "src/system/layouts/wallet/tooltips/BaseBalance.vue";

export default defineComponent({
  name: "BalanceItems",
  components: { InvestmentTips, InvestableTips, BaseBalance },
  props: {
    title: { type: String },
    icon: { type: String },
    balance: { type: String, default: "0,00" },
    country: { type: Boolean, default: false },
    cipher: { type: String, default: "R$" },
    brCoin: { type: Boolean, default: true },
    objText: { type: [Object, Boolean], default: false },
    colorItem: { type: String },
    tooltip: { type: String, default: "InvestmentTips" },
    btnBgColor: { type: String, default: "btn-bank" },
    bgBadgeBank: { type: String, default: "badge-bank" },
    loading: { type: Boolean },
    anchor: {
      type: String,
      default: "top end",
    },
    self: {
      type: String,
      default: "bottom end",
    },
    viewValues: { type: Boolean },
    // iconTheme: { type: String, default: "white" },
  },
  setup() {
    const showing = ref(false);
    const componentMaps = {
      InvestmentTips,
      InvestableTips,
      BaseBalance,
    };
    // Função para mostrar o tooltip
    const showTooltip = () => {
      showing.value = true;
    };

    // Função para fechar o tooltip
    const closeTooltip = () => {
      showing.value = false;
    };

    return { componentMaps, showing, showTooltip, closeTooltip };
  },
});
</script>
