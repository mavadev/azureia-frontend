import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

import { assets } from '@/assets/assets';
import { Message } from '@/interfaces/Message';
import { ChatItem, chatTypes } from '@/interfaces/Chat';
import { useAppContext } from '@/context/AppContext';

interface PromptBoxProps {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
}

export const PromptBox = ({ isLoading, setIsLoading }: PromptBoxProps) => {
	const { user } = useUser();
	const [prompt, setPrompt] = useState<string>('');
	const { selectedChat, setSelectedChat, sendPromptToAI, type, setType } = useAppContext();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendPrompt();
		}
	};

	const sendPrompt = async () => {
		const promptCopy = prompt;

		try {
			if (!promptCopy) return toast.error('No puedes enviar un mensaje vacío');
			if (!user) return toast.error('Inicia sesión para enviar un mensaje');
			if (isLoading) return toast.error('Debes esperar a que termine tu petición');
			if (!selectedChat) return toast.error('No hay chat seleccionado');

			setIsLoading(true);
			setPrompt('');

			// Prompt del usuario
			const userPrompt: Message = {
				role: 'user',
				content: promptCopy,
				timestamp: Date.now(),
			};
			setSelectedChat((prev: ChatItem | null) => (prev ? { ...prev, messages: [...prev.messages, userPrompt] } : null));

			// Respuesta de la IA
			const { message, title } = await sendPromptToAI(selectedChat._id, promptCopy, type);
			setSelectedChat((prev: ChatItem | null) => (prev ? { ...prev, messages: [...prev.messages, message] } : null));

			// Renombrar titulo del chat con conversación
			setSelectedChat((prev: ChatItem | null) =>
				prev
					? {
							...prev,
							name: title,
					  }
					: null
			);

			// Mensaje de la IA
			const assistantTimestamp = Date.now();
			let assistantMessage: Message = {
				role: 'assistant',
				content: '',
				timestamp: assistantTimestamp,
			};

			// Finalizar petición
			setIsLoading(false);

			// Separar el mensaje en tokens
			const messageTokens = message.content.split(' ');
			messageTokens.forEach((_, i) => {
				setTimeout(() => {
					assistantMessage = {
						...assistantMessage,
						content: messageTokens.slice(0, i + 1).join(' '),
					};

					setSelectedChat((prev: ChatItem | null) =>
						prev
							? {
									...prev,
									messages: [...prev.messages.slice(0, -1), assistantMessage],
							  }
							: null
					);
				}, i * 100);
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Error al enviar el mensaje');
			setPrompt(promptCopy);
		}
	};

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				sendPrompt();
			}}
			className={`w-full mb-4 ${
				(selectedChat?.messages?.length ?? 0) > 0 ? 'max-w-3xl' : 'max-w-2xl'
			} bg-[#404045] p-4 rounded-3xl transition-all`}>
			<textarea
				rows={3}
				required
				value={prompt}
				onKeyDown={handleKeyDown}
				onChange={e => setPrompt(e.target.value)}
				placeholder='Envía tu mensaje a tu asistente de IA'
				className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-sm leading-6'
			/>

			<div className='flex items-center justify-between text-sm mt-2'>
				<div className='flex items-center gap-2'>
					{chatTypes.map(({ label, value }) => (
						<button
							key={label}
							type='button'
							onClick={() => {
								setType(value);
							}}
							className={`flex items-center gap-2 text-xs border border-gray-300/10 px-3 py-1 rounded-full cursor-pointer transition ${
								type === value ? 'bg-[#910045]/80 hover:bg-[#910045]' : 'bg-black/20'
							}`}>
							<Image
								alt=''
								className='h-5'
								src={assets.deepthink_icon}
							/>{' '}
							{label}
						</button>
					))}
				</div>

				<div className='flex items-center gap-2'>
					<Image
						alt='Search Icon'
						className='h-5'
						src={assets.search_icon}
					/>
					<button
						type='submit'
						className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer transition`}>
						<Image
							alt='Pin Icon'
							className='w-3.5 aspect-square'
							src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
						/>
					</button>
				</div>
			</div>
		</form>
	);
};
