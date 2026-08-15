<template>
  <div class="bank-accounts-layout">
    <q-card class="tool">
      <q-card-section class="row items-center justify-between">
        <div><div class="text-subtitle1 text-weight-bold">Contas bancárias</div><div class="text-caption text-grey-5">Seus dados bancários são sempre exibidos de forma mascarada.</div></div>
        <q-btn flat dense color="primary" icon="add" label="Adicionar" no-caps :disable="loading" @click="openCreate" />
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-banner v-if="error" rounded class="bg-red-9 text-white q-mb-md">{{ error }}<template #action><q-btn flat color="white" label="Tentar novamente" @click="load" /></template></q-banner>
        <div v-if="loading" class="row justify-center q-pa-xl"><q-spinner color="primary" size="36px" /></div>
        <div v-else-if="!error && !accounts.length" class="empty-state q-pa-xl text-center text-grey-5"><q-icon name="account_balance" size="36px" /><div class="q-mt-sm">Nenhuma conta bancária cadastrada.</div></div>
        <q-list v-else-if="!error" separator>
          <q-item v-for="account in accounts" :key="account.id">
            <q-item-section avatar><q-avatar color="primary" text-color="white" icon="account_balance" /></q-item-section>
            <q-item-section><q-item-label>{{ bankName(account.bankId) }}</q-item-label><q-item-label caption>Ag. {{ account.branch || '—' }} · Conta {{ account.accountNumberMasked || 'mascarada' }}</q-item-label><q-item-label caption v-if="account.pixKeyMasked">Pix {{ account.pixKeyMasked }}</q-item-label></q-item-section>
            <q-item-section side><div class="row items-center q-gutter-xs"><q-badge v-if="account.isPrimary" outline color="primary" label="Principal" /><q-btn flat round dense icon="edit" color="primary" aria-label="Editar conta" @click="openEdit(account)" /><q-btn v-if="!account.isPrimary" flat round dense icon="star_outline" color="primary" aria-label="Definir como principal" @click="makePrimary(account)" /><q-btn flat round dense icon="archive" color="negative" aria-label="Arquivar conta" @click="askArchive(account)" /></div></q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="formDialog" persistent><q-card class="tool form-card"><q-card-section class="row items-center justify-between"><div class="text-subtitle1 text-weight-bold">{{ editingId ? 'Editar conta' : 'Nova conta' }}</div><q-btn flat round dense icon="close" :disable="saving" @click="closeForm" /></q-card-section><q-separator dark /><q-form ref="formRef" @submit.prevent="save"><q-card-section><div class="row q-col-gutter-md">
      <label-form class-name="col-12" text-label="Banco"><q-select v-model="form.bankId" :options="bankOptions" emit-value map-options outlined dense dark :rules="requiredRules" /></label-form>
      <label-form class-name="col-12 col-md-4" text-label="Agência"><q-input v-model.trim="form.branch" outlined dense dark :rules="requiredRules" /></label-form>
      <label-form class-name="col-8 col-md-6" text-label="Conta"><q-input v-model.trim="form.accountNumber" outlined dense dark :placeholder="editingId ? `Atual: ${masks.account}` : ''" :hint="editingId ? 'Redigite o número integral para confirmar a alteração.' : ''" :rules="requiredRules" /></label-form>
      <label-form class-name="col-4 col-md-2" text-label="Dígito"><q-input v-model.trim="form.accountDigit" outlined dense dark /></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Tipo de conta"><q-select v-model="form.accountType" :options="accountTypes" emit-value map-options outlined dense dark :rules="requiredRules" /></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Tipo de titular"><q-select v-model="form.holderType" :options="holderTypes" emit-value map-options outlined dense dark :rules="requiredRules" /></label-form>
      <label-form class-name="col-12" text-label="Nome do titular"><q-input v-model.trim="form.holderName" outlined dense dark :rules="requiredRules" /></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Documento do titular"><q-input v-model.trim="form.holderDocument" outlined dense dark :placeholder="editingId ? `Atual: ${masks.document}` : ''" :rules="requiredRules" /></label-form>
      <label-form class-name="col-12 col-md-6" text-label="Tipo de chave Pix"><q-select v-model="form.pixKeyType" :options="pixTypes" emit-value map-options clearable outlined dense dark /></label-form>
      <label-form class-name="col-12" text-label="Chave Pix"><q-input v-model.trim="form.pixKey" outlined dense dark :placeholder="editingId ? `Atual: ${masks.pix}` : ''" /></label-form>
      <div class="col-12"><q-checkbox v-model="form.isPrimary" label="Definir como principal" color="primary" /></div>
    </div></q-card-section><q-card-actions align="right"><q-btn flat label="Cancelar" no-caps :disable="saving" @click="closeForm" /><q-btn type="submit" flat color="primary" icon="save" label="Salvar" no-caps :loading="saving" /></q-card-actions></q-form></q-card></q-dialog>
    <q-dialog v-model="archiveDialog" persistent><q-card class="tool confirm-card"><q-card-section><div class="text-subtitle1 text-weight-bold">Arquivar conta</div><div class="q-mt-sm">A conta deixará de ficar disponível para uso. Deseja continuar?</div></q-card-section><q-card-actions align="right"><q-btn flat label="Cancelar" no-caps @click="archiveDialog=false" /><q-btn flat color="negative" label="Arquivar" no-caps :loading="saving" @click="confirmArchive" /></q-card-actions></q-card></q-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import LabelForm from 'src/system/components/form/LabelForm.vue'
