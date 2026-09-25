import { ApiError } from 'next/dist/server/api-utils';
import type { ZodError } from 'zod';

// Every Server Action returns this same shape, so forms can handle results uniformly.

export type ActionResult<T = undefined> =
    | { success: true; message?: string; data?: T }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** return ok("Product created successfully.") */
export function ok<T = undefined>(message?: string, data?: T): ActionResult<T> {
    return { success: true, message, data };
}

/** return fail("Something went wrong.") */
export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
    return { success: false, error, fieldErrors };
}

/** Convert Zod errors into { fieldName: ["message"] } for form display. */
export function zodFieldErrors(error: ZodError): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const key = issue.path.join('.') || 'form';
        (fieldErrors[key] ??= []).push(issue.message);
    }
    return fieldErrors;
}

/** return validationFail(parsed.error) */
export function validationFail(error: ZodError): ActionResult<never> {
    return fail('Please check the highlighted fields.', zodFieldErrors(error));
}

export function handleError(
    error: unknown,
    userMessage = 'Something went wrong. Please try again.',
) {
    console.error(error);
    return fail(userMessage);
}
