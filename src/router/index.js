import { route } from "quasar/wrappers";
import { Cookies } from "quasar";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import useAuth from "src/composables/system/useAuth";
import useCookies from "src/composables/useCookies";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  Router.beforeEach(async (to) => {
    const { verifyLogged } = useAuth();
    const { tokenName } = useCookies()
    let home =
      to.name == "home"
        ? "Gestão de Investimentos e Serviços Financeiros"
        : to.name;
    document.title =
      to.name != undefined
        ? `Strategy Analytics -  ${home}`
        : "Strategy Analytics";
    if (to.meta?.auth) {
      const authenticated = await verifyLogged();
      if (!authenticated) return { name: 'login' };
    }

    //verificando se o usuário esta logado evitar logar duplicado
    if (to.name == "login") {
      if (Cookies.has(tokenName)) return { name: 'config' };
    }
    return true;
  });

  return Router;
});
