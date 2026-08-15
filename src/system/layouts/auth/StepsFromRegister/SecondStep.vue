<template>
  <div class="SecondStep">
    <span class="text-muted-register forgot">
      Por que pedimos essas informações?
      <!-- <b
        class="text-hover text-weight-bolder forgot text-white"
        @click="goLogin"
      >
        Entre aqui!
      </b> -->
    </span>
    <q-form
      @submit.prevent.stop="onSubmit"
      class="row justify-center text-white"
    >
      <div class="col-md-12 col-sm-12 self-center">
        <div class="column q-my-lg q-gutter-sm">
          <label-field labelInput="CEP" colInput="col-10 col-md-12">
            <q-input
              ref="zipcodeRef"
              placeholder="00000-000"
              v-model="register.address_zip_code"
              mask="#####-###"
              :loading="loading"
              :disable="loading"
              @blur="searchCep"
              v-bind="{ ...$inputStyle }"
              :rules="zipCodeRule"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Endereço">
            <q-input
              ref="streetRef"
              placeholder="Rua"
              v-model="register.address_street"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
              :rules="requiredRole"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Bairro">
            <q-input
              ref="districtRef"
              v-model="register.address_district"
              placeholder="Digite o bairro do endereço"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
              :rules="requiredRole"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Número">
            <q-input
              ref="numberstreetRef"
              v-model="register.address_numbers"
              placeholder="Digite o número do endereço"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
              :rules="requiredRole"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Cidade">
            <q-input
              ref="cityRef"
              v-model="register.address_city"
              placeholder="Digite a cidade"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
              :rules="requiredRole"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Estado">
            <q-input
              ref="statestreetRef"
              v-model="register.address_state"
              placeholder="Digite o estado"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
              :rules="requiredRole"
            />
          </label-field>
          <label-field colInput="col-10 col-md-12" labelInput="Complemento">
            <q-input
              ref="statestreetRef"
              v-model="register.address_complement"
              placeholder="Ex: Apt. 112 Bl. A"
              :loading="loading"
              :disable="loading"
              v-bind="{ ...$inputStyle }"
            />
          </label-field>
          <div class="">
            <q-checkbox
              v-model="register.notifications"
              color="primary"
              label="Você concorda com os termos e condições?"
              true-value="accepted"
              false-value="refused"
            />
          </div>
          <!-- <div class="q-my-md text-muted-register">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
            nihil et quia fuga dolorum tenetur sed possimus reiciendis, at
            similique dolore .
          </div> -->
          <div class="row">
            <q-btn
              color="primary"
              padding="14.9px 179.23px 15.5px 179.22px"
              text-color="white"
              label="Continuar"
              type="submit"
              :disabled="loading"
              :loading="loading"
              class="text-weight-bolder col-8 col-md-12 q-pa-md"
              no-caps
              style="border-radius: 8px"
            />
          </div>
        </div>
      </div>
    </q-form>
    <q-dialog
      v-model="dialogWelcome"
      backdrop-filter="blur(10px) saturate(250%)"
      class="row justify-center"
    >
      <welcome-msg class="col-12 self-center" />
    </q-dialog>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";
import useRegister from "src/composables/system/Requests/useRegister";
import useRefForm from "src/composables/system/Requests/useRefForm";
import useRoles from "src/composables/system/useRoles";
import useNotify from "src/composables/useNotify";

import WelcomeMsg from "./WelcomeMsg.vue";
import LabelField from "src/system/components/form/LabelField.vue";
export default defineComponent({
  name: "SecondStep",
  emits: ["step-current"],
  components: { WelcomeMsg, LabelField },
  setup(props, ctx) {
    const { viaCEP, loading, registration, registrationStatus } = useRegister();
    const userStore = useUserStore();
    const { register } = storeToRefs(userStore);
    const { infoNotify, successNotify } = useNotify();
    const {
      zipcodeRef,
      streetRef,
      districtRef,
      statestreetRef,
      cityRef,
      numberstreetRef,
      validateRegisterAddress,
      validateDataAddresMsg,
    } = useRefForm();
    const { zipCodeRule, stringSerialize, requiredRole } = useRoles();
    const searchCep = async () => {
      zipcodeRef.value.validate();
      let cepSerialize = "";
      if (register.value.address_zip_code) {
        cepSerialize = stringSerialize(register.value.address_zip_code);
      }
      if (!zipcodeRef.value.hasError) {
        const res = await viaCEP(cepSerialize);
        register.value.address_street = res.logradouro;
        register.value.address_state = res.uf;
        register.value.address_city = res.localidade;
        register.value.address_district = res.bairro;
        // console.log(res);
      }
      // await viaCEP(register.value.address_zip_code)
    };

    const dialogWelcome = ref(false);
    const router = useRouter();
    const onSubmit = async () => {
      validateRegisterAddress();
      if (validateDataAddresMsg()) {
        infoNotify("Ops.. está esquecendo de preenche algum campo");
        return;
      }
      if (!register.value.address_numbers) {
        numberstreetRef.hasError = true;
        return;
      }
      try {
        await registration(register.value);
      } catch (e) {
        console.log(e);
      }
      // console.log(register.value);

      // ctx.emit("step-current", 3);
    };
    return {
      register,
      searchCep,
      loading,
      zipcodeRef,
      streetRef,
      districtRef,
      statestreetRef,
      cityRef,
      numberstreetRef,
      zipCodeRule,
      onSubmit,
      infoNotify,
      requiredRole,
      dialogWelcome,
    };
  },
});
</script>
<style></style>
