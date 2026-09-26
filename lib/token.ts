import { SignJWT, jwtVerify } from 'jose';
import { SESSION_MAX_AGE } from './constants';
import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
// Uses only `jose`, so it is safe to import in middleware (Edge runtime).
// Do NOT import mongoose or bcryptjs here.

export interface SessionPayload {
    adminId: string;
    tokenVersion: number;
}

function getSecret(): Uint8Array {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 20) {
        throw new Error('AUTH_SECRET is missing or too short (min 20 characters)');
    }
    return new TextEncoder().encode(secret);
}

/** Create a signed token: const token = await signToken({ adminId, tokenVersion }) */
export async function signToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ tokenVersion: payload.tokenVersion })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(payload.adminId)
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(getSecret());
}

/** Validate a token. Returns the payload, or null if invalid / expired / tampered. */
export async function verifyToken(
    token: string | undefined | null,
): Promise<SessionPayload | null> {
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });

        if (typeof payload.sub !== 'string' || typeof payload.tokenVersion !== 'number') {
            return null;
        }

        return { adminId: payload.sub, tokenVersion: payload.tokenVersion };
    } catch {
        return null;
    }
}

interface ConfirmationToken {
    token: string;
    hash: string;
}

export function generateConfirmationToken(): ConfirmationToken {
    const token = randomBytes(32).toString('hex');

    const hash = createHash('sha256').update(token).digest('hex');

    return {
        token,
        hash,
    };
}

export function hashConfirmationToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}
