export const STORAGE_KEYS = {
    CURRENT_SESSION: 'allsplit_current_session',
    SAVED_SESSIONS: 'allsplit_saved_sessions',
    DATA_VERSION: 'allsplit_data_version',
};

export const CURRENT_DATA_VERSION = 2;

export const INITIAL_SESSION = {
    name: '',
    participants: [],
    bills: [],
};

export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Gagal menyimpan ${key} ke localStorage:`, error);
    }
};

export const loadFromStorage = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        return JSON.parse(saved);
    } catch (error) {
        console.error(`Gagal membaca ${key} dari localStorage:`, error);

        return fallback;
    }
};

const migrateSessionV1ToV2 = (session) => {
    if (!session) {
        return session;
    }

    const participantIds = (session.participants || []).map((participant) => participant.id);

    const migratedBills = (session.bills || []).map((bill) => ({
        ...bill,

        items: (bill.items || []).map(
            (item) => {
                const assignedIds = item.assignedParticipantIds || [];

                if (!assignedIds.includes('all')) {
                    return item;
                }

                const explicitIds = assignedIds.filter((id) => id !== 'all');

                return {
                    ...item,
                    assignedParticipantIds: [...new Set([...participantIds, ...explicitIds])]
                };
            }
        )
    }));

    return {
        ...session,
        bills: migratedBills
    };
};

const migrateStoredData = (currentSession, savedSessions, fromVersion) => {
    let migratedCurrentSession = currentSession;
    let migratedSavedSessions = savedSessions;
    let version = fromVersion;

    if (version < 2) {
        migratedCurrentSession = migrateSessionV1ToV2(migratedCurrentSession);

        migratedSavedSessions = migratedSavedSessions.map((session) => migrateSessionV1ToV2(session));

        version = 2;
    }

    return {
        currentSession: migratedCurrentSession,
        savedSessions: migratedSavedSessions,
        version
    };
};

const ensureStorageMigration = () => {
    const currentSession = loadFromStorage(STORAGE_KEYS.CURRENT_SESSION, INITIAL_SESSION);
    const savedSessions = loadFromStorage(STORAGE_KEYS.SAVED_SESSIONS, []);

    const storedVersion = Number(localStorage.getItem(STORAGE_KEYS.DATA_VERSION)) || 1;

    if (storedVersion >= CURRENT_DATA_VERSION) {
        return {
            currentSession,
            savedSessions
        };
    }

    const migrated = migrateStoredData(currentSession, savedSessions, storedVersion);

    saveToStorage(STORAGE_KEYS.CURRENT_SESSION, migrated.currentSession);

    saveToStorage(STORAGE_KEYS.SAVED_SESSIONS, migrated.savedSessions);

    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, String(migrated.version));

    return {
        currentSession: migrated.currentSession,
        savedSessions: migrated.savedSessions
    };
};

let cachedInitialData = null;

const getInitialData = () => {
    if (!cachedInitialData) {
        cachedInitialData = ensureStorageMigration();
    }

    return cachedInitialData;
};

export const loadCurrentSession = () => getInitialData().currentSession;
export const loadSavedSessions = () => getInitialData().savedSessions;

export const saveCurrentSession = (session) => {
    saveToStorage(STORAGE_KEYS.CURRENT_SESSION, session);
};

export const saveSavedSessions = (sessions) => {
    saveToStorage(STORAGE_KEYS.SAVED_SESSIONS, sessions);
};