import axios from "axios"

// 토큰 재발급 api
export const refresh = async () => {

    try { 
        const result = await axios.post('http://localhost:8080/reissue', null, {
         withCredentials: true })
         localStorage.setItem('access', result.headers.access);
         
        return result
    }
    catch (error) {
        console.error("Refresh failed: ", error);
    }
}