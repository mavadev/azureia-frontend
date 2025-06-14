'use client';
import Image from 'next/image';
import { useState } from 'react';

import { assets } from '@/assets/assets';
import { Sidebar } from '@/components/Sidebar';
import { PromptBox } from '@/components/PromptBox';
import { Message } from '@/components/Message';

export default function Home() {
	const [messages] = useState([]);
	const [expand, setExpand] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div>
			<div className='flex h-screen'>
				<Sidebar
					expand={expand}
					setExpand={setExpand}
				/>
				<div className='flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative gap-8'>
					<div className='md:hidden absolute px-4 top-6 flex items-center justify-between w-full'>
						<Image
							alt='Menu Icon'
							className='rotate-180'
							onClick={() => setExpand(!expand)}
							src={assets.menu_icon}
						/>
						<Image
							alt='Menu Icon'
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
						<div>
							<Message
								role='user'
								content='Que es Next.JS?'
							/>
						</div>
					)}

					<PromptBox
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
					<p className='text-xs absolute bottom-5 text-gray-500'> Desarrollado por Compartamos Banco</p>
				</div>
			</div>
		</div>
	);
}
