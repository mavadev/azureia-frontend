import axios from 'axios';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/config/db';
import { ChatType } from '@/interfaces/Chat';
import Chat, { IMessage } from '@/models/Chat';

// Definimos el tipo del body
interface ChatRequestBody {
	chatId: string;
	prompt: string;
	type: ChatType;
}

export async function POST(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
		}

		// Obtenemos el body
		const { chatId, prompt, type }: ChatRequestBody = await req.json();

		// Obtenemos el chat correspondiente al usuario
		await connectDB();
		const chat = await Chat.findOne({ _id: chatId, user: userId });
		if (!chat) {
			return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
		}

		// Creamos el mensaje del usuario
		const userPrompt: IMessage = {
			role: 'user',
			content: prompt,
			timestamp: new Date(),
		};
		chat.messages.push(userPrompt);

		// Llamamos a la IA para respuesta
		const { data: dataResponse } = await axios.post<{ response: string }>(`${process.env.API_URL}/chat/${type}`!, {
			user_message: prompt,
		});

		const assistantMessage: IMessage = {
			role: 'assistant',
			content: dataResponse.response,
			timestamp: new Date(),
		};
		chat.messages.push(assistantMessage);

		// Enviamos solo el mensaje tenga un titulo establecido
		if (chat.messages.length > 2) {
			// Guardamos el chat
			await chat.save();
			return NextResponse.json({ message: assistantMessage }, { status: 200 });
		}

		// Llamamos a la IA para respuesta de titulo solo si es la primera respuesta de la IA para el chat
		const { data: dataTitle } = await axios.post<{ response: string }>(`${process.env.API_URL}/chat/general`!, {
			user_message:
				dataResponse.response + '. Dime en un titulo corto para esta conversación, solo el titulo sin comillas',
		});

		chat.name = dataTitle.response;
		await chat.save();

		return NextResponse.json({ message: assistantMessage, title: dataTitle.response }, { status: 200 });
	} catch (error: unknown) {
		console.error('Error procesando el chat:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
