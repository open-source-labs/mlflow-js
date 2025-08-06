/**
 * Utility function for making API requests to the MLflow server.
 *
 * @param baseUrl - The base URL of the MLflow server
 * @param endpoint - The API endpoint
 * @param options - Request options
 * @returns A promise that resolves to the response and data
 */
export async function apiRequest(baseUrl, endpoint, options) {
    let url = `${baseUrl}/api/2.0/mlflow/${endpoint}`;
    const { method, body, params } = options;
    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // Add MLflow tracking token if it exists
    if (process.env.MLFLOW_TRACKING_TOKEN) {
        fetchOptions.headers['Authorization'] = `Bearer ${process.env.MLFLOW_TRACKING_TOKEN}`;
    }
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }
    const response = await fetch(url, fetchOptions);
    const data = (await response.json());
    return { response, data };
}
//# sourceMappingURL=apiRequest.js.map
