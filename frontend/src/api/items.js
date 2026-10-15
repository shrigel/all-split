import { apiRequest } from "./client";

export const createItem = (billId, token, name, quantity, unitPrice) =>
    apiRequest(`/api/bills/${billId}/items`, {
        method: 'POST',
        token,
        body: JSON.stringify({ name, quantity, unitPrice }),
    });

export const updateItem = (id, token, name, quantity, unitPrice) =>
    apiRequest(`/api/items/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ name, quantity, unitPrice }),
    });

export const deleteItem = (id, token) =>
    apiRequest(`/api/items/${id}`, {
        method: 'DELETE',
        token,
    });