// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    STORAGE_KEY_SPLIT_REFERENCES,
    getSplitReferences,
    getSplitReference,
    upsertSplitReference,
    removeSplitReference,
    clearSplitReferences,
} from './splitReferences';

describe('splitReferences utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('getSplitReferences', () => {
        it('returns empty array when storage is empty', () => {
            expect(getSplitReferences()).toEqual([]);
        });

        it('returns parsed references when storage has valid data', () => {
            const data = [
                {
                    splitId: 'split-1',
                    accessToken: 'token-abc',
                    name: 'Lunch with team',
                    expiresAt: '2026-10-22T00:00:00.000Z',
                },
            ];
            localStorage.setItem(STORAGE_KEY_SPLIT_REFERENCES, JSON.stringify(data));

            const result = getSplitReferences();
            expect(result).toEqual(data);
        });

        it('returns empty array fallback and logs generic error when JSON is corrupted', () => {
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            localStorage.setItem(STORAGE_KEY_SPLIT_REFERENCES, '{ corrupted_json :::');

            const result = getSplitReferences();
            expect(result).toEqual([]);
            expect(errorSpy).toHaveBeenCalled();
        });

        it('returns empty array if stored data is not an array', () => {
            localStorage.setItem(STORAGE_KEY_SPLIT_REFERENCES, JSON.stringify({ notAnArray: true }));

            const result = getSplitReferences();
            expect(result).toEqual([]);
        });
    });

    describe('getSplitReference', () => {
        it('returns null if splitId is not provided or not found', () => {
            expect(getSplitReference()).toBeNull();
            expect(getSplitReference('')).toBeNull();
            expect(getSplitReference('non-existent')).toBeNull();
        });

        it('returns the matched reference object', () => {
            const item = {
                splitId: 'split-123',
                accessToken: 'token-xyz',
                name: 'Dinner',
                expiresAt: null,
            };
            upsertSplitReference(item);

            expect(getSplitReference('split-123')).toEqual(item);
        });
    });

    describe('upsertSplitReference', () => {
        it('adds a new reference with strictly minimum metadata and discards extra properties', () => {
            const payloadWithExtra = {
                splitId: 'split-1',
                accessToken: 'token-1',
                name: 'Trip Bali',
                expiresAt: '2026-10-30T00:00:00.000Z',
                // Extra fields that should NOT be stored in reference history:
                participants: [{ id: 'p1', name: 'Alice' }],
                bills: [{ id: 'b1', amount: 50000 }],
                settlement: { total: 50000 },
            };

            const updated = upsertSplitReference(payloadWithExtra);

            expect(updated).toHaveLength(1);
            expect(updated[0]).toEqual({
                splitId: 'split-1',
                accessToken: 'token-1',
                name: 'Trip Bali',
                expiresAt: '2026-10-30T00:00:00.000Z',
            });
            expect(updated[0].participants).toBeUndefined();
            expect(updated[0].bills).toBeUndefined();
            expect(updated[0].settlement).toBeUndefined();
        });

        it('updates existing reference and moves it to the front of the list', () => {
            upsertSplitReference({ splitId: 'split-1', accessToken: 'token-1', name: 'First' });
            upsertSplitReference({ splitId: 'split-2', accessToken: 'token-2', name: 'Second' });

            // Updating split-1
            const updated = upsertSplitReference({
                splitId: 'split-1',
                accessToken: 'token-updated',
                name: 'First Updated',
            });

            expect(updated).toHaveLength(2);
            expect(updated[0].splitId).toBe('split-1');
            expect(updated[0].name).toBe('First Updated');
            expect(updated[0].accessToken).toBe('token-updated');
            expect(updated[1].splitId).toBe('split-2');
        });

        it('ignores invalid inputs gracefully', () => {
            expect(upsertSplitReference(null)).toEqual([]);
            expect(upsertSplitReference({})).toEqual([]);
            expect(upsertSplitReference({ splitId: 'split-only' })).toEqual([]);
        });
    });

    describe('removeSplitReference', () => {
        it('removes reference by splitId', () => {
            upsertSplitReference({ splitId: 'split-1', accessToken: 'token-1' });
            upsertSplitReference({ splitId: 'split-2', accessToken: 'token-2' });

            const remaining = removeSplitReference('split-1');

            expect(remaining).toHaveLength(1);
            expect(remaining[0].splitId).toBe('split-2');
            expect(getSplitReference('split-1')).toBeNull();
        });

        it('returns current references if splitId is invalid', () => {
            upsertSplitReference({ splitId: 'split-1', accessToken: 'token-1' });

            const remaining = removeSplitReference('');
            expect(remaining).toHaveLength(1);
        });
    });

    describe('clearSplitReferences', () => {
        it('removes all split references from storage', () => {
            upsertSplitReference({ splitId: 'split-1', accessToken: 'token-1' });
            expect(getSplitReferences()).toHaveLength(1);

            clearSplitReferences();
            expect(getSplitReferences()).toEqual([]);
            expect(localStorage.getItem(STORAGE_KEY_SPLIT_REFERENCES)).toBeNull();
        });
    });
});
