import { boot } from "quasar/wrappers";
import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.API_URL,
//   withCredentials: true,
//   headers: {
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });
const api = axios.create({ baseURL: process.env.API_URL });

export default boot(({ app }) => {

  app.config.globalProperties.$axios = axios;
  api.defaults.headers.common["Accept"] = "application/json";
  api.defaults.withCredentials = true;
  api.defaults.withXSRFToken = true;
  app.config.globalProperties.$api = api;
});

export { api, axios };
