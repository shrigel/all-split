import { openDB } from "idb";

const DB_NAME = 'allsplit_db';
const DB_VERSION = 1;

export const STORES = {
    ACTIVE_SESSION: 'activeSession',
    COMPLETED_SESSIONS: 'completedSessions',
    METADATA: 'metadata'
};

export const getDatabase = () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORES.ACTIVE_SESSION)) {
                db.createObjectStore(STORES.ACTIVE_SESSION);
            }

            if (!db.objectStoreNames.contains(STORES.COMPLETED_SESSIONS)) {
                const store = db.createObjectStore(STORES.COMPLETED_SESSIONS, {
                    keyPath: 'id'
                });

                store.createIndex('expiresAt', 'expiresAt');
            }

            if (!db.objectStoreNames.contains(STORES.METADATA)) {
                db.createObjectStore(STORES.METADATA);
            }
        }
    });
};