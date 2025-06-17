import Prism from 'prismjs';
import Image from 'next/image';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

import { assets } from '@/assets/assets';
import { Role } from '@/interfaces/Message';

interface MessageProps {
	role: Role;
	content: string;
}

export const Message = ({ role, content }: MessageProps) => {
	useEffect(() => {
		Prism.highlightAll();
	}, [content]);

	const copyMessage = async () => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success('Mensaje copiado al portapapeles');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Error al copiar');
		}
	};

	return (
		<div className='flex flex-col items-center w-full max-w-3xl text-sm'>
			<div className={`flex flex-col w-full mb-8 ${role === 'user' ? 'items-end' : ''}`}>
				<div
					className={`group relative flex max-w-2xl py-3 rounded-xl ${
						role === 'user' ? 'bg-[#414158] px-5' : 'gap-4'
					}`}>
					<div
						className={`opacity-0 group-hover:opacity-100 absolute ${
							role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'
						} transition-all`}>
						<div className='flex items-center gap-2 opacity-70'>
							{role === 'user' ? (
								<>
									<Image
										alt=''
										className='w-4 cursor-pointer'
										onClick={copyMessage}
										src={assets.copy_icon}
									/>
									<Image
										alt=''
										className='w-4 cursor-pointer'
										src={assets.pencil_icon}
									/>
								</>
							) : (
								<>
									<Image
										alt=''
										className='w-4.5 cursor-pointer'
										onClick={copyMessage}
										src={assets.copy_icon}
									/>
									<Image
										alt=''
										className='w-4.5 cursor-pointer'
										src={assets.regenerate_icon}
									/>
									<Image
										alt=''
										className='w-4.5 cursor-pointer'
										src={assets.like_icon}
									/>
									<Image
										alt=''
										className='w-4.5 cursor-pointer'
										src={assets.dislike_icon}
									/>
								</>
							)}
						</div>
					</div>

					{role === 'user' ? (
						<span className='text-white/90'>{content}</span>
					) : (
						<>
							<Image
								alt=''
								src={assets.logo_icon}
								className='h-9 w-9 p-1 border border-white/15 rounded-full bg-red-100'
							/>
							<div className='space-y-4 w-full overflow-auto leading-6'>
								<Markdown>{content}</Markdown>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
