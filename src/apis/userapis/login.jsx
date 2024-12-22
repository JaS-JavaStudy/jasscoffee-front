import axios from "axios";

export const Login = async (username, password, navigate) => {
    // 로그인 요청을 POST 방식으로 보내기
    await axios.post('http://localhost:8080/login', { account: username, password }, { withCredentials: true })  // API 엔드포인트 URL로 수정
        .then(response => {
            // 서버 응답 처리
            // 로그인 후 access 토큰 추가
            localStorage.setItem('access', response.headers.access)

            // product로 라우팅 (이곳 용도에 맞게 변경해주세요)
            navigate('/product')
            
        })
        .catch(error => {
            // 에러 처리
            console.error('로그인 실패:', error);
        });
}