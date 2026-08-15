import { api } from 'src/boot/axios';
import useNotify from 'src/composables/useNotify'
import { useUserStore } from 'src/stores/user';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import useStates from '../../useStates';
import useCookies from 'src/composables/useCookies';

export default function useToken() {
  const loading = ref(false)
  const tokenStatus = ref("validateToken")
  const router = useRouter()
  const userStore = useUserStore()
  const { errorNotify, successNotify } = useNotify()
  const { showLoading, hideLoading } = useStates()
  const { deleteCookieUser } = useCookies()

  const forgot = ref(false)
  const resendToken = async (token_id) => {
    loading.value = true
    try {
      const res = await api.put(`tokens/${token_id}`);
      // console.log(res)
      successNotify(res.data.message)
    } catch (e) {
      // console.log(e)
      // console.log(e.response.data.message)
      // errorNotify(e.response.data.message);
    } finally {
      loading.value = false
    }
  }
  const validateToken = async (token) => {
    loading.value = true
    try {
      const res = await api.post(`tokens/validate`, { ...token });
      if (res.data.status == 200)
        successNotify('Sejá muito bem vindo, vamos finalizar seu cadastro e pode acessar nossa plataforma!', 10000)

      // console.log(res.data.message)
    } catch (e) {
      // console.log(e)
      // console.log(e.response.data.message)
      errorNotify(e.response.data.message);
    } finally {
      loading.value = false
    }
  }

  const checkingToken = async (data) => {
    loading.value = true
    try {
      const res = await api.post(`tokens`, { ...data });
      if (res.data.status == 200) {
        successNotify(res.data.message, 10000)
        tokenStatus.value = "login"
        router.push({ name: "login" });
      }

      // console.log(res.data.message)
    } catch (e) {
      // console.log(e)
      // console.log(e.response.data.message)
      errorNotify(e.response.data.message);
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (data) => {
    showLoading('Coletando dados para envia... ')
    await api.get(process.env.API_URL_CORS).then(response => {
    }).catch(() => { infoNotify('Solicitão suspeita recarregue sua pagina.') }).finally(() => loading.value = false)
    showLoading('Preparando email para envio... ')
    await api.post(`password/forgot`, { ...data }).then((res) => {
      // if (res.data.status == 200) {
      forgot.value = true
      successNotify(res.data.message, 10000)
      showLoading('Tudo certo ... ')
      // }
    }).catch((e) => {
      // console.log(e)
      // console.log(e.response.data.message)
      errorNotify(e.response.data.message);
    }).finally(() => {
      loading.value = false
      hideLoading()
    });
  }
  const passwordReset = async (data) => {
    loading.value = true
    try {
      const res = await api.post(`password/reset`, { ...data });
      if (res.data.status == 200) {
        successNotify(res.data.message, 10000)
        tokenStatus.value = "login"
        router.push({ name: "login" });
      }

      // console.log(res.data.message)
    } catch (e) {
      // console.log(e)
      // console.log(e.response.data.message)
      errorNotify(e.response.data.message);
    } finally {
      loading.value = false
    }
  }
  const verifyEmail = async (email) => {
    loading.value = true
    api.post('auth/verifyemail').then((res) => {

      successNotify(res.data.message, 20000)

      router.push({ name: "inicio" })
    }).catch((e) => {
      // console.log(e)
      // console.log(e.response)
      errorNotify(e.response.data.message);
    }).finally(() => {
      loading.value = false
    })
  }
  const authEmail = async () => {
    loading.value = true
    try {
      const res = await api.post(`auth/authemail`);

      successNotify(res.data.message, 10000)
      userStore.setEmailVerified(res.data.user.email_verified_at)
      await deleteCookieUser()
      router.push({ name: "inicio" })
    } catch (e) {
      // console.log(e)
      // console.log(e.response.data.message)
      errorNotify(e.response.data.message);
    } finally {
      loading.value = false
    }
  }

  return {
    resendToken,
    validateToken,
    checkingToken,
    forgotPassword,
    passwordReset,
    verifyEmail,
    authEmail,
    loading,
    tokenStatus,
    forgot
  }

}
