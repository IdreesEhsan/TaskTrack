// Base URL of our backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// One shared helper function for every API call, built on the browers native fetch()
async function request(endpoint, options = {}) {
    
    const token = localStorage.getItem('token');

    const headers = {
        'Content-type': "application/json",
        ...options.headers,
    };

    // Attach the token as Bearer heaader so the backend's auth middleware can identify the logged-in user.
    if (token) {
        headers.Authorization = 'Bearer ${token}';
    }

    const res = await fetch ('${BASE_URL}${endpoint}', {
        ...options,
        headers,
    });

    // fetch() does NOT throw on 4xx/5xx like some libraries do, so we manually check res.ok and pull the error message from the body.
    if (!res.ok) {
        let message = "Something went wrong";
        try {
            const data = await res.json();
            message = data.message || message;
        } catch {
            // no JSON body in the error response, keep the default message
        }

        // If the token is invalid/expired, clear the session
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        throw new Error(message);
    }

    // DELETE requests may return an empty body
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

// Small wrapper functions, one per HTTP verb (REST conventions)
export const api = {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};