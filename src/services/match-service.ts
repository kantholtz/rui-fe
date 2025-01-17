import { Match } from "@/models/match";

export const MatchService = {
  getMatches(entity: number, offset = 0, limit = 6): Promise<Match[]> {
    return fetch(
      `${process.env.VUE_APP_API_URL}/matches?entity=${entity}&offset=${offset}&limit=${limit}`
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  },
};
