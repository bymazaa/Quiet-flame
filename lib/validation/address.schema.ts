import { z } from 'zod';

/* /api/address/suggest?q=... (server only) */
export const addressSuggestQuerySchema = z.object({
    q: z.string().trim().min(3, 'Type at least 3 characters').max(100, 'Search is too long'),
});

export type AddressSuggestQuery = z.infer<typeof addressSuggestQuerySchema>;
