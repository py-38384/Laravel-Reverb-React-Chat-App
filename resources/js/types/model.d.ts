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
    is_pending: boolean,
    is_accepted: boolean,
    is_blocked: boolean,
}
export interface Image{
    id: string,
    message_id: number,
}
export interface Message{
    created_at: string,
    created_at_human: string,
    created_at_human_24h: string,
    files: null | string,
    images: Image[],
    id: number
    is_read: boolean,
    message: null | string,
    receiver_id: string,
    sender_id: string
    updated_at: string
}
export interface Conversations{
    id: string,
    created_at: string,
    last_message: Message,
    pivot: {
        user_id: string,
        conversation_id: number,
    },
    type: string,
    users: User[],
}