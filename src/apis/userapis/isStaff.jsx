import axios from "axios"

// 관리자 여부 불러오는 api
export const isStaff = async () => {
    const access = localStorage.getItem('access')
    try {

        const result = await axios.get('http://localhost:8080/staff', {
            headers: {
                access: access
            }
        })
        // 결과는 true or false 로 나옴
        return result.data;
    }
    catch (error) {
        console.error("에러 발생 삐빕삐빕", error)
        
    }
    
    
}