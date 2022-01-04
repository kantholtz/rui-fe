import { AvailableResponse } from "@/models/upload";

export const UploadService = {
  putUpload(formData: FormData): Promise<void | Response> {
    const fetchOptions = {
      method: "PUT",
      body: formData,
    };

    return fetch(`${process.env.VUE_APP_API_URL}/upload`, fetchOptions).catch(
      (error) => console.error(error)
    );
  },

  getAvailable(): Promise<AvailableResponse> {
    return fetch(`${process.env.VUE_APP_API_URL}/uploads`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },

  postInit(name: string): Promise<void | Response> {
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    };

    return fetch(
      `${process.env.VUE_APP_API_URL}/initialize`,
      fetchOptions
    ).catch((error) => console.error(error));
  },
};
