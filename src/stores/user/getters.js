
import { Cookies } from "quasar";
import useExtractHelpers from "src/composables/system/Helpers/useExtractHelpers";
const { addValues, formatCurrency } = useExtractHelpers()
const getters = {
  getOptionsAccount: (state) => {
    return state.data.user_bank_accounts.map((acc) => ({
      label: acc.number,
      value: acc.id,
      description: acc.bank
    }));
  },
  // doubleCount: (state) => state.counter * 2,
  getInvestiment: (state) => {
    return state.data.user_wallet.current_investment;
  },
  currentInvestimentSeries: (state) => (arraySeries) => {
    // console.log("Estou aqui", arraySeries);
    let investmentInitial = state.data.user_wallet.current_investment;
    const arrayReturn = [];
    for (let i = 0; i < arraySeries.length; i++) {
      let valueNew;
      let addValue;
      // console.log('valueinvestment', investmentInitial)
      addValue = arraySeries[i] * investmentInitial / 100;
      valueNew = investmentInitial + addValue;
      // console.log('addValue sem toFixed -> ', valueNew);
      arrayReturn.push(addValue.toFixed(2));
    }
    // console.log("array return -> ", arrayReturn);
    return arrayReturn;
  },

  expiration: (state) => {
    const dataLocal = JSON.parse(localStorage.getItem("SA_user"));

    if (dataLocal) {
      return dataLocal.expiration_date != null ? true : false;
    }
  },
  isClient: (state) => {
    return state.data.role_id == 3;
  },
  canAccess: (state) => {
    const can = JSON.parse(localStorage.getItem(Cookies.get("SA_token")))
    // console.log('vamos olha para o data -> ', state.data)
    state.abilities = can
    return (params) => can.includes(params)
  },
  menuAccess: (state) => (params) => {
    if (state.abilities.length > 0) {
      return state.abilities.includes('all-access') ?? state.abilities.includes(params)
    }
  },
  authEmailCode: (state) => {
    return state.data.email_verified_at;
  },
  /** 
   * Verificar se esta preenchido formulario para cria novo banco
  */
  verifyFieldAccountEdit: (state) => {
    if (state.accountEdit.name || state.accountEdit.bank || state.accountEdit.agency || state.accountEdit.number || state.accountEdit.nickname)
      return true
    return false
  },


  /**
   * soma disponivel para investir com o investido fazendo o saldo da carteira
   */
  setCurrentWallet: (state) => {
    return addValues(state.wallet.current_investment, state.wallet.current_balance)
  },
  /**
   * pegando valores formatado do valor de disponivel para investir
   */
  getAvailableToInvest: (state) => {
    return formatCurrency(state.wallet.current_balance)
  },
  /**
   * pegando valores formatado do valor de patrimônio investido
   */
  getCurrentInvest: (state) => {
    return formatCurrency(state.wallet.current_investment)
  },
  /**
   * pegando valores formatado do redimento do ultimo mês
   */
  getLastMonth: (state) => {
    return formatCurrency(state.wallet.last_month)
  },
  /**
   * pegando contrato emergencial
   */
  getEmergency: (state) => {
    if (state.data.user_incomes && state.data.user_incomes.length > 0) {
      const income = state.data.user_incomes.filter((e) => e.origin_name == "Reserva de emergência")
      return income[0]
    }
    return { value: "0.00", data_info: "", description: "Faça um reserva emergencial" }
  },
  /**
   * pegando contrato personalizado
   */
  getPersonalite: (state) => {
    if (state.data.user_incomes && state.data.user_incomes.length > 0) {
      const income = state.data.user_incomes.filter((e) => e.origin_name == "Investimento Personalizado")
      return income[0]
    }
    return null
  },
  /**
   * pegando expansão patrimonial
   */
  getExpansive: (state) => {
    if (state.data.user_incomes && state.data.user_incomes.length > 0) {
      const income = state.data.user_incomes.filter((e) => e.origin_name == "Expansão Patrimonial")
      return income[0]
    }
    return { value: "", data_info: "", description: "Ainda não está expandindo seu patrimônio?" }
  }

};

export default { ...getters };
