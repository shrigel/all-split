import { getAccessToken } from "../utils/bearerToken.js";
import { createHttpError } from "../utils/httpError.js";
import { updateItemShare as updateItemShareService } from "../services/itemShare.service.js";

export const updateItemShare = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { participantIds } = req.validated.body;
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

        const shares = await updateItemShareService(id, accessToken, participantIds);

        if (!shares) {
            return next(
                createHttpError(
                    404,
                    "ITEM_NOT_FOUND",
                    "Item not found"
                )
            );
        }

        if (shares.reason) {
            return next(
                createHttpError(
                    400,
                    shares.reason,
                    "Participant not found in split session"
                )
            );
        }

        res.status(200).json({
            data: shares
        })
    } catch (error) {
        next(error);
    }
};