import { apiRequest } from "./client";

export const updateItemShares = (itemId, token, participantIds) =>
    apiRequest(`/api/items/${itemId}/shares`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ participantIds }),
    });