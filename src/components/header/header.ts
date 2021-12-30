import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderBar",

  methods: {
    goToHomePage() {
      this.$router.push("/").then();
    },
  },
});
