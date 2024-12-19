import React from 'react'
import { Link } from 'react-router-dom'

function MainPage() {
  return (
    <div>
        <h1>메인 페이지</h1>
        <nav>
            <ul>
                <li>
                    <Link to="/login">로그인</Link>
                </li>
                <li>
                    <Link to="/signup">회원가입</Link>
                </li>
            </ul>
        </nav>

    </div>
  )
}

export default MainPage