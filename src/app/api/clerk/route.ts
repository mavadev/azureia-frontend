import { Webhook } from 'svix';
import connectDB from '@/config/db';
import User from '@/models/User';
import { headers } from 'next/headers';

export async function POST(req: Request) {
	const wh = new Webhook(process.env.SIGNING_SECRET!);

	// Obtenemos los headers de la petición
	const headerPayload = await headers();
	const svixHeaders = {
		'svix-id': headerPayload.get('svix-id')!,
		'svix-signature': headerPayload.get('svix-signature')!,
	};

	// Verificamos la firma de la petición
	const payload = await req.json();
	const body = JSON.stringify(payload);
	const { data, type } = wh.verify(body, svixHeaders) as { data: any; type: string };

	// Creamos el objeto de usuario
	const userData = {
		_id: data.id,
		name: `${data.first_name} ${data.last_name}`,
		email: data.email_adresses[0].email_address,
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
			await User.findOneAndDelete(data.id);
			break;

		default:
			break;
	}

	return Response.json({ message: 'Event received' });
}
