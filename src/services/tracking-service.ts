export const TrackingService = {
  trackRoute(blob: string): Promise<Response> {
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: blob,
    };

    return fetch(`${process.env.VUE_APP_API_URL}/track/route`, fetchOptions);
  },
};
