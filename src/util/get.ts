export async function get(url: string) {
  const response = await fetch(url);
  return response.json();
}
