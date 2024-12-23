import axios from "axios";

// 회원가입 요청 api
export const signUp = (username, password, name, mmid, fund, bank, navigate) => {
    // 회원가입 요청을 POST 방식으로 보내기
    axios.post('http://localhost:8080/join', {
        account: username,
        password,
        name,
        mmid,
        fund,
        bank,
        isStaff: false

    }, { withCredentials: true })
        .then(response => {
            // 서버 응답 처리
            console.log('회원가입 성공:', response);
            navigate('/')

        })
        .catch(error => {
            // 에러 처리
            console.error('회원가입 실패:', error);
        });
}