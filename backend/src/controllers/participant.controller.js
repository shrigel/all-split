import { getAccessToken } from "../utils/bearerToken.js";
import {
    createParticipant as createParticipantService,
    updateParticipant as updateParticipantService,
    deleteParticipant as deleteParticipantService
} from "../services/participant.service.js";
import { createHttpError } from "../utils/httpError.js";

export const createParticipant = async (req, res, next) => {
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

        const participant = await createParticipantService(id, accessToken, name);

        if (!participant) {
            return next(
                createHttpError(
                    404,
                    "SPLIT_NOT_FOUND",
                    "Split session not found"
                )
            );
        }

        res.status(201).json({
            data: participant
        });
    } catch (error) {
        next(error);
    }
};

export const updateParticipant = async (req, res, next) => {
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

        const participant = await updateParticipantService(id, accessToken, name);

        if (!participant) {
            return next(
                createHttpError(
                    404,
                    "PARTICIPANT_NOT_FOUND",
                    "Participant not found"
                )
            );
        }

        res.status(200).json({
            data: participant
        });
    } catch (error) {
        next(error);
    }
};

export const deleteParticipant = async (req, res, next) => {
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

        const deleted = await deleteParticipantService(id, accessToken);

        if (!deleted) {
            return next(
                createHttpError(
                    404,
                    "PARTICIPANT_NOT_FOUND",
                    "Participant not found"
                )
            );
        }

        if (deleted.reason) {
            return next(
                createHttpError(
                    409,
                    deleted.reason,
                    "Participant is still in use"
                )
            );
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};