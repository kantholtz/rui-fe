import { PostEntity } from "@/models/entity";

export const EntityService = {
  postEntity(postEntity: PostEntity): Promise<Response | void> {
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postEntity),
    };

    return fetch(`${process.env.VUE_APP_API_URL}/entities`, fetchOptions).catch(
      (error) => console.error(error)
    );
  },

  deleteEntity(eid: number): Promise<Response | void> {
    const fetchOptions = {
      method: "DELETE",
    };

    return fetch(
      `${process.env.VUE_APP_API_URL}/entities/${eid}`,
      fetchOptions
    ).catch((error) => console.error(error));
  },
};
