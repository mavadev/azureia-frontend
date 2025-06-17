import { Message } from './Message';

export interface ChatItem {
	_id: string;
	name: string;
	messages: Message[];
	user: string;
	createdAt: string;
	updatedAt: string;
}

export const chatTypes = [
	{ label: 'Documento', value: 'docs' },
	{ label: 'Analista QA', value: 'qa' },
	{ label: 'General', value: 'general' },
] as const;

export type ChatType = (typeof chatTypes)[number]['value'];
