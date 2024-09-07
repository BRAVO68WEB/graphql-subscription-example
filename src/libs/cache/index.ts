import NodeCache from 'node-cache';
import * as redis from 'redis';

import { config } from '../../utils/env';

type CacheEnvironment = 'development' | 'production';

export class CacheClient {
	private static _clientMode: CacheEnvironment;
	private static _redisClient: redis.RedisClientType;
	private static _nodeClient: NodeCache;

	static get client(): redis.RedisClientType | NodeCache {
		return this._clientMode === 'production' ? this._redisClient : this._nodeClient;
	}

	static get env() {
		return this._clientMode;
	}

	static init(forceEnv?: CacheEnvironment) {
		const env = forceEnv ?? config.CACHE_ENV ?? config.NODE_ENV ?? 'development';

		if (!['development', 'production'].includes(env))
			throw new Error(
				"Invalid Caching Environment, expected - ['development', 'production'], received - " + env,
			);

		this._clientMode = env as CacheEnvironment;

		const redisUrl = config.REDIS_URL ?? '';

		if (env === 'production') {
			this._redisClient = redis.createClient({
				url: redisUrl,
				name: 'ec-cache',
			});
			this._redisClient.connect();
		}

		this._nodeClient = new NodeCache();
	}

	// expose single function to handle the client write irrespective of the underlying connections
	static async set(key: string, value: string) {
		if (this._clientMode === 'production') {
			await this._redisClient.set(key, value);
		} else {
			this._nodeClient.set(key, value);
		}
	}

	// expose single function to handle the client read irrespective of the underlying connections
	static async get(key: string): Promise<string | null> {
		return this._clientMode === 'production'
			? await this._redisClient.get(key)
			: (this._nodeClient.get(key) as string) ?? null;
	}
}