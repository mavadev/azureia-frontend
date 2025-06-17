import mongoose, { Schema, Document, Model } from 'mongoose';

// Exportamos el modelo de Mensaje
export interface IMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
}

// Exportamos el modelo de Chat
export interface IChat extends Document {
	name: string;
	messages: IMessage[];
	user: string;
	createdAt: Date;
	updatedAt: Date;
}

// Definimos el schema de mensaje
const MessageSchema: Schema<IMessage> = new Schema(
	{
		role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
		content: { type: String, required: true },
		timestamp: { type: Date, default: Date.now },
	},
	{ _id: false }
);

// Definimos el schema de chat
const ChatSchema: Schema<IChat> = new Schema(
	{
		name: { type: String, required: true },
		messages: { type: [MessageSchema], default: [] },
		user: { type: String, ref: 'User', required: true },
	},
	{ timestamps: true }
);

// Creamos y exportamos el modelo de Chat
export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
