<template>
  <div class="TablecalendarLayout">
    <!-- Seu conteúdo HTML aqui -->
    <table-personal :rows="tableRow" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TablePersonal from "../components/TablePersonal.vue";
export default defineComponent({
  name: "TablecalendarLayout",
  components: { TablePersonal },
  props: { tableRow: { type: Array } },
  setup() {
    return {};
  },
  // Outras configurações do componente aqui
});
</script>

<style scoped>
/* Estilos específicos do componente aqui */
</style>
