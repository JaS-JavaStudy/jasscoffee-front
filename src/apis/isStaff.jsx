import axios from "axios";

const isStaff = async () => {
    const access = localStorage.getItem('access')
    try {
        const result = await axios.get('http://localhost:8080/staff', {
            headers: {
                access: access
            }
        })
        return result.data;
    }
    catch (error) {
        console.error("에러 발생 삐빕삐빕", error)
        return false;
    }
}

export default isStaff;