import { apiRequest } from "./client";

export const createAdjustment = (billId, token, name, type, amount, allocationType) =>
    apiRequest(`/api/bills/${billId}/adjustments`, {
        method: 'POST',
        token,
        body: JSON.stringify({ name, type, amount, allocationType }),
    });

export const updateAdjustment = (id, token, name, type, amount, allocationType) =>
    apiRequest(`/api/adjustments/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ name, type, amount, allocationType }),
    });

export const deleteAdjustment = (id, token) =>
    apiRequest(`/api/adjustments/${id}`, {
        method: 'DELETE',
        token,
    });