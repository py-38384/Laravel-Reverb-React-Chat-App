export interface MessageForm{
    message: string;
    file: File | null;
    receiver_id: string;
    [key: string]: any;
}