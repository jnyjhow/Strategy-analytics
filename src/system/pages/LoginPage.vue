<template>
  <q-layout class="bg-simulator">
    <q-page-container class="column justify-center" style="min-height: 96vh">
      <login-layout
        v-if="stateLogin == 'login'"
        @status-login="stateLogin = $event"
      />
      <validatetoken-layout
        v-else-if="stateLogin == 'validateToken'"
        @status-login="stateLogin = $event"
      />
      <forgotpassword-layout
        v-else-if="stateLogin == 'ForgotPassword'"
        @status-login="stateLogin = $event"
      />
      <resetpassword-layout
        v-else-if="stateLogin == 'resetPassword'"
        @status-login="stateLogin = $event"
      />
    </q-page-container>
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <footer-system class="text-blue-grey-9" />
  </q-layout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LoginLayout from "../layouts/auth/LoginLayout.vue";
import ValidatetokenLayout from "../layouts/auth/ValidatetokenLayout.vue";
import ForgotpasswordLayout from "../layouts/auth/ForgotpasswordLayout.vue";
import ResetpasswordLayout from "../layouts/auth/ResetpasswordLayout.vue";
import useAuth from "../../composables/system/useAuth";
import FooterSystem from "../components/FooterSystem.vue";

const route = useRoute();
const stateLogin = ref("login");
const { loading } = useAuth();
onMounted(() => {
  if (route.query.token) {
    stateLogin.value = "validateToken";
  }
  if (route.query.tokenRemenber) {
    stateLogin.value = "resetPassword";
  }
});
</script>
<style lang="sass">
.q-field--outlined .q-field__control:before
  border-bottom: solid 1px #fff !important

.q-field--outlined .q-field__control
  border-radius: 8px
</style>
