import {
  Predictions,
  Annotation,
  AnnotationResponse,
} from "@/models/prediction";

export const PredictionService = {
  getPredictions(
    nid: number,
    offset = 0,
    limit: number | null = 1
  ): Promise<Predictions> {
    const url =
      limit === null
        ? `${process.env.VUE_APP_API_URL}/nodes/${nid}/predictions?offset=${offset}`
        : `${process.env.VUE_APP_API_URL}/nodes/${nid}/predictions?offset=${offset}&limit=${limit}`;

    return fetch(url)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },

  // --

  delPrediction(pid: number): Promise<Response | void> {
    const url = `${process.env.VUE_APP_API_URL}/predictions/${pid}`;

    return fetch(url, {
      method: "DELETE",
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  },

  // --

  annPrediction(
    pid: number,
    annotation: Annotation
  ): Promise<AnnotationResponse> {
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(annotation),
    };

    return fetch(
      `${process.env.VUE_APP_API_URL}/predictions/${pid}/annotate`,
      fetchOptions
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};
