import mongoose, { Connection } from 'mongoose';

interface MongooseCache {
	conn: Connection | null;
	promise: Promise<Connection> | null;
}

// Extendemos el tipo global de Node
declare global {
	var mongoose: MongooseCache | undefined;
}

// Si no existe una conexión, la creamos
let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

export default async function connectDB(): Promise<Connection> {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(process.env.MONGODB_URI!).then(mongoose => mongoose.connection);
	}

	// Esperamos a que la conexión se establezca
	try {
		cached.conn = await cached.promise;
		global.mongoose = cached;
	} catch (error) {
		console.error('Error connecting to MongoDB: ', error);
	}

	// Verificamos que la conexión se haya establecido correctamente
	if (!cached.conn) throw new Error('Failed to connect to MongoDB');
	return cached.conn;
}
