<template>
  <div class="AvatarMenu row items-center no-wrap">
    <!-- <q-item clickable v-ripple :to="{ name: 'config' }"> -->
    <q-btn round :to="{ name: 'config' }" size="16px" unelevated>
      <q-avatar class="q-my-sm avatar-custom">
        <img :src="avatar" />
      </q-avatar>
    </q-btn>
    <q-btn
      round
      flat
      dense
      size="14px"
      color="white"
      icon="fa-solid fa-right-from-bracket"
      class="q-ml-sm"
      :loading="loading"
      @click.prevent="setLogout"
    >
      <q-tooltip>Sair</q-tooltip>
    </q-btn>
    <!-- </q-item> -->
    <!-- <q-menu
      fit
      anchor="bottom left"
      self="top middle"
      transition-show="scale"
      transition-hide="scale"
      class="tool text-weight-bold"
    >
      <q-item clickable v-ripple :to="{ name: 'config' }">
        <q-item-section class="text-white">Configurações</q-item-section>
        <q-item-section avatar>
          <q-icon color="white" name="fa-solid fa-gear" />
        </q-item-section>
      </q-item>
      <q-item clickable @click.prevent="setLogout">
        <q-item-section>Logout</q-item-section>
        <q-item-section avatar>
          <q-icon color="red" name="fa-solid fa-right-from-bracket" />
        </q-item-section>
      </q-item>
    </q-menu> -->
  </div>
</template>
<script>
import { defineComponent } from "vue";
import useAuth from "src/composables/system/useAuth";

export default defineComponent({
  name: "AvatarMenu",
  props: {
    avatar: { type: String },
  },
  setup() {
    const { setLogout, loading } = useAuth();

    return {
      setLogout,
      loading,
    };
  },
});
</script>
<style lang="sass">
.avatar-custom>.q-avatar__content>img
  border: 2px solid #ddd
</style>
