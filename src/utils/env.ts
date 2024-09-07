import { z } from 'zod';

export const env = z.object({
	NODE_ENV: z.string().default('development'),
	PORT: z.string(),
	// Redis configuration
	CACHE_ENV: z.string().optional(),
	REDIS_URL: z.string().optional(),
	// JWT configuration
	JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof env>;

export const config = env.parse(process.env);