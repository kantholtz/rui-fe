import { PredictionResponse } from "@/models/prediction";
// import { PredictionPatch } from "@/models/prediction/prediction-patch";

export const PredictionService = {
  getPredictions(
    nid: number,
    offset = 0,
    limit: number | null = 3
  ): Promise<PredictionResponse> {
    const url =
      limit === null
        ? `${process.env.VUE_APP_API_URL}/nodes/${nid}/predictions?offset=${offset}`
        : `${process.env.VUE_APP_API_URL}/nodes/${nid}/predictions?offset=${offset}&limit=${limit}`;

    return fetch(url)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },

  delPrediction(pid: number): Promise<PredictionResponse> {
    const url = `${process.env.VUE_APP_API_URL}/predictions/${pid}`;

    return fetch(url, {
      method: "DELETE",
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  },

  // patchPrediction(
  //   candidate: string,
  //   predictionPatch: PredictionPatch
  // ): Promise<Response | void> {
  //   const fetchOptions = {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(predictionPatch),
  //   };

  //   return fetch(
  //     `${process.env.VUE_APP_API_URL}/predictions/${encodeURIComponent(
  //       candidate
  //     )}`,
  //     fetchOptions
  //   ).catch((error) => console.error(error));
  // },
};
