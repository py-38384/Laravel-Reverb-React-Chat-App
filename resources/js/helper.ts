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
        console.log(error)
        return false;
    }

}