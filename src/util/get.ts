export async function get(
  url: string,
  type: 'json' | 'arrayBuffer' = 'json',
) {
  const response = await fetch(url);
  switch (type) {
    case 'json':
      return response.json();
    case 'arrayBuffer':
      return response.arrayBuffer();
  }
}
