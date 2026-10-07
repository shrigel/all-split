import { getAccessToken } from "../utils/bearerToken.js";
import {
    createBill as createBillService,
    getBills as getBillsService,
    updateBill as updateBillService,
    deleteBill as deleteBillService,
} from "../services/bill.service.js";
import { createHttpError } from "../utils/httpError.js";

export const createBill = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, payerId } = req.validated.body;
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

        const bill = await createBillService(id, accessToken, name, payerId);

        if (!bill) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        if (bill.reason) {
            return next(
                createHttpError(
                    400,
                    bill.reason,
                    "Payer must be a participant of this split"
                )
            );
        }

        res.status(201).json({
            data: bill
        });
    } catch (error) {
        next(error);
    }
};

export const getBills = async (req, res, next) => {
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

        const bills = await getBillsService(id, accessToken);

        if (!bills) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        res.status(200).json({
            data: bills
        });
    } catch (error) {
        next(error);
    }
};

export const updateBill = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const { name, payerId } = req.validated.body;
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

        const bill = await updateBillService(id, accessToken, name, payerId);

        if (!bill) {
            return next(
                createHttpError(
                    404,
                    "BILL_NOT_FOUND",
                    "Bill not found"
                )
            );
        }

        if (bill.reason) {
            return next(
                createHttpError(
                    400,
                    bill.reason,
                    "Payer must be a participant of this split"
                )
            );
        }

        res.status(200).json({
            data: bill
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBill = async (req, res, next) => {
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

        const deleted = await deleteBillService(id, accessToken);

        if (!deleted) {
            return next(
                createHttpError(
                    404,
                    "BILL_NOT_FOUND",
                    "Bill not found"
                )
            );
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};