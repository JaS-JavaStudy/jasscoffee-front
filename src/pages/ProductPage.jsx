import React, { useEffect } from 'react'

import Layout from './Layout'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../apis/userapis/getuser'

// 테스트 페이지 (product 넣으시면 삭제 가능)
function ProductPage() {
  const navigate = useNavigate()

  useEffect(() => {

    const checkUser = async () => {
      const isUser = await getUser()

      if (isUser == null) {
        alert("Login을 하셔야해요.")
        navigate('/')
      }
    }
    checkUser()

  })
  return (
    <Layout>
      <h1>여기에 제품 넣으면 될도로로롯</h1>
    </Layout>
  )
}

export default ProductPage