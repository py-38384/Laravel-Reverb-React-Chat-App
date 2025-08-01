export interface MessageForm{
    message: string;
    files: File[] | null;
    conversation_id: string;
    [key: string]: any;
}