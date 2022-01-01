import { DeepNode, PostNode } from "@/models/node";

export const NodeService = {
  getNodes(): Promise<DeepNode[]> {
    return fetch(`${process.env.VUE_APP_API_URL}/nodes`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },

  postNode(postNode: PostNode): Promise<Response | void> {
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postNode),
    };

    return fetch(`${process.env.VUE_APP_API_URL}/nodes`, fetchOptions).catch(
      (error) => console.error(error)
    );
  },

  deleteNode(nid: number): Promise<Response | void> {
    const fetchOptions = {
      method: "DELETE",
    };

    return fetch(
      `${process.env.VUE_APP_API_URL}/nodes/${nid}`,
      fetchOptions
    ).catch((error) => console.error(error));
  },
};
