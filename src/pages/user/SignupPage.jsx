import { useState, useRef } from 'react';  // useRef를 사용하기 위해 추가
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../apis/userapis/signup';
import axios from 'axios';
import './Signuppage.css';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mmid, setMmid] = useState('');
    const [fund, setFund] = useState('');
    const [bank, setBank] = useState('');

    // 유효성 성공 변수
    const [usernameSuccess, setUsernameSuccess] = useState('');
    const [mmidSuccess, setMmidSuccess] = useState('');

    // 유효성 에러 변수
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [mmidError, setMmidError] = useState('');
    const navigate = useNavigate();

    // 각 input 요소에 대한 ref 설정 Pointing 위함
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const mmidRef = useRef(null);
    const fundRef = useRef(null);
    const bankRef = useRef(null);

    // 아이디 중복 검사
    const checkAccount = async () => {
        try {
            const response = await axios.get('http://localhost:8080/join/account', {
                params: {
                    account: username,
                }
            });
            setUsernameError('');
            setUsernameSuccess(response.data)
        } catch (error) {
            setUsernameSuccess('')
            if (error.response) {
                setUsernameError(error.response.data);  // 서버의 에러 메시지를 상태에 저장
                if (error.response.data) {
                    usernameRef.current.focus()
                }
            } else {
                setError('알 수 없는 오류가 발생했습니다. 싸피 회장 권남희한테 문의 부탁드립니다.');
            }
        }
    };
    // MMID 중복 검사
    const checkMmid = async () => {
        try {
            const response = await axios.get('http://localhost:8080/join/mmid', {
                params: {
                    mmid: mmid,
                }
            });

            setMmidError('');
            setMmidSuccess(response.data);
        } catch (error) {
            setMmidSuccess('')
            if (error.response) {
                setMmidError(error.response.data);  // 서버의 에러 메시지를 상태에 저장

                if (error.response.data) {
                    mmidRef.current.focus()
                }
            } else {
                setError('알 수 없는 오류가 발생했습니다. 싸피 회장 권남희한테 문의 부탁드립니다.');
            }
        }
    };

    // 회원가입 유효성 검사 및 포커스 이동
    const validateForm = () => {
        // 공백 금지 코드
        if (/\s/.test(name) ||
            /\s/.test(username) ||
            /\s/.test(mmid) ||
            /\s/.test(fund)) {
            setError('공백을 사용할 수 없습니다.');
            usernameRef.current.focus();  // 아이디 필드에 포커스
            return false;
        }

        // 이름 유효성 검사
        if (name.trim() === '') {
            setError('이름을 입력해주세요.');
            nameRef.current.focus();  // 이름 필드에 포커스
            return false;
        }

        // 아이디 유효성 검사
        if (username.trim() === '') {
            setError('아이디를 입력해주세요.');
            usernameRef.current.focus();  // 아이디 필드에 포커스
            return false;
        }

        // 비밀번호 유효성 검사 (8자 이상)
        if (password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            passwordRef.current.focus();  // 비밀번호 필드에 포커스
            return false;
        }

        // MMID 유효성 검사
        if (mmid.trim() === '') {
            setError('MMID를 입력해주세요.');
            mmidRef.current.focus();  // MMID 필드에 포커스
            return false;
        }

        // 은행 선택 유효성 검사
        if (bank === '') {
            setError('은행을 선택해주세요.');
            bankRef.current.focus();  // 은행 선택 필드에 포커스
            return false;
        }

        // 계좌 번호 유효성 검사
        if (fund.trim() === '') {
            setError('계좌 번호를 입력해주세요.');
            fundRef.current.focus();  // 계좌 번호 필드에 포커스
            return false;
        }

        // 모든 검사를 통과하면 에러 메시지 초기화
        setError('');
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 회원가입 유효성 검사
        if (!validateForm()) {
            return;
        }
        if (usernameSuccess == '' || mmidSuccess == '' ) {
            setError("중복체크를 해주세요.")
            return;
        }

        // 회원가입 함수 호출
        signUp(username, password, name, mmid, fund, bank, navigate)

    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <hr />
                <h1>JASS-COFFEE</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    {/* Name 입력 */}
                    <input
                        ref={nameRef}
                        className={error && name.trim() === '' ? 'error' : ''}
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
    
                    {/* Username 입력 + Check 버튼 */}
                    <div className="input-container with-button">
                        <input
                            ref={usernameRef}
                            className={usernameError ? 'error' : ''}
                            type="text"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={checkAccount}
                            className="check-button inside"
                        >
                            Check
                        </button>
                    </div>
                    {usernameError && <div className="error-text">{usernameError}</div>}
                    {usernameSuccess && <div className="success-text">{usernameSuccess}</div>}
    
                    {/* Password 입력 */}
                    <input
                        ref={passwordRef}
                        className={error && password.length < 8 ? 'error' : ''}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
    
                    {/* MMID 입력 + Check 버튼 */}
                    <div className="input-container with-button">
                        <input
                            ref={mmidRef}
                            className={
                                mmidError || (error && mmid.trim() === '') ? 'error' : ''
                            }
                            type="text"
                            placeholder="MMID"
                            value={mmid}
                            onChange={(e) => setMmid(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={checkMmid}
                            className="check-button inside"
                        >
                            Check
                        </button>
                    </div>
                    {mmidError && <div className="error-text">{mmidError}</div>}
                    {mmidSuccess && <div className="success-text">{mmidSuccess}</div>}
    
                    <hr />
                    <h1>Refund Account</h1>
                    <hr />
    
                    {/* Bank 선택 */}
                    <select
                        ref={bankRef}
                        className={error && bank === '' ? 'error' : ''}
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                    >
                        <option value="">Select Bank</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="신한은행">신한은행</option>
                        <option value="KB국민은행">KB국민은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="농협은행">농협은행</option>
                        <option value="기업은행">기업은행</option>
                        <option value="SC제일은행">SC제일은행</option>
                        <option value="우체국은행">우체국은행</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="케이뱅크">케이뱅크</option>
                        <option value="씨티은행">씨티은행</option>
                        <option value="스탠다드차타드">스탠다드차타드</option>
                        <option value="한국산업은행">한국산업은행</option>
                        <option value="수출입은행">수출입은행</option>
                        <option value="미래에셋">미래에셋</option>
                        <option value="대구은행">대구은행</option>
                        <option value="부산은행">부산은행</option>
                        <option value="제주은행">제주은행</option>
                        <option value="광주은행">광주은행</option>
                    </select>
    
                    {/* Account 입력 */}
                    <input
                        ref={fundRef}
                        className={error && fund.trim() === '' ? 'error' : ''}
                        type="text"
                        placeholder="Account Number"
                        value={fund}
                        onChange={(e) => setFund(e.target.value)}
                    />
                    {error && <div className="error-text">{error}</div>}
    
                    {/* 제출 버튼 */}
                    <button type="submit" className="submit-button">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
    
    
}

export default SignupPage;