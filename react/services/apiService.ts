// Service to interact with our FastAPI backend
import { Task } from '../types';

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
    token = newToken;
};

const getAuthHeaders = () => {
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`
    };
};

/**
 * A wrapper around fetch that automatically includes the auth token.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The fetch response promise.
 */
const fetchWithAuth = (url: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        ...getAuthHeaders(),
    };

    // Do not set Content-Type for FormData, browser does it.
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    } else {
        headers['Content-Type'] = 'application/json';
    }

    return fetch(url, { ...options, headers, credentials: 'include' });
};


// --- User Authentication ---

export const registerWithEmail = async (name:string, email: string, password: string) => {
    const response = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to register' }));
        throw new Error(errorData.detail || 'Server error');
    }
    return response.json();
};

export const loginWithEmail = async (email: string, password: string): Promise<{ access_token: string }> => {
    const response = await fetch('/auth/login', { // Login doesn't need auth token
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to log in' }));
        throw new Error(errorData.detail || 'Server error');
    }
    const data = await response.json();
    setAuthToken(data.access_token);
    return data;
};


export const fetchCurrentUser = async (): Promise<any | null> => {
    try {
        const response = await fetchWithAuth('/users/me');
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (e) {
        return null;
    }
};


// --- Task/Creation Management ---

/**
 * Creates a new generation task on the backend.
 * @param file The image file to upload.
 * @param prompt The user's text prompt.
 * @returns A promise that resolves to an object containing the task_id.
 */
export const createGenerationTask = async (file: File, prompt: string, gender: string, age_group: string): Promise<{ task_id: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', prompt);
    formData.append('gender', gender);
    formData.append('age_group', age_group);

    const response = await fetchWithAuth('/api/create_task', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to create task' }));
        throw new Error(errorData.detail || 'Server error');
    }

    return response.json();
};

/**
 * Fetches the status of a specific task from the backend.
 * @param taskId The ID of the task to check.
 * @returns A promise that resolves to a Task object.
 */
export const getTaskStatus = async (taskId: string): Promise<Task> => {
    const response = await fetchWithAuth(`/api/task_status/${taskId}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to get task status' }));
        throw new Error(errorData.detail || 'Server error');
    }

    return response.json();
};
