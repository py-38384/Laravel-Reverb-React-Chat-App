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