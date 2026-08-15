import { api } from 'src/boot/axios';
import useNotify from 'src/composables/useNotify'
import { useUserStore } from 'src/stores/user';
import { ref } from 'vue'

export default function useDataUser() {
  const loading = ref(false)
  const { errorNotify, successNotify, multError } = useNotify()
  const userStore = useUserStore()
  const getWallet = async () => {

    loading.value = true
    await api.get('users/wallet')
      .then((response) => {
        // console.log('response->', response)
        userStore.setWallet(response.data.wallet)
        // console.info('Aqui-->>', response.data)
      })
      .catch((e) => {
        console.log(e);
        errorNotify('Erro ao dados da carteira');
      })
      .finally(() => {
        loading.value = false
      })


  }

  return {
    loading,
    getWallet
  }

}
