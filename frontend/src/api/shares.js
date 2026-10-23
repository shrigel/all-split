import { apiRequest } from "./client";

export const createResultShare = (id, token) =>
    apiRequest(`/api/splits/${id}/result-shares`, {
        method: 'POST',
        token,
    });

export const getResultShare = (shareToken) =>
    apiRequest(`/api/result-shares/${shareToken}`);