const state = () => {
  return {
    login: {
      person: "",
      password: "",
      expiration: null,
    },
    authentication: {
      token: "",
      person: "",
      password: "",
      password_confirm: "",
      password_confirmation: "",
    },
    level: 1,
    assets: 2,
    register: {
      notifications: "refused"
    },
    accountEdit: {},
    data: {},
    loan: {},
    wallet: {},
    investment: {},
    abilities: [],
    routeHome: "inicio",
    NavbarMenu: "adm",
    isDirty: {},
    isDirtyData: {},
    walletChart: [],
    stepCash: 1,
    cash: {
      ammount: "",
      account: ""
    },
    vehicles: {
      paid_off: false
    },
    investmentsAdd: {
      term: false
    },
    consortium: {},
    imovel: {
      paid_off: false
    }
  };
};

export default state;
