<template>
  <div class="documentation-setting-layout">
    <q-banner v-if="guardBlocked" rounded class="bg-blue-9 text-white q-mb-md">
      Para liberar o envio de documentos, conclua primeiro a etapa inicial de depósito.
      <template #action><q-btn flat color="white" label="Abrir depósito" :to="{ name: 'inicio', query: { modal: 'deposit' } }" /><q-btn flat color="white" label="Verificar novamente" @click="load" /></template>
    </q-banner>
    <q-banner v-else-if="error" rounded class="bg-red-9 text-white q-mb-md">
      {{ error }}
      <template #action><q-btn flat color="white" label="Tentar novamente" @click="load" /></template>
    </q-banner>

    <div v-if="loading" class="tool row justify-center q-pa-xl"><q-spinner color="primary" size="36px" /></div>
    <template v-else-if="!error && !guardBlocked">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6"><q-card class="tool full-height"><q-card-section><div class="text-subtitle1 text-weight-bold">Visão documental</div><div class="text-caption text-grey-5 q-mb-md">Situação atual dos documentos enviados.</div><div class="text-h4 text-primary">{{ overviewValue }}</div><div class="text-caption">documentos cadastrados</div></q-card-section></q-card></div>
        <div class="col-12 col-md-6"><q-card class="tool full-height"><q-card-section><div class="text-subtitle1 text-weight-bold">Progresso</div><div class="text-caption text-grey-5 q-mb-md">Evolução do seu cadastro documental.</div><q-linear-progress rounded size="12px" color="primary" :value="progressValue / 100" /><div class="q-mt-sm">{{ progressValue }}% concluído</div></q-card-section></q-card></div>
      </div>

      <q-card class="tool">
        <q-card-section class="row items-center justify-between"><div><div class="text-subtitle1 text-weight-bold">Meus documentos</div><div class="text-caption text-grey-5">PDF, JPEG ou PNG, com até 25 MB.</div></div><q-btn flat color="primary" icon="upload_file" label="Enviar documento" no-caps @click="openUpload" /></q-card-section>
        <q-separator dark />
        <q-card-section v-if="!documents.length" class="empty-state q-pa-xl text-center text-grey-5"><q-icon name="description" size="36px" /><div class="q-mt-sm">Nenhum documento enviado.</div></q-card-section>
        <q-list v-else separator>
          <q-item v-for="document in documents" :key="document.id">
            <q-item-section avatar><q-avatar color="primary" text-color="white" icon="description" /></q-item-section>
            <q-item-section><q-item-label>{{ documentName(document) }}</q-item-label><q-item-label caption>{{ document.fileName || document.originalFileName || 'Arquivo protegido' }}</q-item-label><q-item-label v-if="document.rejectionReason" caption class="text-negative">{{ document.rejectionReason }}</q-item-label></q-item-section>
            <q-item-section side><div class="row items-center q-gutter-xs"><q-badge outline :color="statusColor(document.status)" :label="statusLabel(document.status)" /><q-btn flat round dense icon="download" color="primary" aria-label="Baixar documento" @click="download(document)" /><q-btn flat round dense icon="link" color="primary" aria-label="Gerar link temporário" @click="temporaryUrl(document)" /><q-btn v-if="isRejected(document.status)" flat round dense icon="published_with_changes" color="warning" aria-label="Substituir documento" @click="openReplace(document)" /></div></q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>

    <q-dialog v-model="dialog" persistent><q-card class="tool form-card"><q-card-section class="row items-center justify-between"><div class="text-subtitle1 text-weight-bold">{{ replacing ? 'Substituir documento' : 'Enviar documento' }}</div><q-btn flat round dense icon="close" :disable="saving" @click="closeDialog" /></q-card-section><q-separator dark /><q-form ref="formRef" @submit.prevent="save"><q-card-section><div class="row q-col-gutter-md">
      <label-form v-if="!replacing" class-name="col-12" text-label="Tipo de documento"><q-select v-model="form.documentTypeId" :options="typeOptions" emit-value map-options outlined dense dark :rules="requiredRules" @update:model-value="typeChanged" /></label-form>
      <label-form v-if="!replacing && countryOptions.length" class-name="col-12" text-label="País"><q-select v-model="form.countryId" :options="countryOptions" emit-value map-options outlined dense dark @update:model-value="loadDefinition" /></label-form>
      <div v-if="definitionHint" class="col-12 text-caption text-grey-5">{{ definitionHint }}</div>
      <label-form class-name="col-12" text-label="Arquivo"><q-file v-model="form.file" outlined dense dark accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" max-file-size="26214400" :rules="fileRules" @rejected="fileRejected"><template #prepend><q-icon name="attach_file" /></template></q-file></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Data de emissão"><q-input v-model="form.issuedOn" type="date" outlined dense dark /></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Data de validade"><q-input v-model="form.expiresOn" type="date" outlined dense dark /></label-form>
    </div></q-card-section><q-card-actions align="right"><q-btn flat label="Cancelar" no-caps :disable="saving" @click="closeDialog" /><q-btn type="submit" flat color="primary" icon="upload" label="Enviar" no-caps :loading="saving" /></q-card-actions></q-form></q-card></q-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import LabelForm from 'src/system/components/form/LabelForm.vue'
