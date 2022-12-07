export default async function serviceApi({
  uri = 'https://service-api-demo.superfast.shop/api/graphql',
  query,
  variables
}) {
  const body = JSON.stringify({ query, variables });

  const response = await fetch(
    'https://service-api-demo.superfast.shop/api/graphql',
    {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Service API encountered an error', json.errors);
  }

  return json;
}
