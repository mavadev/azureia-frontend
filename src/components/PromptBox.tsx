import Image from 'next/image';
import { useState } from 'react';
import { assets } from '@/assets/assets';

interface PromptBoxProps {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
}

export const PromptBox = ({ isLoading, setIsLoading }: PromptBoxProps) => {
	const [prompt, setPrompt] = useState('');

	return (
		<form className={`w-full ${false ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl transition-all`}>
			<textarea
				rows={2}
				required
				value={prompt}
				onChange={e => setPrompt(e.target.value)}
				placeholder='Envía tu mensaje a tu asistente de IA'
				className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-sm'
			/>
			<div className='flex items-center justify-between text-sm mt-2'>
				<div className='flex items-center gap-2'>
					<p className='flex items-center gap-2 text-xs border border-gray-300/20 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
						<Image
							alt=''
							className='h-5'
							src={assets.deepthink_icon}
						/>
						General
					</p>
					<p className='flex items-center gap-2 text-xs border border-gray-300/20 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
						<Image
							alt=''
							className='h-5'
							src={assets.deepthink_icon}
						/>
						Analista QA
					</p>
					<p className='flex items-center gap-2 text-xs border border-gray-300/20 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
						<Image
							alt=''
							className='h-5'
							src={assets.deepthink_icon}
						/>
						Documento
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Image
						alt='Search Icon'
						className='h-5'
						src={assets.search_icon}
					/>
					<button className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer transition`}>
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
