const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

type ApiResponse<T> = {
    data?: T;
    error?: {
        statusCode: number;
        message: string;
        path: string;
        timestamp: string;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type Primitive = string | number | boolean;
export type ParamValue = Primitive | Primitive[];

type RequestConfig = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: object | FormData;
    headers?: Record<string, string>;
    params?: Record<string, ParamValue>;
};

export async function baseApiAction<T>(
    endpoint: string,
    config: RequestConfig = {},
): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, params } = config;

    try {
        let url = `${BASE_API_URL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();

            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        searchParams.append(key, String(v));
                    });
                } else if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });

            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.error || {
                    statusCode: response.status,
                    message: data.message ||  "An error occurred",
                    path: endpoint,
                    timestamp: new Date().toISOString(),
                },
            };
        }

        const isArray = Array.isArray(data);
        const responseData = isArray ? data : data.data;

        return {
            data: responseData,
            pagination: data.pagination
        }
    } catch (error) {
        return {
            error: {
                statusCode: 500,
                message: error instanceof Error ? error.message : "Network error",
                path: endpoint,
                timestamp: new Date().toISOString(),
            },
        };
    }
}

export const api = {
    get: <T>(endpoint: string, params?: Record<string, ParamValue>) =>
        baseApiAction<T>(endpoint, { method: "GET", params }),

    post: <T>(endpoint: string, body?: object) =>
        baseApiAction<T>(endpoint, { method: "POST", body }),

    put: <T>(endpoint: string, body?: object) =>
        baseApiAction<T>(endpoint, { method: "PUT", body }),

    patch: <T>(endpoint: string, body?: object) =>
        baseApiAction<T>(endpoint, { method: "PATCH", body }),

    delete: <T>(endpoint: string) =>
        baseApiAction<T>(endpoint, { method: "DELETE" }),
};