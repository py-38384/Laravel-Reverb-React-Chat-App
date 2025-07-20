export interface MessageForm{
    message: string;
    files: FileList | null;
    receiver_id: string;
    [key: string]: any;
}