import axios from "axios"

// 로그아웃 api
export const logout = async (navigate) => {

    try { 
        // withcredentials = Cookie를 포함하는 요청에 사용됨
        const result = await axios.post('http://localhost:8080/logout', null, {
         withCredentials: true })
        // 로그아웃 시 access 토큰 제거 하고 Main으로 라우팅
         localStorage.removeItem('access')
            navigate('/')
        return result
    }
    catch (error) {
        console.error("Refresh failed: ", error);
        throw error;
    }
}
