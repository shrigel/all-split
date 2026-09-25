import { getDatabase, STORES } from "./indexedDB";

const ACTIVE_SESSION_KEY = 'current';

export const getActiveSession = async () => {
    const db = await getDatabase();

    return db.get(
        STORES.ACTIVE_SESSION,
        ACTIVE_SESSION_KEY
    );
};

export const saveActiveSession = async (session) => {
    const db = await getDatabase();

    await db.put(
        STORES.ACTIVE_SESSION,
        session,
        ACTIVE_SESSION_KEY
    );
};

export const deleteActiveSession = async () => {
    const db = await getDatabase();

    await db.delete(
        STORES.ACTIVE_SESSION,
        ACTIVE_SESSION_KEY
    );
};

export const getCompletedSessions = async () => {
    const db = await getDatabase();

    const sessions = await db.getAll(
        STORES.COMPLETED_SESSIONS
    );

    return sessions.sort(
        (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
    );
};

export const saveCompletedSession = async (session) => {
    const db = await getDatabase();

    await db.put(
        STORES.COMPLETED_SESSIONS,
        session
    );
};