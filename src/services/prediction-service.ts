import {
  Predictions,
  Annotation,
  AnnotationResponse,
  FilterResponse,
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

  delPrediction(pid: number, nid: number): Promise<Response | void> {
    const url = `${process.env.VUE_APP_API_URL}/predictions/${pid}?nid=${nid}`;

    return fetch(url, {
      method: "DELETE",
    }).catch((error) => console.error(error));
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

  filterPrediction(
    pid: number,
    nid: number,
    relation: string,
    phrase: string
  ): Promise<FilterResponse> {
    const data = {
      nid: nid,
      relation: relation,
      phrase: phrase,
    };

    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    return fetch(
      `${process.env.VUE_APP_API_URL}/predictions/${pid}/filter`,
      fetchOptions
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};
