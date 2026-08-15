// import { storeToRefs } from "pinia";
import { Cookies, Dark, LocalStorage } from "quasar";
import { useLayoutStore } from "src/stores/layout";
import { useUserStore } from "src/stores/user";

export default function useCookies() {
  const setOptionsCookie = { path: '/', secure: true, sameSite: "None" }
  const tokenName = process.env.COOKIE_TOKEN_NAME ?? "SA_token";
  const userCookie = process.env.COOKIE_USER_DATA ?? "SA_user";
  const hasTokenCookie = Cookies.has(tokenName);
  const hasUserCookie = Cookies.has(userCookie);
  const getuserCookie = Cookies.get(userCookie);
  const tokenCookie = Cookies.get(tokenName);
  const storeLayout = useLayoutStore();
  const storeUser = useUserStore();
  // const {dashboard} = storeToRefs(storeLayout)

  const booleanVerify = (value) => {
    return value == "true" ? true : false;
  };

  const verify = () => {
    return Cookies.has("accept");
  };
  const toggleMod = () => {
    Dark.toggle();
    setDarkMode(Dark.isActive);
  };
  const setCookie = (name, value) => {
    Cookies.set(name, value, setOptionsCookie);
  };
  const getValue = (name) => {
    return Cookies.get(name);
  };

  const getDarkMode = async () => {
    // let valueDark = getValue("dark_mode") == "true" ? true : false;
    Dark.set(true);
  };

  const setDarkMode = (value) => {
    setCookie("dark_mode", value);
    Dark.set(value);
  };

  const setWidgetReport = (value) => {
    storeLayout.updatedDashReport(value);
    setCookie("widget_report", value);
  };

  const getWidgetReport = () => {
    return Cookies.has("widget_report")
      ? booleanVerify(getValue("widget_report"))
      : true;
  };
  /**
   * Deletnando cookies local, isso vai deslogar usuário
   */
  const deleteTokenCookie = () => {
    Cookies.remove(tokenName, setOptionsCookie);
    Cookies.remove(userCookie, setOptionsCookie);
    LocalStorage.remove(tokenCookie)
  }
  /**
   * Deletando cookie com os dados do usuário
   */
  const deleteCookieUser = async () => {
    Cookies.remove(userCookie, setOptionsCookie);
  }
  /**
   * Setando localmente token de acesso do usuário junto a suas permissões no sistema (roles.abilities)
   * @param {string} value token do usuário
   */
  const setTokenCookie = (value) => {
    Cookies.set(tokenName, value.token, setOptionsCookie);
    // localStorage.setItem(value.token, JSON.stringify(value.abilities))
  };
  /**
   * Setando localmente os dados so usuário
   * @param {object|string} value dados do usuário
   */
  const setUserCookie = (value) => {
    setCookie(userCookie, value)
    storeUser.setUserData(getValue(userCookie))
  }
  const updateCookieAccount = async (newAccount) => {
    let user = getValue(userCookie)
    user.account = newAccount
    setUserCookie(user)
  }
  const updateNameByAccount = async (userNew, accountNew) => {
    let user = getValue(userCookie)
    user.account = accountNew
    user.name = userNew.name
    setUserCookie(user)
  }

  return {
    verify,
    toggleMod,
    getValue,
    getDarkMode,
    getWidgetReport,
    setCookie,
    setDarkMode,
    setWidgetReport,
    deleteTokenCookie,
    setTokenCookie,
    setUserCookie,
    updateCookieAccount,
    updateNameByAccount,
    deleteCookieUser,
    getuserCookie,
    hasUserCookie,
    tokenName,
    hasTokenCookie,
    tokenCookie
  };
}
