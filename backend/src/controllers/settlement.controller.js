import { getAccessToken } from "../utils/bearerToken.js";
import { createHttpError } from "../utils/httpError.js";
import {
    getSettlement as getSettlementService
} from "../services/settlement.service.js";

export const getSettlement = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const accessToken = getAccessToken(req);

        if (!accessToken) {
            return next(
                createHttpError(
                    401,
                    "ACCESS_TOKEN_REQUIRED",
                    "Access token is required"
                )
            );
        }

        const result = await getSettlementService(id, accessToken);

        if (!result) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split not found"
                )
            );
        }

        if (result.error) {
            return next(
                createHttpError(
                    400,
                    result.error,
                    result.message
                )
            );
        }

        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}