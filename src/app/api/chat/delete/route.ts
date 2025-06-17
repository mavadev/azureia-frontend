import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

import Chat from '@/models/Chat';
import connectDB from '@/config/db';

export async function POST(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		const { chatId }: { chatId: string } = await req.json();

		if (!userId) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		// Eliminar el chat por su ID y usuario
		await connectDB();
		const result = await Chat.deleteOne({ _id: chatId, user: userId });

		// Verificar si el chat fue eliminado correctamente
		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Chat no encontrado o no autorizado' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Chat eliminado exitosamente' }, { status: 200 });
	} catch (error: unknown) {
		console.error('Error al eliminar el chat:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
