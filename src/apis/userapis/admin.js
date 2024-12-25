// JWT에서 role 확인하는 함수
export const checkAdminPermission = () => {
    const token = localStorage.getItem('access'); // JWT 가져오기
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // payload 디코딩
      return payload.isStaff;
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
      return false;
    }
  };
  