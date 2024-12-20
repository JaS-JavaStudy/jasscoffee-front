import axios from "axios"

export const getUser = async () => {
    const access = localStorage.getItem('access')
    try {

        const result = await axios.get('http://localhost:8080/user', {
            headers: {
                access: access
            }
        })
        return result.data;
    }
    catch (error) {
        console.error("No User")
        
    }
    
    
}