<template>
  <div class="personal-setup-layout text-white column">
    <q-inner-loading
      :showing="!data.account"
      label="Pegando seus dados..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <change-photo
      v-if="data.account"
      :name="data.name"
      :phone="data.account.phone"
      :mail="data.email"
      :address="`${data.account.address_state} - ${data.account.address_district}`"
      :themeSystem="system.theme"
    />
    <div class="tool q-mt-md">
      <q-tabs
        v-model="tab"
        active-color="white"
        class="q-my-sm"
        align="left"
        no-caps
      >
        <q-tab name="personal" label="Dados Pessoais" />
        <q-tab name="bank" label="Dados Bancários" />
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="scale"
        transition-next="scale"
        class="bg-transparent"
      >
        <q-tab-panel name="personal">
          <personal-setting />
        </q-tab-panel>
        <q-tab-panel name="bank">
          <banks-setting />
        </q-tab-panel>
      </q-tab-panels>
      <q-btn
        class="q-mt-md"
        color="primary"
        label="Ver Perfil Completo"
        no-caps
        style="border-radius: 8px; font-weight: 400"
        :to="{ name: 'profile' }"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useStoreLayout } from "src/stores/layoutStore";
import { storeToRefs } from "pinia";

import useCase from "src/composables/system/useCase";
import useNotify from "src/composables/useNotify";
import useAccount from "src/composables/system/Requests/useAccount";

import ChangePhoto from "src/system/components/setting/ChangePhoto.vue";
import PersonalSetting from "src/system/components/setting/PersonalSetting.vue";
import BanksSetting from "src/system/components/setting/BanksSetting.vue";

export default defineComponent({
  name: "PersonalsetupLayout",
  components: {
    ChangePhoto,
    PersonalSetting,
    BanksSetting,
  },
  setup() {
    const sameInput = ref();
    const cardStatus = ref(false);
    const edit = ref();
    const store = useUserStore();
    const storeLayout = useStoreLayout();
    const { data, isDirty, isDirtyData } = storeToRefs(store);
    const { system } = storeToRefs(storeLayout);

    const { same } = useCase();
    const { infoNotify } = useNotify();
    const { updateData, loading } = useAccount();
    const deleteAction = ref();
    const idEdit = ref();

    const editBank = (item, action = false) => {
      deleteAction.value = action;
      cardStatus.value = true;
      idEdit.value = item != 0 ? item.id : item;
      store.getAccount(item.id);
      // edit.value = item.id;
      // console.log("edit vale ", edit.value);
    };
    const tab = ref("personal");
    const onSubmitData = async () => {
      if (
        same(isDirty.value.name, data.value.name) &&
        same(isDirtyData.value.phone, data.value.account.phone)
      ) {
        sameInput.value = "Não houver alteração, verifique!!";
        return;
      }
      sameInput.value = null;
      await updateData(data.value);
    };
    return {
      data,
      tab,
      cardStatus,
      edit,
      system,
      editBank,
      onSubmitData,
      sameInput,
      loading,
      deleteAction,
      idEdit,
    };
  },
  // Outras configurações do componente aqui
});
</script>

<style lang="sass" scoped>
.personal-setup-layout
  min-height: 90%
</style>
