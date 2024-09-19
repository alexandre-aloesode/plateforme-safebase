export async function fetcher(url, method = "GET", body = null) {
  const token = localStorage.getItem("authToken");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "token": token ? token : "",
    },
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}
