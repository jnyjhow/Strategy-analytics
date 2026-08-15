import {
  login as clientLogin,
  getCurrentUser,
  clientPing,
  logout as clientLogout,
  getApiErrorMessage,
} from "src/services/clientAuthService";
import { useUserStore } from "src/stores/user";
import { Cookies } from "quasar";
import { useRouter } from "vue-router";
import useNotify from "../useNotify";
import { ref } from "vue";
import useCookies from "../useCookies";

// Cookie para o refresh token da API do cliente
const refreshName = process.env.COOKIE_REFRESH ?? "SA_refresh";
const refreshOptions = { path: "/", secure: true, sameSite: "None" };

export default function useAuth() {
  const useStore = useUserStore();
  const {
    setTokenCookie,
    deleteTokenCookie,
    setUserCookie,
    tokenName,
  } = useCookies();

  const router = useRouter();
  const { errorNotify, infoNotify } = useNotify();
  const loading = ref(false);
  const errors = ref({
    person: "",
    password: "",
  });
  const role = ref(null);

  // Normaliza o usuário da nova API para o shape esperado pelo store/navbar.
  // role_id === 3 = cliente (menu do cliente).
  const normalizeUser = (u = {}) => {
    const roles = u.roles ?? (u.role ? [u.role] : []);
    return {
      ...u,
      roles,
      role_id: roles.some((item) => ["Cliente", "Client"].includes(item)) ? 3 : 1,
      account: u.account ?? {},
    };
  };

  /**
   * Login do cliente na API (codebiz). `value.person` carrega o e-mail.
   */
  const auth = async (value) => {
    loading.value = true;
    try {
      const payload = await clientLogin({
        email: value.person,
        password: value.password,
      });

      setTokenCookie({ token: payload.accessToken });
      if (payload.refreshToken) {
        Cookies.set(refreshName, payload.refreshToken, refreshOptions);
      }
      setUserCookie(normalizeUser(payload.user));
      await clientPing();
      router.replace({ path: "/system/" });
    } catch (e) {
      deleteTokenCookie();
      Cookies.remove(refreshName, refreshOptions);
      errorNotify(getApiErrorMessage(e));
      errors.value = e?.response?.data?.errors ?? errors.value;
    } finally {
      loading.value = false;
    }
  };

  const verifyLogged = async () => {
    const token = Cookies.get(tokenName);
    if (!token) return false;
    return validatetoken();
  };

  /**
   * Valida a sessão do cliente contra GET /api/v1/auth/me.
   */
  const validatetoken = async () => {
    loading.value = true;
    try {
      const me = await getCurrentUser();
      await clientPing();
      setUserCookie(normalizeUser(me));
      return true;
    } catch (e) {
      infoNotify("Faça login!");
      deleteTokenCookie();
      Cookies.remove(refreshName, refreshOptions);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const setLogout = async () => {
    loading.value = true;
    const refreshToken = Cookies.get(refreshName);
    try {
      await clientLogout(refreshToken);
    } catch (e) {
      console.log(e);
    } finally {
      deleteTokenCookie();
      Cookies.remove(refreshName, refreshOptions);
      useStore.setClear();
      loading.value = false;
      router.replace({ path: "/login" });
    }
  };

  return {
    auth,
    verifyLogged,
    setLogout,
    errors,
    loading,
    role,
  };
}
