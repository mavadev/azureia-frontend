'use client';
import { useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import { createContext, useContext, PropsWithChildren } from 'react';

export const AppContext = createContext<{ user: UserResource | null | undefined }>({ user: undefined });

export const useAppContext = () => {
	return useContext(AppContext);
};

export const AppContextProvider = ({ children }: PropsWithChildren) => {
	const { user } = useUser();

	const value = {
		user,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
