import { apiRequest } from "./client";

export const createParticipant = (splitId, token, name) =>
    apiRequest(`/api/splits/${splitId}/participants`, {
        method: 'POST',
        token,
        body: JSON.stringify({ name }),
    });

export const updateParticipant = (id, token, name) =>
    apiRequest(`/api/participants/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(name),
    });

export const deleteParticipant = (id, token) =>
    apiRequest(`/api/participants/${id}`, {
        method: 'DELETE',
        token,
    });