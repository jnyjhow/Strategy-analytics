import { api, axios } from "boot/axios";
import useNotify from "../useNotify";
export default function useRequestIntercept() {

  const { errorNotify, alternativeNotify } = useNotify()
  const urlCors = process.env.API_URL_CORS
  const setCors = async () => {
    await api.get(urlCors)
      .then((response) => {
        console.log(response)
        // infoNotify("Falha na solicitação, recarregue sua pagina.", 5000, 'bottom');
      })
      .catch((e) => {
        alternativeNotify('Desative o bloqueio de cookies para melhorar sua experiência e podemos armazenar informações essenciais. Não armazenamos dados sensiveis, muito menos coletamos seus dados.', 50000);
        console.log(e)
        errorNotify(e)
      })
      .finally(() => {
        // hideLoading();
      });
  };

  return {
    setCors
  }
}
