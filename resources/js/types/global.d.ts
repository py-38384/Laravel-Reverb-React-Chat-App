import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
interface TypingUser{ 
    name: string, 
    id: string, 
    image: string
}
type TypingState = {
    conversation_id: string;
    message: string;
    sender_id: string;
    type: string;
    user: TypingUser;
    text_length: number
} | null;