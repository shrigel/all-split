export const STORAGE_KEY_SPLIT_REFERENCES = 'allsplit_split_references';

const getStorage = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }
    return window.localStorage;
};

export const getSplitReferences = () => {
    const storage = getStorage();
    if (!storage) return [];

    try {
        const raw = storage.getItem(STORAGE_KEY_SPLIT_REFERENCES);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed;
    } catch {
        console.error('Gagal mem-parse riwayat reference split dari storage. Menggunakan fallback array kosong.');
        return [];
    }
};

export const getSplitReference = (splitId) => {
    if (!splitId) return null;
    const references = getSplitReferences();
    return references.find((ref) => ref.splitId === splitId) || null;
};

const saveReferences = (references) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.setItem(STORAGE_KEY_SPLIT_REFERENCES, JSON.stringify(references));
    } catch {
        console.error('Gagal menyimpan riwayat reference split ke storage.');
    }
};

export const upsertSplitReference = (reference) => {
    if (!reference || !reference.splitId || !reference.accessToken) {
        return getSplitReferences();
    }

    const cleanEntry = {
        splitId: String(reference.splitId),
        accessToken: String(reference.accessToken),
        name: reference.name ?? '',
        expiresAt: reference.expiresAt ?? null,
    };

    const currentReferences = getSplitReferences();
    const existingIndex = currentReferences.findIndex((ref) => ref.splitId === cleanEntry.splitId);

    let updatedReferences;
    if (existingIndex >= 0) {
        updatedReferences = [
            cleanEntry,
            ...currentReferences.filter((_, idx) => idx !== existingIndex),
        ];
    } else {
        updatedReferences = [cleanEntry, ...currentReferences];
    }

    saveReferences(updatedReferences);
    return updatedReferences;
};

export const removeSplitReference = (splitId) => {
    if (!splitId) return getSplitReferences();

    const currentReferences = getSplitReferences();
    const filtered = currentReferences.filter((ref) => ref.splitId !== splitId);

    saveReferences(filtered);
    return filtered;
};

export const clearSplitReferences = () => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.removeItem(STORAGE_KEY_SPLIT_REFERENCES);
    } catch {
        console.error('Gagal membersihkan riwayat reference split dari storage.');
    }
};
