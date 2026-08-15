<template>
  <q-card class="tool timeline-card">
    <q-card-section class="row items-end q-col-gutter-md">
      <div class="col"><div class="text-subtitle1 text-weight-bold">Minha timeline</div><div class="text-caption text-grey-5">Histórico de eventos disponibilizados para sua conta.</div></div>
      <q-select v-model="eventType" :options="eventTypeOptions" emit-value map-options dark dense outlined clearable label="Tipo de evento" class="col-12 col-sm-3" />
      <q-select v-model="entityType" :options="entityTypeOptions" emit-value map-options dark dense outlined clearable label="Entidade" class="col-12 col-sm-3" />
      <div class="col-auto"><q-btn flat dense color="primary" icon="search" label="Filtrar" no-caps @click="applyFilters" /></div>
    </q-card-section>
    <q-separator dark />
    <q-card-section>
      <q-banner v-if="error" rounded class="bg-red-9 text-white q-mb-md">{{ error }}<template #action><q-btn flat color="white" label="Tentar novamente" @click="load" /></template></q-banner>
      <div v-if="loading" class="row justify-center q-pa-xl"><q-spinner color="primary" size="38px" /></div>
      <template v-else>
        <q-list v-if="events.length" dark bordered separator><q-item v-for="event in events" :key="event.id || `${typeOf(event)}-${dateOf(event)}`"><q-item-section avatar><q-icon name="history" color="primary" /></q-item-section><q-item-section><q-item-label>{{ event.title || event.description || typeOf(event) }}</q-item-label><q-item-label caption class="text-grey-5">{{ event.entityType || event.entityName || 'Conta' }} · {{ formatDate(dateOf(event)) }}</q-item-label></q-item-section></q-item></q-list>
        <div v-else class="text-grey-5 text-center q-pa-xl">Nenhum evento disponível.</div>
        <div class="row items-center justify-between q-mt-md"><span class="text-caption text-grey-5">{{ firstItem }}–{{ lastItem }} de {{ totalItems }}</span><q-pagination v-if="totalPages > 1" v-model="page" :max="totalPages" color="primary" direction-links @update:model-value="load" /></div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { getApiErrorMessage } from "src/services/clientAuthService";
import { getClientTimeline } from "src/services/clientProfileService";
const loading = ref(true), error = ref(""), response = ref({}), events = ref([]), page = ref(1), pageSize = ref(10), eventType = ref(""), entityType = ref("");
const collection = (value) => Array.isArray(value) ? value : value?.events || value?.timeline || value?.items || value?.data || [];
const totalItems = computed(() => Number(response.value?.totalItems ?? response.value?.totalCount ?? events.value.length));
const uniqueOptions = (values) => [...new Set(values.filter(Boolean))].map((value) => ({ label: value, value }));
const eventTypeOptions = computed(() => uniqueOptions(events.value.map(typeOf))), entityTypeOptions = computed(() => uniqueOptions(events.value.map((event) => event.entityType || event.entityName)));
const totalPages = computed(() => Math.max(1, Number(response.value?.totalPages ?? Math.ceil(totalItems.value / pageSize.value))));
const firstItem = computed(() => totalItems.value ? (page.value - 1) * pageSize.value + 1 : 0), lastItem = computed(() => Math.min(page.value * pageSize.value, totalItems.value));
const typeOf = (event) => event.eventType || event.type || event.action || "Evento", dateOf = (event) => event.occurredAtUtc || event.createdAtUtc || event.timestampUtc || event.date;
const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Data não informada";
const load = async () => { loading.value = true; error.value = ""; try { response.value = await getClientTimeline({ page: page.value, pageSize: pageSize.value, eventType: eventType.value || undefined, entityType: entityType.value || undefined }); events.value = collection(response.value); } catch (err) { error.value = getApiErrorMessage(err, "Não foi possível carregar sua timeline."); } finally { loading.value = false; } };
const applyFilters = () => { page.value = 1; load(); };
load();
</script>
<style scoped>.timeline-card { max-width: 1180px; margin: 0 auto; }</style>
