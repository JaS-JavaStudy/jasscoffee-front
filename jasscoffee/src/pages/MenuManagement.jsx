// pages/MenuManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from '../components/ProductModal';

export default function MenuManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
    } catch (error) {
      console.error('메뉴 목록 조회 실패:', error);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/products/${productId}`);
      setSelectedProduct(response.data);
      setModalMode('edit');
      setShowModal(true);
    } catch (error) {
      console.error('메뉴 정보 조회 실패:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('메뉴를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('메뉴 삭제 실패:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:8080/products', formData);
      } else {
        await axios.put(`http://localhost:8080/products/${selectedProduct.productId}`, formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('메뉴 저장 실패:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>메뉴 관리</h2>
        <button 
          className="btn btn-primary"
          onClick={handleAdd}
        >
          메뉴 추가
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>메뉴명</th>
            <th>가격</th>
            <th>카테고리</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{product.category}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(product.productId)}
                >
                  수정
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.productId)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        product={selectedProduct}
        handleSubmit={handleSubmit}
        mode={modalMode}
      />
    </div>
  );
}