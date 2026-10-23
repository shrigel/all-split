const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL ?? '');

export async function apiRequest(path, { token, ...options } = {}) {
    const headers = new Headers(options.headers ?? {});

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 204) return null;

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            payload?.error?.message ??
            payload?.message ??
            `HTTP ${response.status}`
        );

        error.status = response.status;
        error.code = payload?.error?.code;
        error.details = payload?.error?.details;
        throw error;
    }

    return payload?.data;
}