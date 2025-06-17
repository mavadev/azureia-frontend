'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { assets } from '@/assets/assets';
import { Message } from '@/interfaces/Message';
import { Sidebar } from '@/components/Sidebar';
import { PromptBox } from '@/components/PromptBox';
import { useAppContext } from '@/context/AppContext';
import { Message as MessageComponent } from '@/components/Message';

export default function Home() {
	const { selectedChat } = useAppContext();
	const [expand, setExpand] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (selectedChat) {
			setMessages(selectedChat.messages);
		}
	}, [selectedChat]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [messages]);

	return (
		<div className='flex h-screen'>
			<Sidebar
				expand={expand}
				setExpand={setExpand}
			/>

			<div
				className={`flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative ${
					messages.length === 0 ? 'gap-10' : ''
				}`}>
				{/* Responsive mobile header */}
				<div className='md:hidden absolute px-4 top-6 flex items-center justify-between w-full'>
					<Image
						alt='Menu Icon'
						className='rotate-180 cursor-pointer'
						onClick={() => setExpand(!expand)}
						src={assets.menu_icon}
					/>
					<Image
						alt='Chat Icon'
						className='opacity-70'
						src={assets.chat_icon}
					/>
				</div>

				{/* Messages */}
				{messages.length === 0 ? (
					<div className='flex flex-col items-center gap-4'>
						<Image
							alt='Model IA'
							src={assets.logo_icon}
							className='w-14 p-2 bg-red-100 rounded-full'
						/>
						<div>
							<h1 className='text-2xl font-medium max-w-md text-center'>
								Bienvenido, soy tu asistente de IA Compartamos Banco
							</h1>
							<p className='text-sm text-[#b1b1b1] mt-2 text-center'>Inicia una conversación conmigo</p>
						</div>
					</div>
				) : (
					<div
						ref={containerRef}
						className='relative flex flex-col items-center justify-start w-full mt-20 max-h-[80vh] overflow-y-auto pb-10'>
						<p className='fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6'>
							{selectedChat?.name}
						</p>

						{messages.map((message, index) => (
							<MessageComponent
								key={index}
								role={message.role}
								content={message.content}
							/>
						))}

						{isLoading && (
							<div className='flex gap-4 max-w-3xl w-full py-3'>
								<Image
									alt='Logo'
									className='h-9 w-9 p-1 border border-white/15 rounded-full bg-red-100'
									src={assets.logo_icon}
								/>
								<div className='loader flex justify-center items-center gap-1'>
									<div className='w-1 h-1 rounded-full bg-white animate-bounce'></div>
									<div className='w-1 h-1 rounded-full bg-white animate-bounce delay-100'></div>
									<div className='w-1 h-1 rounded-full bg-white animate-bounce delay-200'></div>
								</div>
							</div>
						)}
					</div>
				)}

				<PromptBox
					isLoading={isLoading}
					setIsLoading={setIsLoading}
				/>

				<p className='text-xs absolute bottom-5 text-gray-500'>Desarrollado por Compartamos Banco</p>
			</div>
		</div>
	);
}
