<template>
  <div class="FirstStep">
    <span class="text-muted-register">
      Já tem uma conta?
      <b
        class="text-hover text-weight-bolder forgot text-white"
        @click="goLogin"
      >
        Entre aqui!
      </b>
    </span>
    <q-form
      @submit.prevent.stop="onSubmit"
      class="row justify-center text-white"
    >
      <div class="col-md-12 col-sm-12 self-center">
        <div class="column q-my-lg q-gutter-sm">
          <label-field labelInput="Nome Completo">
            <q-input
              v-bind="{ ...$inputStyle }"
              v-model="register.name"
              placeholder="Digite o nome conforme seu documento"
              :rules="nameRule"
              ref="nameRef"
              :loading="loading"
              :disable="loading"
            />
          </label-field>

          <label-field labelInput="CPF">
            <q-input
              v-model="register.person"
              v-bind="{ ...$inputStyle }"
              mask="###.###.###-##"
              placeholder="000.000.000-00"
              :rules="personRule"
              ref="personRef"
              :loading="loading"
              :disable="loading"
            />
          </label-field>
          <label-field labelInput="Data nascimento">
            <q-input
              v-bind="{ ...$inputStyle }"
              navigation-min-year-month="1990/07"
              ref="birthdayRef"
              v-model="register.birthday"
              :loading="loading"
              :disable="loading"
              type="date"
              :rules="requiredRole"
            />
          </label-field>
          <label-field labelInput="Email">
            <q-input
              v-model="register.email"
              v-bind="{ ...$inputStyle }"
              placeholder="Digite seu e-mail"
              type="email"
              ref="emailRef"
              :loading="loading"
              :disable="loading"
              :rules="emailRule"
            />
          </label-field>
          <label-field labelInput="Criar senha">
            <q-input
              v-model="register.password"
              placeholder="Digite sua senha"
              v-bind="{ ...$inputStyle }"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'Campo não atende os requisitos.']"
              :loading="loading"
              :disable="loading"
              ref="passwordRef"
            >
              <template v-slot:append>
                <q-icon
                  color="secondary"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </label-field>

          <div class="row">
            <itens-password
              v-for="(item, index) in fiedValidate"
              :text="item.name"
              :status="item.status"
              :key="index"
            />
          </div>
          <label-field labelInput="Confirmar senha">
            <q-input
              v-model="register.password_confirmation"
              placeholder="Confirme sua senha"
              v-bind="{ ...$inputStyle }"
              :type="isPwd ? 'password' : 'text'"
              :rules="passwordConfirmRule"
              ref="passwordConfirmRef"
              :loading="loading"
              :disable="loading"
            >
              <template v-slot:append>
                <q-icon
                  color="secondary"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </label-field>

          <label-field labelInput="Número de celular">
            <q-input
              v-model="register.phone"
              v-bind="{ ...$inputStyle }"
              :rules="phoneRole"
              mask="(##) # ####-####"
              ref="phoneRef"
              :loading="loading"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-select
                  v-model="countryNumber"
                  :options="options"
                  dark
                  borderless
                  dense
                  class="tentar-border"
                >
                  <template v-slot:selected>
                    <q-chip
                      size="md"
                      v-if="countryNumber"
                      :icon="countryNumber.icon"
                    >
                      <!-- class="q-my-none q-ml-xs q-mr-none" -->
                      {{ countryNumber.label }}
                    </q-chip>
                    <q-badge v-else>*none*</q-badge>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </template>
            </q-input>
          </label-field>
          <div class="row">
            <q-btn
              color="primary"
              text-color="white"
              label="Continuar"
              type="submit"
              :disabled="loading"
              :loading="loading"
              class="text-weight-bolder col-12 q-pa-md"
              no-caps
              style="border-radius: 8px"
            />
          </div>
        </div>
        <!-- <q-btn
          color="secondary"
          padding="0.5rem 3rem"
          label="continuar"
          type="submit"
          :disabled="loading"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner-pie size="3em" />
          </template>
        </q-btn> -->
      </div>
    </q-form>
    <q-inner-loading
      dark
      :showing="loading"
      label="Por favor, aguarde..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";
