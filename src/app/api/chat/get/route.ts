import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

import connectDB from '@/config/db';
import Chat from '@/models/Chat';

export async function GET(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		// Obtener los chats del usuario ordenados por fecha de actualización
		await connectDB();
		const chats = await Chat.find({ user: userId }).sort({ updatedAt: -1 });

		return NextResponse.json({ data: chats }, { status: 200 });
	} catch (error: unknown) {
		console.error('Error al obtener los chats:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
