import { getAccessToken } from "../utils/bearerToken.js";
import {
    createSplit as createSplitService,
    getSplit as getSplitService,
    updateSplit as updateSplitService,
    deleteSplit as deleteSplitService,
} from "../services/split.service.js";
import { createHttpError } from "../utils/httpError.js";

export const createSplit = async (req, res, next) => {
    try {
        const { name } = req.validated.body;

        const result = await createSplitService(name);

        res.status(201).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getSplit = async (req, res, next) => {
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

        const split = await getSplitService(id, accessToken);

        if (!split) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        res.status(200).json({
            data: split
        });
    } catch (error) {
        next(error);
    }
};

export const updateSplit = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name } = req.validated.body;
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

        const split = await updateSplitService(id, accessToken, name);

        if (!split) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        res.status(200).json({
            data: split
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSplit = async (req, res, next) => {
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

        const deleted = await deleteSplitService(id, accessToken);

        if (!deleted) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}