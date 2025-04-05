/**
 * Only if we use external api rather than default server api of next.js
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const response = await fetch(url, fetchOptions);

    if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    }

    if (!response.ok) {
        throw new Error('API request failed');
    }

    return response;
}