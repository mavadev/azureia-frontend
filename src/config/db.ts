import mongoose, { Connection } from 'mongoose';

interface MongooseCache {
	conn: Connection | null;
	promise: Promise<Connection> | null;
}

declare global {
	interface GlobalThis {
		mongoose?: MongooseCache;
	}
}

const cached: MongooseCache = (globalThis as GlobalThis).mongoose ?? { conn: null, promise: null };

export default async function connectDB(): Promise<Connection> {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(process.env.MONGODB_URI!).then(mongoose => mongoose.connection);
	}

	try {
		cached.conn = await cached.promise;
		(globalThis as GlobalThis).mongoose = cached;
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}

	return cached.conn;
}
