import { apiRequest } from "./client";

export const getSettlements = (splitId, token) =>
    apiRequest(`/api/splits/${splitId}/settlements`, { token });