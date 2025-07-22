export interface User{
    created_at: string,
    email: string,
    email_verified_at: string,
    id: string,
    name: string,
    updated_at: string,
    unreadMessage: number,
    lastMessage: Message,
    image: string,
}
export interface Message{
    created_at: string,
    created_at_human: string,
    created_at_human_24h: string,
    files: null | string,
    id: number
    is_read: boolean,
    message: null | string,
    receiver_id: string,
    sender_id: string
    updated_at: string
}
export interface MessageEvent{
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
}