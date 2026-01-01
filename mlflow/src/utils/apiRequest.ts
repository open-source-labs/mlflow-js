interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  response: Response;
  data: T;
}

/**
 * Utility function for making API requests to the MLflow server.
 *
 * @param baseUrl - The base URL of the MLflow server
 * @param endpoint - The API endpoint
 * @param options - Request options
 * @returns A promise that resolves to the response and data
 */
export async function apiRequest<T = any>(
  baseUrl: string,
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> {
  let url = `${baseUrl}/api/2.0/mlflow/${endpoint}`;
  const { method, body, params, headers } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, fetchOptions);
  const data = (await response.json()) as T;

  return { response, data };
}

