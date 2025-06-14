import { assets } from '@/assets/assets';
import Image from 'next/image';
import { ChatLabel } from './ChatLabel';
import { useState } from 'react';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';

interface SidebarProps {
	expand: boolean;
	setExpand: (expand: boolean) => void;
}

export const Sidebar = ({ expand, setExpand }: SidebarProps) => {
	const { user } = useAppContext();
	const { openSignIn } = useClerk();
	const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

	return (
		<div
			className={`flex flex-col justify-between bg-[#212327] py-7 transition-all z-50 max-md:absolute max-md:h-screen ${
				expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'
			}`}>
			<div>
				<div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
					<Image
						alt=''
						className={`${expand ? 'w-36' : 'w-10 p-1 bg-red-100'} rounded-xl`}
						src={expand ? assets.logo_text : assets.logo_icon}
					/>
					<div
						onClick={() => setExpand(!expand)}
						className='group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
						<Image
							alt=''
							className='md:hidden'
							src={assets.menu_icon}
						/>
						<Image
							alt=''
							className='hidden md:block w-7'
							src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
						/>
						<div
							className={`absolute w-max ${
								expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'
							} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}>
							{expand ? 'Close sidebar' : 'Open sidebar'}
							<div
								className={`w-3 h-3 absolute bg-black rotate-45 ${
									expand ? 'left-1/2 -top-1.5 -translate-x-1/2' : 'left-4 -bottom-1.5'
								}`}></div>
						</div>
					</div>
				</div>

				<button
					className={`mt-8 flex items-center  cursor-pointer ${
						expand
							? 'bg-primary hover:opacity-90 rounded-2xl gap-2 py-2.5 px-3 w-max'
							: 'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'
					}`}>
					<Image
						alt='Chat Icon'
						className={expand ? 'w-6' : 'w-7'}
						src={expand ? assets.chat_icon : assets.chat_icon_dull}
					/>
					<div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
						Nuevo Chat
						<div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
					</div>
					{expand && <p className='text-white font-medium'>Nuevo Chat</p>}
				</button>

				<div className={`mt-8 text-white/25 text-sm ${expand ? 'block' : 'hidden'}`}>
					<p className='my-1'>Recientes</p>
					<ChatLabel
						openMenu={openMenu}
						setOpenMenu={setOpenMenu}
					/>
				</div>
			</div>

			<div
				onClick={() => openSignIn()}
				className={`flex items-center ${
					expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'
				} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
				{user ? (
					<UserButton />
				) : (
					<Image
						src={assets.profile_icon}
						alt=''
						className='w-7'
					/>
				)}
				{expand && <span>Mi Perfil</span>}
			</div>
		</div>
	);
};
