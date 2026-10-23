import { getAccessToken } from "../utils/bearerToken.js";
import {
    createResultShare as createResultShareService,
    getResultShare as getResultShareService,
} from "../services/share.service.js";
import { createHttpError } from "../utils/httpError.js";

export const createResultShare = async (req, res, next) => {
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

        const result = await createResultShareService(id, accessToken);

        if (!result) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split not found"
                )
            );
        }

        res.status(201).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const getResultShare = async (req, res, next) => {
    try {
        const { shareToken } = req.validated.params;

        const result = await getResultShareService(shareToken);

        if (!result) {
            return next(
                createHttpError(
                    404,
                    "SHARE_NOT_FOUND",
                    "Share not found"
                )
            );
        }

        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}