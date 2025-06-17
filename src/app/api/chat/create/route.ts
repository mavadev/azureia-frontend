import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/config/db';
import Chat, { IChat } from '@/models/Chat';

export async function POST(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		// Creamos el objeto de chat
		const chatData: Partial<IChat> = {
			name: 'Nuevo Chat',
			messages: [],
			user: userId,
		};

		// Creamos y guardamos el chat en la base de datos
		await connectDB();
		const newChat = await Chat.create(chatData);

		return NextResponse.json({ message: 'Chat creado exitosamente', chat: newChat });
	} catch (error: unknown) {
		console.error('Error al crear el chat:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
