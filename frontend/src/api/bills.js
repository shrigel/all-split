import { apiRequest } from "./client";

export const createBill = (splitId, token, name, payerId) =>
    apiRequest(`/api/splits/${splitId}/bills`, {
        method: 'POST',
        token,
        body: JSON.stringify({ name, payerId }),
    });

export const getBills = (splitId, token) =>
    apiRequest(`/api/splits/${splitId}/bills`, { token });

export const updateBill = (id, token, name, payerId) =>
    apiRequest(`/api/bills/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ name, payerId }),
    });

export const deleteBill = (id, token) =>
    apiRequest(`/api/bills/${id}`, {
        method: 'DELETE',
        token,
    });