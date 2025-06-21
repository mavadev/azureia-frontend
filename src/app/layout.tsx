import './prism.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';

const interFont = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export const metadata: Metadata = {
	title: 'Compartamos Banco IA',
	description: 'Full Stack Project with Next.js',
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-96x96.png',
		apple: '/apple-touch-icon.png',
	},
	manifest: '/site.webmanifest',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={`${interFont.className} antialiased`}>
					<AppContextProvider>
						<Toaster
							toastOptions={{
								success: { style: { background: 'black', color: 'white' } },
								error: { style: { background: 'black', color: 'white' } },
							}}
						/>
						{children}
					</AppContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
