import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    PORT: z
        .coerce.number()
        .int()
        .positive()
        .max(65535)
        .default(3000),

    DATABASE_URL: z
        .string()
        .min(1, 'DATABASE_URL is required'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error('Invalid env config');
    console.error(z.prettifyError(result.error));
    process.exit(1);
}

export const env = result.data;