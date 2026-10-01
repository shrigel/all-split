import { createHash, randomBytes } from 'node:crypto';

export const generateAccessToken = () => randomBytes(32).toString('base64url');

export const hashAccessToken = (token) => createHash('sha256').update(token).digest('hex');