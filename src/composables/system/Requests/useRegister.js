import { api, axios } from 'src/boot/axios';
import { ref } from 'vue'
import useNotify from 'src/composables/useNotify'
import useStates from 'src/composables/useStates';
import { useRouter } from 'vue-router';
export default function useRegister() {
  let dataInput = {};
  const loading = ref(false)
  const statusPerson = ref(false)
  const registrationStatus = ref(false)
  const router = useRouter()
  const { infoNotify, errorNotify, successNotify, multError } = useNotify()
  const { showLoading, hideLoading } = useStates()
  const validateCPF = async (person, email, birthday) => {
    loading.value = true
    showLoading('Lendo os dados ...')
    dataInput = {
      birthday: birthday, email: email, value: person, type: "cpf"
    }
    // try{
    await api.get(process.env.API_URL_CORS).then(response => {
    }).catch(() => { infoNotify('Falha na solicitação, recarregue sua pagina.') }).finally(() => loading.value = false)
    await api.post('validator-cpf', { ...dataInput }).then((res) => {
      if (!res.data.valid) {
        infoNotify('CPF não é valido!')
      }
      statusPerson.value = res.data.valid
    }).catch((e) => {
      multError(e.response.data.errors)
    })
    setTimeout(() => {
      hideLoading()

    }, 2000)
  }
  const viaCEP = async (cep) => {
    try {
      loading.value = true
      const res = await api.post('validator-cep', { cep: cep })
      return res.data

    } catch (e) {
      console.log(e)
      errorNotify('Cpf não pode ser consultado, tente novamente.')

    } finally {
      loading.value = false
    }
  }
  const registration = async (data) => {
    data.genre = "O"
    loading.value = true
    api.post('register', { ...data }).then((res) => {
      successNotify(res.data.message, 40000)
      if (res.data.status == 200)
        registrationStatus.value = true
      router.replace({ name: "login" });
      successNotify("Sejá bem vindo, faça login!", 2000);
      infoNotify(
        "Para garantir a segurança da sua conta, enviamos um código de verificação para o seu e-mail. Utilize este código ao realizar o primeiro acesso.",
        40000,
        "bottom-left"
      );
    }).catch((e) => {
      console.log(e)
      multError(e.response.data.errors)
    }).finally(() => {
      loading.value = false
    })
  }
  return {
    validateCPF,
    viaCEP,
    registration,
    registrationStatus,
    statusPerson, loading,
  }
}