import useNotify from 'src/composables/useNotify'
import { getApiErrorMessage } from 'src/services/clientAuthService'
import { archiveClientBankAccount, createClientBankAccount, getClientBankAccount, listClientBankAccounts, listClientBanks, setPrimaryClientBankAccount, updateClientBankAccount } from 'src/services/clientProfileService'

const { successNotify, errorNotify } = useNotify()
const accounts=ref([]), banks=ref([]), loading=ref(true), saving=ref(false), error=ref(''), formDialog=ref(false), archiveDialog=ref(false), editingId=ref(null), archiveTarget=ref(null), formRef=ref(null)
const empty=()=>({bankId:null,branch:'',accountNumber:'',accountDigit:null,accountType:'Checking',holderType:'Individual',holderName:'',holderDocument:'',pixKey:null,pixKeyType:null,isPrimary:false})
const form=reactive(empty()), masks=reactive({account:'',document:'',pix:''})
const accountTypes=[{label:'Conta corrente',value:'Checking'},{label:'Conta poupança',value:'Savings'},{label:'Conta de pagamento',value:'Payment'}], holderTypes=[{label:'Pessoa física',value:'Individual'},{label:'Pessoa jurídica',value:'Organization'}], pixTypes=[{label:'CPF/CNPJ',value:'Document'},{label:'E-mail',value:'Email'},{label:'Telefone',value:'Phone'},{label:'Aleatória',value:'Random'}]
const requiredRules=[v=>Boolean(String(v||'').trim())||'Campo obrigatório']
const collection=v=>Array.isArray(v)?v:v?.data||v?.items||[]
const bankOptions=computed(()=>banks.value.map(b=>({label:b.code?`${b.code} — ${b.name}`:b.name,value:b.id})))
const bankName=id=>bankOptions.value.find(b=>b.value===id)?.label||'Banco não identificado'
const load=async()=>{loading.value=true;error.value='';try{const [b,a]=await Promise.all([listClientBanks({page:1,pageSize:200}),listClientBankAccounts({page:1,pageSize:100})]);banks.value=collection(b).filter(x=>x.isActive!==false);accounts.value=collection(a)}catch(e){error.value=getApiErrorMessage(e,'Não foi possível carregar suas contas bancárias.')}finally{loading.value=false}}
const closeForm=()=>{Object.assign(form,empty());Object.assign(masks,{account:'',document:'',pix:''});editingId.value=null;formDialog.value=false;formRef.value?.resetValidation()}
const openCreate=()=>{closeForm();formDialog.value=true}
const openEdit=async account=>{try{saving.value=true;const d=await getClientBankAccount(account.id);editingId.value=account.id;Object.assign(form,{bankId:d.bankId,branch:d.branch,accountNumber:'',accountDigit:d.accountDigit,accountType:d.accountType,holderType:d.holderType,holderName:d.holderName,holderDocument:'',pixKey:null,pixKeyType:d.pixKeyType,isPrimary:d.isPrimary});Object.assign(masks,{account:d.accountNumberMasked||'Mascarada',document:d.holderDocumentMasked||'Mascarado',pix:d.pixKeyMasked||'Não informado'});formDialog.value=true}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível abrir a conta.'))}finally{saving.value=false}}
const save=async()=>{if(!await formRef.value.validate())return;saving.value=true;try{const payload={...form,accountDigit:form.accountDigit||null,pixKey:form.pixKey||null,pixKeyType:form.pixKeyType||null};if(editingId.value)await updateClientBankAccount(editingId.value,payload);else await createClientBankAccount(payload);successNotify('Conta bancária salva.');closeForm();await load()}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível salvar a conta.'))}finally{saving.value=false}}
const makePrimary=async a=>{try{await setPrimaryClientBankAccount(a.id);successNotify('Conta principal atualizada.');await load()}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível definir a conta principal.'))}}
const askArchive=a=>{archiveTarget.value=a;archiveDialog.value=true}
const confirmArchive=async()=>{saving.value=true;try{await archiveClientBankAccount(archiveTarget.value.id);archiveDialog.value=false;successNotify('Conta arquivada.');await load()}catch(e){errorNotify(getApiErrorMessage(e,'Não foi possível arquivar a conta.'))}finally{saving.value=false}}
load()
</script>
<style scoped>.bank-accounts-layout{max-width:1180px;margin:0 auto}.form-card{width:min(760px,calc(100vw - 32px))}.confirm-card{width:min(440px,calc(100vw - 32px))}.empty-state{border:1px dashed rgba(255,255,255,.2);border-radius:8px}</style>