import useNotify from 'src/composables/useNotify'
import { getApiErrorMessage } from 'src/services/clientAuthService'
import { downloadClientDocument, getClientDocumentDataDefinition, getClientDocumentOverview, getClientDocumentProgress, getClientDocumentTemporaryUrl, listClientDocuments, listClientDocumentTypes, replaceClientDocument, uploadClientDocument } from 'src/services/clientProfileService'

const { successNotify, errorNotify } = useNotify()
const loading=ref(true),saving=ref(false),error=ref(''),guardBlocked=ref(false),dialog=ref(false),replacing=ref(null),formRef=ref(null),documents=ref([]),types=ref([]),overview=ref({}),progress=ref({}),definition=ref(null)
const blank=()=>({documentTypeId:null,countryId:null,file:null,issuedOn:'',expiresOn:''}),form=reactive(blank())
const collection=v=>Array.isArray(v)?v:v?.items||v?.data||[]
const overviewValue=computed(()=>overview.value.totalDocuments??overview.value.total??documents.value.length)
const progressValue=computed(()=>Math.max(0,Math.min(100,Number(progress.value.percentage??progress.value.progressPercentage??progress.value.progress??0))))
const typeOptions=computed(()=>types.value.map(t=>({label:t.name||t.displayName||t.code||'Documento',value:t.id,source:t})))
const selectedType=computed(()=>typeOptions.value.find(t=>t.value===form.documentTypeId)?.source)
const countryOptions=computed(()=>collection(selectedType.value?.countries||selectedType.value?.supportedCountries).map(c=>({label:c.name||c.displayName||c.code,value:c.id||c.countryId})))
const definitionHint=computed(()=>definition.value?.description||definition.value?.instructions||selectedType.value?.description||'')
const requiredRules=[v=>Boolean(v)||'Campo obrigatório']
const fileRules=[v=>Boolean(v)||'Selecione um arquivo',v=>!v||['application/pdf','image/jpeg','image/png'].includes(v.type)||'Use PDF, JPEG ou PNG',v=>!v||v.size<=26214400||'O arquivo deve ter no máximo 25 MB']
const documentName=d=>d.documentTypeName||d.typeName||d.name||'Documento'
const statusLabel=s=>({Pending:'Pendente',UnderReview:'Em análise',Approved:'Aprovado',Rejected:'Rejeitado'}[s]||s||'Enviado')
const statusColor=s=>({Approved:'positive',Rejected:'negative',UnderReview:'warning',Pending:'grey'}[s]||'grey')
const isRejected=s=>String(s).toLowerCase()==='rejected'
const load=async()=>{loading.value=true;error.value='';guardBlocked.value=false;try{const [o,p,d,t]=await Promise.all([getClientDocumentOverview(),getClientDocumentProgress(),listClientDocuments({page:1,pageSize:100}),listClientDocumentTypes()]);overview.value=o||{};progress.value=p||{};documents.value=collection(d);types.value=collection(t)}catch(e){const message=getApiErrorMessage(e,'Não foi possível carregar seus documentos.');if(message.toLowerCase().includes('onboarding requirements'))guardBlocked.value=true;else error.value=message}finally{loading.value=false}}
const closeDialog=()=>{Object.assign(form,blank());replacing.value=null;definition.value=null;dialog.value=false;formRef.value?.resetValidation()}
const openUpload=()=>{closeDialog();dialog.value=true}
const openReplace=d=>{closeDialog();replacing.value=d;dialog.value=true}
const typeChanged=()=>{form.countryId=null;definition.value=null;if(countryOptions.value.length===1){form.countryId=countryOptions.value[0].value;loadDefinition()}}
const loadDefinition=async()=>{if(!form.documentTypeId||!form.countryId)return;try{definition.value=await getClientDocumentDataDefinition(form.documentTypeId,form.countryId)}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível carregar as orientações deste documento.'))}}
const fileRejected=()=>errorNotify('Use um arquivo PDF, JPEG ou PNG com até 25 MB.')
const save=async()=>{if(!await formRef.value.validate())return;saving.value=true;try{const data=new FormData();data.append('file',form.file);if(form.issuedOn)data.append('issuedOn',form.issuedOn);if(form.expiresOn)data.append('expiresOn',form.expiresOn);if(replacing.value)await replaceClientDocument(replacing.value.id,data);else{data.append('documentTypeId',form.documentTypeId);if(form.countryId)data.append('countryId',form.countryId);await uploadClientDocument(data)}successNotify(replacing.value?'Documento substituído.':'Documento enviado.');closeDialog();await load()}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível enviar o documento.'))}finally{saving.value=false}}
const download=async d=>{try{const response=await downloadClientDocument(d.id),url=URL.createObjectURL(response.data),a=document.createElement('a');a.href=url;a.download=d.fileName||d.originalFileName||'documento';a.click();URL.revokeObjectURL(url)}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível baixar o documento.'))}}
const temporaryUrl=async d=>{try{const result=await getClientDocumentTemporaryUrl(d.id),url=result.url||result.temporaryUrl;if(!url)throw new Error('URL ausente');window.open(url,'_blank','noopener');successNotify('Link temporário aberto em uma nova aba.')}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível gerar o link temporário.'))}}
load()
</script>

<style scoped>.documentation-setting-layout{max-width:1180px;margin:0 auto}.form-card{width:min(720px,calc(100vw - 32px))}.empty-state{border:1px dashed rgba(255,255,255,.2);border-radius:8px}</style>
