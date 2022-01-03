import { defineComponent } from "vue";

import ButtonRegular from "@/components/snippets/ButtonRegular.vue";
import LoadingOverlay from "@/components/loading-overlay/loading-overlay.vue";
import UploadWarning from "@/components/upload-warning/upload-warning.vue";
import ColHeader from "@/components/snippets/ColHeader.vue";

import { Available } from "@/models/upload";
import { UploadService } from "@/services/upload-service";

export default defineComponent({
  name: "UploadPage",

  components: { LoadingOverlay, UploadWarning, ColHeader, ButtonRegular },

  mounted() {
    this.loadAvailable();
  },

  data() {
    return {
      isFileSelected: false,
      showUploadWarning: false,

      loadingMessages: [] as string[],
      showLoading: false,
      showLoadingTimeout: -1,

      available: null as Available[] | null,
    };
  },

  methods: {
    loadAvailable() {
      UploadService.getAvailable().then(
        (res) => (this.available = res.available)
      );
    },

    startLoading(loadingMessage: string): void {
      this.loadingMessages.push(loadingMessage);

      if (this.showLoadingTimeout === -1) {
        this.showLoadingTimeout = window.setTimeout(
          () => (this.showLoading = true),
          500
        );
      }
    },

    stopLoading(loadingMessage: string): void {
      // Remove loading message
      const index = this.loadingMessages.indexOf(loadingMessage);
      if (index !== -1) {
        this.loadingMessages.splice(index, 1);
      }

      // Stop timeout if there are no further loading messages
      if (this.loadingMessages.length === 0) {
        window.clearTimeout(this.showLoadingTimeout);
        this.showLoadingTimeout = -1;
        this.showLoading = false;
      }
    },

    uploadAndRedirect(): void {
      const message = "Uploading data...";

      const form = this.$refs.form as HTMLFormElement;
      const formData = new FormData(form);

      this.startLoading(message);
      UploadService.putUpload(formData).then(() => {
        this.stopLoading(message);
        this.$router.push("/taxonomy");
      });

      this.showUploadWarning = false;
      form.reset();
    },

    loadAndRedirect(name: string): void {
      const message = `Initializing ${name}`;
      this.startLoading(message);

      UploadService.postInit(name).then(() => {
        this.stopLoading(message);
        this.$router.push("/taxonomy");
      });
    },
  },
});
