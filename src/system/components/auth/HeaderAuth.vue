<template>
  <div class="HeaderAuth" :style="styleNew">
    <div class="">
      <logo-small-right />
      <p class="text-segoe q-mt-lg">{{ text }}</p>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import LogoSmallRight from "../LogoSmallRight.vue";
export default defineComponent({
  name: "HeaderAuth",
  components: {
    LogoSmallRight,
  },
  props: {
    text: { type: String },
    styleNew: { type: String, default: "height: 40vh" },
  },
  setup() {
    return {};
  },
});
</script>
<style lang="sass">
.text-segoe
  font-family: Segoe
  font-size: 2rem
  font-style: normal
  font-weight: 400
  line-height: 2.5rem
  letter-spacing: -1.6px
  max-width: 80%
</style>
