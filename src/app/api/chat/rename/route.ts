import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

import connectDB from '@/config/db';
import Chat from '@/models/Chat';

interface RenameRequestBody {
	chatId: string;
	name: string;
}

export async function POST(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		const { chatId, name }: RenameRequestBody = await req.json();

		if (!userId) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		// Actualizar el nombre del chat
		await connectDB();
		await Chat.findOneAndUpdate({ _id: chatId, user: userId }, { name });

		return NextResponse.json({ message: 'Chat renombrado' }, { status: 200 });
	} catch (error: unknown) {
		console.error('Error al renombrar el chat:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
