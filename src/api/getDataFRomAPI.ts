export default function getDataFRomAPI<T>(endpoint?: string): Promise<T> {
  return fetch(import.meta.env.VITE_API_URL.concat(endpoint ?? ''))
    .then((response) => response.json())
    .then((json) => {
      if (json?.results) {
        return [json.results, json.count];
      }
      return json;
    });
}
