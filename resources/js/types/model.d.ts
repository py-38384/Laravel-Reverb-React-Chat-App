export interface User{
    created_at: string,
    email: string,
    email_verified_at: string,
    id: string,
    name: string,
    updated_at: string,
    unreadMessage: number
}
export interface Message{
    created_at: string,
    file_name: null | string,
    file_original_name: null | string,
    folder_path: null | string,
    id: number
    is_read: boolean,
    message: null | string,
    receiver_id: string,
    sender_id: string
    updated_at: string
}