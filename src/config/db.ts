import mongoose, { Connection } from 'mongoose';

interface MongooseCache {
	conn: Connection | null;
	promise: Promise<Connection> | null;
}

declare global {
	interface GlobalThis {
		mongooseCache?: MongooseCache;
	}
}

const globalWithCache = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };

const cache: MongooseCache = globalWithCache.mongooseCache ?? { conn: null, promise: null };
globalWithCache.mongooseCache = cache;

export default async function connectDB(): Promise<Connection> {
	if (cache.conn) return cache.conn;

	if (!cache.promise) {
		if (!process.env.MONGODB_URI) {
			throw new Error('MONGODB_URI no esta definido');
		}
		cache.promise = mongoose.connect(process.env.MONGODB_URI).then(m => m.connection);
	}

	cache.conn = await cache.promise;
	return cache.conn;
}
