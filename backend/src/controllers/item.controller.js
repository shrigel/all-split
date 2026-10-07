import { getAccessToken } from "../utils/bearerToken.js";
import { createHttpError } from "../utils/httpError.js";
import {
    createItem as createItemService,
    updateItem as updateItemService,
    deleteItem as deleteItemService
} from "../services/item.service.js";

export const createItem = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, quantity, unitPrice } = req.validated.body;
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

        const item = await createItemService(id, accessToken, name, quantity, unitPrice);

        if (!item) {
            return next(
                createHttpError(
                    404,
                    "BILL_NOT_FOUND",
                    "Bill not found"
                )
            );
        }

        res.status(201).json({
            data: item
        });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, quantity, unitPrice } = req.validated.body;
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

        const item = await updateItemService(id, accessToken, name, quantity, unitPrice);

        if (!item) {
            return next(
                createHttpError(
                    404,
                    "ITEM_NOT_FOUND",
                    "Item not found"
                )
            );
        }

        res.status(200).json({
            data: item
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
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

        const deleted = await deleteItemService(id, accessToken);

        if (!deleted) {
            return next(
                createHttpError(
                    404,
                    "ITEM_NOT_FOUND",
                    "Item not found"
                )
            );
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};