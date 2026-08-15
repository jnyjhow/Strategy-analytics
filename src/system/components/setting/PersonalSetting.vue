<template>
  <div class="personal-setting">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <div class="row">
      <div class="col-12">
        <p class="text-weight-bold">Dados Básicos e Documentos</p>
      </div>
      <div
        class="col-3 text-align q-mt-md"
        v-for="(item, index) in dadosBasicos"
        :key="index"
      >
        <p class="text-grey">{{ item.title }}</p>
        <p>{{ item.value }}</p>
      </div>
      <q-separator class="col-12 q-my-sm" size="1px" />
      <div class="col-12">
        <p class="text-weight-bold">Localização</p>
      </div>
      <div
        class="col-3 text-align q-mt-md"
        v-for="(item, index) in localization"
        :key="index"
      >
        <p class="text-grey">{{ item.title }}</p>
        <p>{{ item.value }}</p>
      </div>
      <q-separator class="col-12 q-my-sm" size="1px" />
      <div class="col-12">
        <p class="text-weight-bold">Atividade Trabalhista</p>
      </div>
      <div
        class="col-3 text-align q-mt-md"
        v-for="(item, index) in job"
        :key="index"
      >
        <p class="text-grey">{{ item.title }}</p>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import useCase from "src/composables/system/useCase";
import useAccount from "src/composables/system/Requests/useAccount";
import { date } from "quasar";
export default defineComponent({
  name: "PersonalSetting",
  setup() {
    const sameInput = ref();
    const store = useUserStore();
    const { data, isDirty, isDirtyData } = storeToRefs(store);
    const { updateData, loading } = useAccount();
    const { same } = useCase();
    const birthday = computed(() => {
      return data.value.account.birthday ?? new Date(now());
    });
    let dateCurrent = new Date(birthday + " 00:00:00");
    let brDate = date.formatDate(dateCurrent, "DD/MM/YYYY");

    const dadosBasicos = computed(() => {
      return [
        { title: "Nome Completo", value: data.value.name },
        { title: "Gênero", value: data.value.gender ?? "Masculino" },
        {
          title: "Estado Civil",
          value: data.value.maritalStatus ?? "Solteiro",
        },
        {
          title: "Nacionalidade",
          value: data.value.nationality ?? "Brasileira",
        },
        {
          title: "Naturalidade (Cidade, UF)",
          value: data.value.naturalidade ?? "São Paulo, SP",
        },
        {
          title: "Data de Nascimento",
          value: brDate,
        },
        { title: "CPF", value: data.value.account.person ?? "000.000.000-00" },
        { title: "RG", value: data.value.account.rg ?? "00.000.000-00" },
      ];
    });
    // const dadosBasicos = [
    //   { title: "Nome Completo", value: data.value.name },
    //   { title: "Gênero", value: data.value.gender ?? "Masculino" },
    //   { title: "Estado Civil", value: data.value.maritalStatus ?? "Solteiro" },
    //   { title: "Nacionalidade", value: data.value.nationality ?? "Brasileira" },
    //   {
    //     title: "Naturalidade (Cidade, UF)",
    //     value: data.value.naturalidade ?? "São Paulo, SP",
    //   },
    //   {
    //     title: "Data de Nascimento",
    //     value: brDate,
    //   },
    //   { title: "CPF", value: data.value.account.person ?? "000.000.000-00" },
    //   { title: "RG", value: data.value.account.rg ?? "00.000.000-00" },
    // ];

    const localization = [
      {
        title: "Localização Atual",
        value: data.value.account.language ?? "Jacareí, SP",
      },
      { title: "Cep", value: data.value.account.address_zip_code ?? "" },
      { title: "Logradouro", value: data.value.account.address_city ?? "" },
    ];

    const job = [
      { title: "Atividade Trabalhista", value: "Empresário" },
      { title: "Renda Mensal Aproximada", value: "R$ 25.000,00" },
      { title: "Valor Aproximado Dos Seus Bens", value: "R$ 2.544.800,00" },
    ];

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
      sameInput,
      onSubmitData,
      loading,
      dadosBasicos,
      localization,
      job,
    };
  },
});
</script>
<style lang="sass"></style>
