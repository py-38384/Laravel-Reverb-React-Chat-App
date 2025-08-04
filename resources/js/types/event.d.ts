import { Conversations } from "./model";

export interface MessageObject{
    conversation: Conversations
    conversation_id: string,
    created_at: string,
    created_at_human: string,
    id: number;
    sender_id: number;
    images: {
        id: string,
    }[],
    sender: {
        id: string,
        name: string
    }
    receiver_id: number;
    message: string;
}
export interface SendMessageEvent{
    message: MessageObject
}