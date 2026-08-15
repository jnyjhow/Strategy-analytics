const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    //lading-page
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "simulator",
        name: "simulator",
        component: () => import("pages/SimulatorPage.vue"),
      },
      {
        path: "contact",
        name: "contact",
        component: () => import("pages/ContactForm.vue"),
      },
      {
        path: "perspective",
        name: "perspective",
        component: () => import("pages/PerspectivePage.vue"),
      },
      {
        path: "quemsomos",
        name: "quemsomos",
        component: () => import("pages/WhoWeAre.vue"),
      },
      {
        path: "nossaequipe",
        name: "nossaequipe",
        component: () => import("pages/OurTeamPage.vue"),
      },
      {
        path: "investimentos",
        name: "investimentos",
        component: () => import("pages/ManagementPage.vue"),
      },
      {
        path: "quadrivium",
        name: "quadrivium",
        component: () => import("pages/QuadriviumPage.vue"),
      },
      {
        path: "rendavariavel",
        name: "rendavariavel",
        component: () => import("pages/VariableincomePage.vue"),
      },
      {
        path: "rendafixa",
        name: "rendafixa",
        component: () => import("pages/SecurityincomePage.vue"),
      },
      {
        path: "rendaflexivel",
        name: "rendaflexivel",
        component: () => import("pages/FlexibleincomePage.vue"),
      },
    ],
  },
  //system
  {
    path: "/login",
    name: "login",
    component: () => import("../system/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../system/pages/RegisterPage.vue"),
  },
  {
    path: "/public/profile/:token",
    name: "public-profile",
    component: () => import("../system/pages/PublicProfilePage.vue"),
  },
  {
    path: "/system/",
    component: () => import("../system/layouts/MainLayout.vue"),
    props: true,
    meta: {
      auth: true,
    },
    children: [
      {
        path: "confirm-email",
        name: "Confirma e-mail",
        component: () => import('../system/pages/ConfirmEmailPage.vue')
      },
      {
        path: "dashboard",
        component: () => import("../system/views/WalletView.vue"),
        props: true,
        meta: { admin: true },
        children: [
          {
            path: "",
            name: "inicio",
            component: () => import("../system/pages/WalletPage.vue"),
            props: true,
          },
          {
            path: "deposit",
            name: "deposit",
            component: () => import("../system/pages/DepositPage.vue"),
            props: true,
          },
          {
            path: "cash",
            name: "Saque",
            component: () => import("../system/pages/Wallet/CashWalletPage.vue"),
            props: true,
          }
        ]
      },
      {
        path: "contracts",
        props: true,
        children: [
          {
            path: "",
            name: "Contratos",
            component: () => import("../system/pages/contract/ContractsPage.vue"),
            props: true,
          },
          {
            path: ":id",
            name: "contract",
            component: () => import('../system/pages/contract/ContractPage.vue')

          }
        ]
      },
      {
        path: "communication",
        props: true,
        children: [
          {
            name: "Comunicação",
            path: "",
            component: () => import("../system/pages/CommunicationPage.vue"),
            props: true
          },
          {
            name: "Comunicação Insight",
            path: ":hash",
            component: () => import("../system/pages/InsightPage.vue"),
            props: true,
          }
        ]
      },
      {
        path: "perfomance",
        name: "perfomance",
        component: () => import("../system/pages/PerfomancePage.vue"),
      },
      {
        path: "leverage",
        props: true,
        children: [
          {
            path: "",
            name: "Alavancagem",
            component: () => import("../system/pages/leverage/LeveragePage.vue"),
          },
          {
            path: "MyLeverages",
            name: "Minhas Alavacagens",
            component: () => import("../system/pages/leverage/MyLeveragesPage.vue")
          }
        ]
      },
      // {
      //   path: "loan",
      //   name: "Empréstimos",
      //   component: () => import("../system/pages/LoanPage.vue"),
      // },
      {
        path: "loan",
        props: true,
        children: [
          {
            path: "",
            name: "Empréstimos",
            component: () => import("../system/pages/loan/LoanPage.vue"),
            props: true,
          },
          {
            path: "securedLoan",
            props: true,
            children: [
              {
                path: "",
                name: "Empréstimo com Garantia",
                component: () => import("../system/pages/loan/SecuredLoanPage.vue")
              },
              {
                path: "simulation",
                name: "Simulação de Crédito pré-aprovado",
                component: () => import("../system/pages/loan/SimulationLoanPage.vue")
              },
              {
                path: "offers_final",
                name: "Orfetas Finais",
                component: () => import("../system/pages/loan/OffersFinalLoanPage.vue")
              }
            ]

          },
          {
            path: "consortiumLoan",
            props: true,
            children: [
              {
                path: "",
                name: "Consórcio",
                component: () => import("../system/pages/loan/ConsortiumLoanPage.vue")
              },
              {
                path: "offers",
                name: "Orfetas Finais Consórcio",
                component: () => import("../system/pages/loan/ConsortiumOffersLoanPage.vue")
              }
            ]

          },
          {
            path: "collateralLoan",
            name: "Emprestimo Colateral",
            component: () => import("../system/pages/loan/CollateraLoanPage.vue")

          },

        ]
      },
      {
        path: "config",
        props: true,
        children: [
          {
            path: "",
            name: "config",
            component: () => import("../system/pages/Config/ConfigPage.vue"),
            props: true,
          },
          {
            path: "profile",
            name: "profile",
            component: () => import("../system/pages/Config/ProfilePage.vue"),
            props: true,
          }
        ],
      },
      {
        name: "calendar",
        path: "calendar",
        component: () => import("../system/pages/CalendarPage.vue"),
      },
      {
        path: "report",
        name: "report",
        component: () => import("../system/pages/ReportPage.vue"),
      },
      {
        path: "graphic",
        name: "graphic",

        component: () => import("../system/pages/GraphicPage.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("../system/pages/UsersPage.vue"),
        meta: { admin: true },
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("../system/pages/ClientsPage.vue"),
        meta: { admin: true },
      },
      {
        path: "controlDeposit",
        component: () => import("../system/views/DepositView.vue"),
        props: true,
        meta: { admin: true },
        children: [
          {
            path: "",
            name: "controlDeposit",
            component: () => import("../system/pages/control/ControlDepositPage.vue"),
            props: true,
          },

        ]
      },
      {
        path: "controlReports",
        component: () => import("../system/views/ReportView.vue"),
        props: true,
        meta: { admin: true },
        children: [
          {
            path: "",
            name: "controlReports",
            component: () => import("../system/pages/ControlreportPage.vue"),
            props: true,
          },
          {
            path: ":id",
            name: "relatorio",
            component: () => import("../system/layouts/control/reports/ReadreportLayout.vue"),
            meta: { admin: true },
            props: true
          }
        ]
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