import useRoles from "src/composables/system/useRoles";
import useRefForm from "src/composables/system/Requests/useRefForm";
import useRegister from "src/composables/system/Requests/useRegister";
import useNotify from "src/composables/useNotify";
import ItensPassword from "src/system/components/auth/ItensPassword.vue";
import LabelField from "src/system/components/form/LabelField.vue";
export default defineComponent({
  name: "FirstStep",
  emits: ["step-current"],
  components: { ItensPassword, LabelField },
  setup(props, ctx) {
    const {
      nameRef,
      lastnameRef,
      emailRef,
      birthdayRef,
      personRef,
      phoneRef,
      telephoneRef,
      optionGenre,
      passwordConfirmRef,
      passwordRef,
      validateDataErrorMsg,
      validateDataInitial,
    } = useRefForm();
    const isPwd = ref(true);
    const {
      personRule,
      nameRule,
      emailRule,
      requiredRole,
      phoneRole,
      fiedValidate,
      notificationRules,
    } = useRoles();
    const passwordConfirmRule = [
      (value) => !!value || "Campo é obrigatorio",
      (value) =>
        value == register.value.password ||
        notificationRules("Senhas não conferem"),
    ];
    const userStore = useUserStore();
    const { register } = storeToRefs(userStore);
    const { infoNotify, errorNotify } = useNotify();
    const { validateCPF, statusPerson, loading } = useRegister();
    const verifyValue = computed(() => register.value.password);

    watch(verifyValue, (n, o) => {
      /\d/.test(n)
        ? (fiedValidate.value[3].status = true)
        : (fiedValidate.value[3].status = false);
      /[^\w\s]/.test(n)
        ? (fiedValidate.value[2].status = true)
        : (fiedValidate.value[2].status = false);
      /[A-Z]/.test(n)
        ? (fiedValidate.value[1].status = true)
        : (fiedValidate.value[1].status = false);
      /[a-z]/.test(n)
        ? (fiedValidate.value[0].status = true)
        : (fiedValidate.value[0].status = false);
      n.length > 8
        ? (fiedValidate.value[4].status = true)
        : (fiedValidate.value[4].status = false);
    });
    const countryNumber = ref({
      label: "+55",
      value: "goog",
      icon: "img:../../system/icons/country/brasil.png",
    });
    const options = [
      {
        label: "+55",
        value: "+55",
        icon: "img:../../system/icons/country/brasil.png",
      },
      {
        label: "+54",
        value: "+54",
        icon: "img:../../system/icons/country/argentina.png",
      },
      {
        label: "+351",
        value: "+351",
        icon: "img:../../system/icons/country/portugal.png",
      },
      {
        label: "+1",
        value: "+1",
        icon: "img:../../system/icons/country/united_states.png",
      },
      {
        label: "+1",
        value: "+1+",
        icon: "img:../../system/icons/country/new-zealand.png",
      },
    ];
    const router = useRouter();
    const goLogin = () => {
      router.replace({ name: "login" });
    };
    const onSubmit = async () => {
      console.log("OLA");
      validateDataInitial();
      console.log("OLA");
      if (validateDataErrorMsg()) {
        console.log("AMIDGO ESTOU AQUI");
        infoNotify("Esta esquecendo de preenche algum campo");
        return;
      }
      const rulesDetect = fiedValidate.value.filter((e) => e.status == false);
      passwordRef.value.validate();
      passwordConfirmRef.value.validate();
      if (rulesDetect.length > 0) {
        errorNotify("Campo Senha não atende a os requisitos minímos.", 30000);
        return;
      }
      try {
        await validateCPF(
          register.value.person,
          register.value.email,
          register.value.birthday
        );
      } catch (e) {
        console.log(e);
      } finally {
        if (statusPerson.value) ctx.emit("step-current", 2);
        console.log("Aqui os dados->", statusPerson.value);
      }
    };

    return {
      register,
      loading,
      isPwd,
      personRule,
      nameRef,
      lastnameRef,
      emailRef,
      birthdayRef,
      personRef,
      phoneRef,
      telephoneRef,
      optionGenre,
      onSubmit,
      nameRule,
      emailRule,
      requiredRole,
      phoneRole,
      passwordConfirmRule,
      passwordConfirmRef,
      passwordRef,
      verifyValue,
      fiedValidate,
      options,
      countryNumber,
      goLogin,
    };
  },
});
</script>
<style lang="sass">
.q-chip
  vertical-align: middle
  outline: 0
  position: relative
  max-width: 100%
  margin: 4px
  background: transparent
  color: #fff
  font-size: 1rem
  padding: 0.5em 0.9em
.tentar-border> .q-field__inner .q-field__control:before
  border: none !important
  // border: solid 3px #042
.tentar-border> .q-field__inner .q-field__control:before
  border: none !important
.tentar-border > .q-field--dark .q-field__marginal
  color: none
.tentar-border> .q-field--focused .q-field--highlighted
  border: none !important

// q-field row no-wrap items-start q-field--borderless q-select q-field--auto-height q-select--without-input q-select--without-chips q-select--single q-field--float q-field--dense q-field--dark tentar-border
</style>
