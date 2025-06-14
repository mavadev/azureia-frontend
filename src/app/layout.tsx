import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';

const interFont = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

export const metadata: Metadata = {
	title: 'Leo - Modelo Azure AI',
	description: 'Full Stack Project with Next.js',
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
					<AppContextProvider>{children}</AppContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
