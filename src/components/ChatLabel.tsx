import { assets } from '@/assets/assets';
import Image from 'next/image';

interface ChatLabelProps {
	openMenu: { id: number; open: boolean };
	setOpenMenu: (openMenu: { id: number; open: boolean }) => void;
}

export const ChatLabel = ({ openMenu }: ChatLabelProps) => {
	return (
		<div className='flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer'>
			<p className='group-hover:max-w-5/6 truncate'>Nombre del Chat</p>
			<div className='group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg'>
				<Image
					alt='three dots !='
					src={assets.three_dots}
					className={`w-4 ${openMenu.open ? '' : 'hidden'} group-hover:block`}
				/>
				<div
					className={`absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2 ${openMenu.open ? 'block' : 'hidden'}`}>
					<div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
						<Image
							alt='pencil icon'
							className='w-4'
							src={assets.pencil_icon}
						/>
						<p>Renombrar</p>
					</div>
					<div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
						<Image
							alt='pencil icon'
							className='w-4'
							src={assets.delete_icon}
						/>
						<p>Eliminar</p>
					</div>
				</div>
			</div>
		</div>
	);
};
