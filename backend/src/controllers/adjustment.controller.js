import { getAccessToken } from "../utils/bearerToken.js";
import { createHttpError } from "../utils/httpError.js";
import {
    createAdjustment as createAdjustmentService,
    updateAdjustment as updateAdjustmentService,
    deleteAdjustment as deleteAdjustmentService
} from "../services/adjustment.service.js";

export const createAdjustment = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, type, amount, allocationType } = req.validated.body;
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

        const adjustment = await createAdjustmentService(id, accessToken, name, type, amount, allocationType);

        if (!adjustment) {
            return next(
                createHttpError(
                    404,
                    "BILL_NOT_FOUND",
                    "Bill not found"
                )
            );
        }

        res.status(201).json({
            data: adjustment
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdjustment = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, type, amount, allocationType } = req.validated.body;
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

        const adjustment = await updateAdjustmentService(id, accessToken, name, type, amount, allocationType);

        if (!adjustment) {
            return next(
                createHttpError(
                    404,
                    "ADJUSTMENT_NOT_FOUND",
                    "Adjustment not found"
                )
            );
        }

        res.status(200).json({
            data: adjustment
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAdjustment = async (req, res, next) => {
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

        const deleted = await deleteAdjustmentService(id, accessToken);

        if (!deleted) {
            return next(
                createHttpError(
                    404,
                    "ADJUSTMENT_NOT_FOUND",
                    "Adjustment not found"
                )
            );
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};