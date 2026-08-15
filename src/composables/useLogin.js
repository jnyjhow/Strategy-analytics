import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";
import useNotify from "./useNotify";
import { storeToRefs } from "pinia";
import usePartterns from "./system/usePatterns.js";

export default function useLogin() {
  const router = useRouter();
  const useStore = useUserStore();
  const { isClient } = storeToRefs(useStore);
  const { users } = usePartterns();
  const notification = useNotify();
  //tem que colocar isso no .env
  const keyLocal = "SA_user";
  const json = localStorage.getItem(keyLocal);

  const expireLogin = (user) => {
    return user.expiration_date < Date.now();
  };
  const setExpiration = () => {
    const nowDate = new Date();
    return nowDate.setHours(nowDate.getHours() + 12);
  };
  const logOut = () => {
    const expiration = JSON.parse(json).expiration_date;
    !expiration ? setLogout() : "";
  };

  const getDataUser = (value, expiration_date = null) => {
    let user = users.find((x) => x.cpf == value);
    if (expiration_date) {
      user.expiration_date = expiration_date;
    }
    // logOut();
    return user ?? "";
    // notification.errorNotify("Usuário o senha inválido!")
  };

  const verifyPassword = (data, password) => {
    return data.password === password ?? false;
  };
  const routeRetorn = () => {
    return isClient.value
      ? router.replace({ path: "/system/wallet" })
      : router.replace({ path: "/system/wallet" });
  };
  const verifyLogged = async () => {
    const userData = JSON.parse(json);
    if (userData) {
      // setTimeout(() => {
      //   console.log("ESOU AQUI");
      // }, 500);
      expireLogin(userData) ? setLogout() : routeRetorn();
    }
  };
  const getLoggedIn = async () => {
    const userData = JSON.parse(json);
    if (!userData) {
      router.replace({ path: "/login" });
      // router.push({ name: "login" });
      return;
    }
    useStore.setUserData(getDataUser(userData.cpf));
    // useStore.setLoan(getDataUser(userData.cpf).loan);
  };
  /**
   *
   * @param {string} value //cpf
   */
  const setUserLoggedin = async (value) => {
    if (
      getDataUser(value.person) &&
      verifyPassword(getDataUser(value.person), value.password)
    ) {
      localStorage.setItem(
        keyLocal,
        JSON.stringify(getDataUser(value.person, setExpiration()))
      );
      // router.go(1);
      routeRetorn();
    } else {
      notification.errorNotify("Usuário ou senha inválido!");
    }
  };

  const setLogout = async () => {
    localStorage.removeItem(keyLocal);

    // router.push({ name: "login" });

    window.location.reload();
    // router.go();
  };
  const UploadAvatar = async (e) => {
    useStore.setAvatarUpload(e);
  };
  const getAll = async () => {
    return users;
  };
  return {
    json,
    setUserLoggedin,
    getLoggedIn,
    getDataUser,
    setLogout,
    verifyLogged,
    UploadAvatar,
    getAll,
  };
}
