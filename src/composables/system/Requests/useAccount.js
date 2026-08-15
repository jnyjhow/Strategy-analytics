import { api } from 'src/boot/axios';
import useCookies from 'src/composables/useCookies';
import useNotify from 'src/composables/useNotify'
import { ref } from 'vue'
import { useRoute } from 'vue-router';

export default function useAccount() {
  const loading = ref(false)
  const buttonSubmit = ref(false)
  const { errorNotify, successNotify, multError } = useNotify()
  const { updateCookieAccount, updateNameByAccount, deleteCookieUser } = useCookies()
  const route = useRoute()
  const updateData = async (data) => {
    loading.value = true
    try {
      const res = await api.post(`account/data`, { name: data.name, phone: data.account.phone });
      successNotify(res.data.message)
      await deleteCookieUser()
      route.redirectedFrom
      // console.log(res):
    } catch (e) {
      console.log(e)
      multError(e.response.data.errors)
    } finally {
      // buttonSubmit.value = false
      loading.value = false
    }
  }
  const sendAvatar = async ($file) => {
    loading.value = true

    api.defaults.headers.common['Accept'] = 'form-data';
    api.defaults.headers.common['Accept'] = 'application/json';
    try {
      const res = await api.post(`account/avatar`, $file);
      await updateCookieAccount(res.data.account)
      successNotify(res.data.message)
    } catch (e) {
      multError(e.response.data.errors)
    } finally {
      buttonSubmit.value = false
      loading.value = false
    }

  }

  return {
    updateData,
    sendAvatar,
    loading,
    buttonSubmit
  }

}
