<template>
  <div class="bg-dark text-white q-mt-md col-12 bg-transparent">
    <div class="row q-col-gutter-md q-mx-sm">
      <div class="row col-12 justify-end text-end">
        <div class="col-auto">
          <div class="col-12" style="text-align-last: right">
            <q-avatar
              v-for="n in usuarios"
              :key="n"
              size="50px"
              class="overlapping"
            >
              <img :src="`${n.avatar}`" />
            </q-avatar>
          </div>
          <q-toggle
            dense
            v-model="showHistory"
            label="Ver Histórico de Aportes"
            color="primary"
          />
        </div>
      </div>
      <div class="row col-12 styleTool">
        <div class="q-mt-md col-8">
          <apexchart
            type="bar"
            height="350"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
        <div class="col-auto">
          <legend-chart
            v-for="(user, index) in usuarios"
            :key="index"
            :name="user.usuario"
            :color="user.color"
            :now="user.valor_aporte"
            year="147,85"
          />
        </div>
      </div>

      <div v-if="showHistory" class="q-mt-xl q-px-md col-12">
        <div class="q-mb-md">Histórico de Aportes</div>
        <aportes-table :aportesHistory />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import financialData from "src/composables/system/fake/fincancial_fake_data.json";
import AportesTable from "../Table/AportesTable.vue";
import LegendChart from "src/system/components/charts/LegendChart.vue";

const showHistory = ref(true);
const aportesHistory = ref([]);
const monthlyAportesGrouped = ref({});
const chartCategories = ref([]);
const colorUser = {
  222: "#00A3FF",
  221: "#00F5D9",
  223: "#7438FF",
};
const usuarios = ref([]);
onMounted(() => {
  aportesHistory.value = financialData.aportes.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  usuarios.value = financialData.usuarios.map((item, index) => ({
    color: colorUser[item.hash],
    ...item,
  }));
  processAportesData();
});
const processAportesData = () => {
  const monthlyAportes = {};
  aportesHistory.value.forEach((aporte) => {
    const dateParts = aporte.data.split("/");
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthlyAportes[monthYear]) {
      monthlyAportes[monthYear] = {};
    }
    if (!monthlyAportes[monthYear][aporte.usuario]) {
      monthlyAportes[monthYear][aporte.usuario] = {
        total: 0,
        avatar: aporte.avatar,
        latestDate: "",
      };
    }
    monthlyAportes[monthYear][aporte.usuario].total += parseFloat(
      aporte.valor_aporte.replace(".", "").replace(",", "."),
    );
    monthlyAportes[monthYear][aporte.usuario].latestDate = aporte.data; // Store the latest date for tooltip
  });

  const months = Object.keys(monthlyAportes).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);
    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

  chartCategories.value = months.map((month) => {
    const [year, monthIndex] = month.split("-");
    const date = new Date(year, monthIndex);
    return date
      .toLocaleString("pt-BR", { month: "short", year: "2-digit" })
      .replace(".", "")
      .toUpperCase();
  });
  monthlyAportesGrouped.value = monthlyAportes;
};

const monthlyAportes = {};
const series = computed(() => {
  // Agrupar aportes por mês para o gráfico
  aportesHistory.value.forEach((aporte) => {
    const date = new Date(aporte.data.split("/").reverse().join("-"));
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthlyAportes[monthYear]) {
      monthlyAportes[monthYear] = {};
    }
    if (!monthlyAportes[monthYear][aporte.usuario]) {
      monthlyAportes[monthYear][aporte.usuario] = 0;
    }
    monthlyAportes[monthYear][aporte.usuario] += parseFloat(
      aporte.valor_aporte.replace(".", "").replace(",", "."),
    );
  });

  const users = [...new Set(aportesHistory.value.map((item) => item.usuario))];
  const months = Object.keys(monthlyAportes).sort();
  // const dataMonths = months.map((month) => monthlyAportes[month] || 0);
  // console.log(monthlyAportes);
  const seriesData = users.map((user) => {
    return {
      name: user,
      data: months.map((month) => monthlyAportes[month][user] || 0),
    };
  });
  return seriesData;
});

const chartOptions = computed(() => {
  const months = Object.keys(monthlyAportes).sort();
  const categories = months.map((month) => {
    const [year, monthIndex] = month.split("-");
    const date = new Date(year, monthIndex);
    return date
      .toLocaleString("pt-BR", { month: "short", year: "2-digit" })
      .replace(".", "")
      .toUpperCase();
  });

  return {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    // plotOptions: {
    //   bar: {
    //     horizontal: false,
    //     dataLabels: {
    //       enabled: false,
    //       total: {
    //         enabled: true,
    //         style: {
    //           fontSize: "13px",
    //           fontWeight: 900,
    //           color: "#fff",
    //         },
    //       },
    //     },
    //   },
    // },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return `R$ ${val.toFixed(2).replace(".", ",")}`;
        },
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#fff",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "transparent",
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const user = w.config.series[seriesIndex].name;
        const monthYearKey = Object.keys(monthlyAportesGrouped.value).sort(
          (a, b) => {
            const [yearA, monthA] = a.split("-").map(Number);
            const [yearB, monthB] = b.split("-").map(Number);
            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
          },
        )[dataPointIndex];

        const userData = monthlyAportesGrouped.value[monthYearKey][user];
        const avatar = userData
          ? userData.avatar
          : "https://sources.strategyanalytics.com.br/storage/users/joao_default.png"; // Fallback avatar
        const value = userData ? userData.total : 0;
        const date = userData ? userData.latestDate : "N/A";

        return (
          '<div class="apexcharts-tooltip-custom">' +
          '<div class="row items-center q-gutter-sm">' +
          `<q-avatar size="32px"><img src="${avatar}"></q-avatar>` +
          "<div>" +
          '<div class="text-caption text-grey-5">Aporte:</div>' +
          `<div class="text-subtitle1 text-primary">R$ ${value.toFixed(2).replace(".", ",")}</div>` +
          `<div class="text-caption text-grey-5">${date}</div>` +
          "</div>" +
          "</div>" +
          "</div>"
        );
      },
    },
    grid: {
      borderColor: "#444",
      strokeDashArray: 4,
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: true },
      },
    },
    colors: ["#00A3FF", "#00F5D9", "#7438FF"], // Cores para os usuários
  };
});
</script>
<style lang="scss">
.apexcharts-tooltip-custom {
  width: 325px;
  height: 102px;
  gap: 16px;
  opacity: 1;
  border-radius: 8px;
  border-width: 1px;
  padding: 24px;
  background: linear-gradient(
    202.99deg,
    rgba(255, 255, 255, 0.16) 0.52%,
    rgba(255, 255, 255, 0.04) 50%,
    rgba(255, 255, 255, 0.01) 99.48%
  );
  border: 1px solid #efefef14;
  backdrop-filter: blur(40px);

  box-shadow: 4px 4px 12px 0px #0000003d;
}
</style>
