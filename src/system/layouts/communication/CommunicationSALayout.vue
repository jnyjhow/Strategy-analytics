<template>
  <div class="communication-s-a-layout">
    <div class="row q-mb-lg">
      <div class="col-12">
        <title-page
          :breadcrumbs="[
            { label: 'Comunicação' },
            { label: comunicationData.metadados.subtitle },
          ]"
          :title="comunicationData.titulo_comunicado"
        />
        <div class="q-ml-lg">
          <q-chip color="styleTool q-mx-sm" text-color="white">
            <q-avatar size="sm" flat color="white" class="text-dark">
              {{ comunicationData.metadados.fonte.charAt(0) }}
            </q-avatar>
            <span>{{ comunicationData.metadados.fonte }}</span>
            <!-- <div class="ellipsis"> -->
            <q-tooltip>{{ comunicationData.metadados.fonte }}</q-tooltip>
            <!-- </div> -->
          </q-chip>
          <span class="text-grey">
            {{ comunicationData.metadados.data_hora }}
          </span>
        </div>
      </div>
    </div>
    <div class="row q-gutter-md q-pl-lg">
      <div class="col-2 col-sm col-md-2">
        <author-description
          :name="comunicationData.author.nome"
          :photo="comunicationData.author.avatar"
          :duties="comunicationData.author.cargo"
          :total_of_publication="comunicationData.author.publicacoes"
          :position="comunicationData.author.atribuicao"
          :visions="comunicationData.visions"
        />
      </div>
      <div class="col">
        <div
          class="q-px-xl"
          v-for="(item, index) in comunicationData.conteudo"
          :key="index"
        >
          <p class="text-h6">{{ item.heading }}</p>
          <p
            class="text-grey"
            v-for="(paragrafo, index) in item.paragrafos"
            :key="index"
          >
            {{ paragrafo }}
          </p>
        </div>
      </div>
      <div class="col-3 q-pa-lg">
        <lateral-description
          :created_at="comunicationData.barra_lateral.publicacao"
          :code="comunicationData.barra_lateral.codigo"
          :version="comunicationData.barra_lateral.versao"
          :simple
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import TitlePage from "src/system/components/TitlePage.vue";
import AuthorDescription from "src/system/components/Communication/AuthorDescription.vue";
import LateralDescription from "src/system/components/Communication/LateralDescription.vue";
defineComponent({
  name: "CommunicationSALayout",
});
const props = defineProps({
  comunicationData: {
    type: Object,
    required: true,
  },
});
const simple = props.comunicationData.conteudo.map((item) => ({
  label: item.heading,
}));
</script>

<style scoped>
/* Seus estilos aqui */
</style>
