export interface MessageForm{
    message: string;
    files: File[] | null;
    receiver_id: string;
    [key: string]: any;
}