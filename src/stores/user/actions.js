
const actions = {
  getAccount(payload) {
    let getJson = [];
    getJson = {
      ...this.data.user_bank_accounts.filter((a) => {
        return a.id == payload;
      }),
    };
    const teste = { ...getJson[0] };
    // console.log("vendpo getJson[0]->", getJson[0]);
    // console.log("vendpo stor->", teste);
    this.accountEdit = teste;
  },

  setUserData(payload) {
    this.data = { ...payload };
    this.isDirty = { ...payload }
    this.isDirtyData = { ...payload.account }
    this.NavbarMenu = payload.role_id == 3 ? 'client' : 'admin';
    this.wallet = payload.role_id === 3 ? { ...payload.user_wallet } : "";
    this.loan = payload.investment ? payload.loan : "";
    this.investment = payload.investment ? payload.investment : "";
  },
  setAvatarUpload(payload) {
    this.data.account.avatar = payload;
  },
  setRouteHome(payload) {
    this.routeHome = payload
  },
  setLoan(payload) {
    this.loan = payload;
  },
  setAbilities(payload) {
    this.abilities = payload;
  },
  setClear() {
    this.accountEdit = {}
    this.data = {}
    this.loan = {}
    this.wallet = {}
    this.investment = {}
    this.abilities = {}
    this.routeHome = ""
    this.NavbarMenu = "adm"
  },
  setEmailVerified(payload) {
    this.data.email_verified_at = payload
  },
  setWalletChart(payload) {
    this.walletChart = payload
  },
  setWallet(payload) {
    this.wallet = payload
  }

};

export default { ...actions };
