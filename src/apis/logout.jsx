import axios from "axios"

export const logout = async (navigate) => {


    try { 
        const result = await axios.post('http://localhost:8080/logout', null, {
         withCredentials: true })
         localStorage.removeItem('access')
            navigate('/')
        return result
    }
    catch (error) {
        console.error("Refresh failed: ", error);
        throw error;
    }
}