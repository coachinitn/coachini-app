import { getSession, signOut } from "next-auth/react";

/**
 * Authenticated API client
 * Automatically includes authentication headers and handles token refresh
 */

// Define our own interface to avoid DOM type issues
interface ApiClientOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData | null;
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  credentials?: 'omit' | 'same-origin' | 'include';
  mode?: 'cors' | 'no-cors' | 'same-origin';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  signal?: any; // AbortSignal
  requireAuth?: boolean;
}

/**
 * Main API client function - Server-Side Proxy Approach
 * All authenticated requests go through Next.js API routes
 */
export async function apiClient(
  url: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;

  // For authenticated requests, proxy through Next.js API route
  if (requireAuth) {
    // Get the current session to check if user is authenticated
    const session = await getSession();

    if (!session) {
      await signOut({ redirect: false });
      window.location.href = "/auth/login";
      throw new Error("Authentication required");
    }

    // Proxy the request through our secure API route
    const proxyUrl = `/api/proxy${url}`;
    const response = await fetch(proxyUrl, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      await signOut({ redirect: false });
      window.location.href = "/auth/login";
      throw new Error("Authentication required");
    }

    return response;
  }

  // For non-authenticated requests, call directly
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });
}

/**
 * Convenience methods for different HTTP verbs
 */

export const api = {
  get: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: "GET" }),

  post: (url: string, data?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (url: string, data?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (url: string, data?: any, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: "DELETE" }),
};

/**
 * Typed API response handler
 */
export async function apiRequest<T>(
  url: string,
  options?: ApiClientOptions
): Promise<T> {
  const response = await apiClient(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Create enhanced error object with backend error code for i18n
    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
    error.statusCode = response.status;
    error.errorCode = errorData.errorCode; // Backend error code for i18n mapping
    error.details = errorData.details;

    throw error;
  }

  return response.json();
}

/**
 * React Query integration helpers
 */
export const apiQueries = {
  get: <T>(url: string, options?: ApiClientOptions) => ({
    queryFn: () => apiRequest<T>(url, { ...options, method: "GET" }),
  }),

  post: <T>(url: string, options?: ApiClientOptions) => ({
    mutationFn: (data: any) =>
      apiRequest<T>(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),
  }),

  put: <T>(url: string, options?: ApiClientOptions) => ({
    mutationFn: (data: any) =>
      apiRequest<T>(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      }),
  }),

  patch: <T>(url: string, options?: ApiClientOptions) => ({
    mutationFn: (data: any) =>
      apiRequest<T>(url, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  }),

  delete: <T>(url: string, options?: ApiClientOptions) => ({
    mutationFn: () => apiRequest<T>(url, { ...options, method: "DELETE" }),
  }),
};

/**
 * Server-side API client (for server components and API routes)
 */
export async function serverApiClient(
  url: string,
  options: ApiClientOptions = {},
  token?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });
}

/**
 * Upload file with authentication - uses secure proxy
 */
export async function uploadFile(
  url: string,
  file: File,
  options: ApiClientOptions = {},
  extraFields?: Record<string, string>
): Promise<Response> {
  const session = await getSession();

  if (!session) {
    await signOut({ redirect: false });
    window.location.href = "/auth/login";
    throw new Error("Authentication required");
  }

  const formData = new FormData();
  formData.append("file", file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => formData.append(k, v));
  }

  // Use the secure proxy for file uploads
  const proxyUrl = `/api/proxy${url}`;

  return fetch(proxyUrl, {
    method: "POST",
    ...options,
    // Don't set Content-Type for FormData - let browser set it with boundary
    headers: {
      ...options.headers,
    },
    body: formData,
  });
}
