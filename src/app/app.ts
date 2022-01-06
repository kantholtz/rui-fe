import HeaderBar from "@/components/header/header.vue";
import { TrackingService } from "@/services/tracking-service";

// why no work?
// import { Route } from "vue-router";

interface Route {
  name: string;
  params: unknown;
}

export default {
  components: { HeaderBar },

  watch: {
    $route(to: Route): void {
      console.log("route change detected", to);

      const blob = JSON.stringify({
        name: to.name,
        params: to.params,
      });

      TrackingService.trackRoute(blob);
    },
  },
};
