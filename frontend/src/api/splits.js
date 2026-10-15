import { apiRequest } from "./client";

export const createSplit = (name) =>
    apiRequest('/api/splits', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });

export const getSplit = (id, token) =>
    apiRequest(`/api/splits/${id}`, { token });

export const updateSplitName = (id, token, name) =>
    apiRequest(`/api/splits/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ name }),
    });

export const deleteSplit = (id, token) =>
    apiRequest(`/api/splits/${id}`, {
        method: 'DELETE',
        token,
    });