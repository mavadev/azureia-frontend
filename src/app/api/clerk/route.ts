import { Webhook } from 'svix';
import { headers } from 'next/headers';

import User from '@/models/User';
import connectDB from '@/config/db';

interface ClerkWebhookData {
	id: string;
	first_name: string;
	last_name: string;
	image_url: string;
	email_addresses: { email_address: string }[];
}
type ClerkEventType = 'user.created' | 'user.updated' | 'user.deleted';

export async function POST(req: Request) {
	const svix = new Webhook(process.env.SIGNING_SECRET!);

	// Obtenemos los headers de la petición
	const headerPayload = await headers();
	const svixHeaders = {
		'svix-id': headerPayload.get('svix-id')!,
		'svix-timestamp': headerPayload.get('svix-timestamp')!,
		'svix-signature': headerPayload.get('svix-signature')!,
	};

	// Verificamos la firma de la petición
	const payload = await req.json();
	const body = JSON.stringify(payload);
	const { data, type } = svix.verify(body, svixHeaders) as {
		data: ClerkWebhookData;
		type: ClerkEventType;
	};

	// Creamos el objeto de usuario
	const userData = {
		_id: data.id,
		name: `${data.first_name} ${data.last_name}`,
		email: data.email_addresses[0].email_address,
		image: data.image_url,
	};

	// Conectamos a la base de datos
	await connectDB();

	// Según el tipo de evento, creamos, actualizamos o eliminamos el usuario
	switch (type) {
		case 'user.created':
			await User.create(userData);
			break;
		case 'user.updated':
			await User.findByIdAndUpdate(data.id, userData);
			break;
		case 'user.deleted':
			await User.findOneAndDelete({ _id: data.id });
			break;
		default:
			console.warn(`Unhandled event type: ${type}`);
			break;
	}

	return Response.json({ message: 'Event received' });
}
