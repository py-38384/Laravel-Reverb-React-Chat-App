import useCurrentUser from "./hooks/use-current-user";
import { Conversations } from "./types/model";

export const setTokenToTheLocalStorage = ($token: string) => {
    localStorage.setItem("bearerToken",$token);
    return true
}
export const getTokenFromTheLocalStorage = () => {
    return localStorage.getItem("bearerToken")
}
export const clearTokenFromTheLocalStorage = () => {
    localStorage.removeItem("bearerToken")
    return true
}
export const getTokenFromBackendAndSetToLocalStorage = async (email: string, password: string) => {
    try{
        const res = await fetch("/api/token/get",{
            method: "POST",
            headers: {
                'accept': "application/json",
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        if(res.status === 200){
            const resData = await res.json()
            if(resData.status === "success"){
                const newToken = resData.token
                setTokenToTheLocalStorage(newToken);
                return newToken;
            }
        }
    } catch(error){
        console.log(error)
    }
}
export const checkTokenValidation = async (token: string) => {
    try {
        const res = await fetch("/api/token/check",{
                method: "POST",
                headers: {
                    'accept': "application/json",
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    token: token,
                })
            })

        if(res.status === 200){
            const resData = await res.json()
            if(resData.status === "success"){
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }

}
export const getOtherUserFromPrivateChat = (conversation: Conversations) => {
    const currentUser = useCurrentUser();
    const bothUser = conversation.users
    return bothUser[0].id !== currentUser.id? bothUser[0]: bothUser[1]; 
}
export function formatTimeDifference(inputDate: Date | number | string): string {
    const date = new Date(inputDate);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = diffInSeconds / (60 * 60 * 24);

    if (diffInDays < 4) {
        const hrs = Math.floor(diffInSeconds / 3600);
        const mins = Math.floor((diffInSeconds % 3600) / 60);
        const secs = diffInSeconds % 60;

        const parts = [];
        if (hrs) parts.push(`${hrs}h`);
        if (mins) parts.push(`${mins}m`);
        if (secs || parts.length === 0) parts.push(`${secs}s`);

        return parts.join(' ') + ' ago';
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
export function getLaravelTimestamp() {
    const now = new Date();
    const iso = now.toISOString(); // e.g., "2025-08-04T16:59:02.123Z"
    const [date, time] = iso.split('.');
    const microseconds = now.getMilliseconds().toString().padStart(3, '0') + '000'; // pad to 6 digits
    return `${date}.${microseconds}Z`;
}