export const STORAGE_KEYS = {
    CURRENT_SESSION: 'allsplit_current_session',
    SAVED_SESSIONS: 'allsplit_saved_sessions',
};

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

        if (!saved) return fallback;

        return JSON.parse(saved);
    } catch (error) {
        console.error(`Gagal membaca ${key} dari localStorage:`, error);

        return fallback;
    }
};