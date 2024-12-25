import React, { useState } from 'react';  // React와 useState 훅을 import
import { Modal, Button, Form } from 'react-bootstrap';  // React-Bootstrap에서 Modal, Button, Form 컴포넌트를 import
import axios from 'axios';  // axios를 import (API 요청용)
import './ProductRegistrationModal.css';  // 스타일을 위한 CSS 파일 import

// 기본적으로 제공될 옵션들 (커스터마이징 옵션들)
const defaultCustomOptions = [
  { optionName: 'isIce', optionPrice: '0', key: 'isIce', isToggle: true },
  { optionName: 'Large Size', optionPrice: '500', key: 'isLarge', isToggle: true },
  { optionName: 'Extra Shot', optionPrice: '500', key: 'extraShot' },
  { optionName: 'Vanilla Syrup', optionPrice: '300', key: 'vanillaSyrup' },
  { optionName: 'Hazelnut Syrup', optionPrice: '300', key: 'hazelnutSyrup' },
  { optionName: 'Caramel Syrup', optionPrice: '300', key: 'caramelSyrup' },
  { optionName: 'Extra Tea Bag', optionPrice: '500', key: 'extraTeaBag' },
  { optionName: 'Add Whipped Cream', optionPrice: '500', key: 'addWhippedCream' },
  { optionName: 'Add Pearl', optionPrice: '500', key: 'addPearl' }
];

// 상품 등록 모달 컴포넌트
function ProductRegistrationModal({ show, onHide, onProductAdded }) {
  // 카테고리 목록 (상품 카테고리 선택용)
  const categories = [
    '시즌한정', '커피·더치', '논커피 라떼', '프라페·스무디',
    '밀크쉐이크', '에이드·주스', '티', '디저트', 'MD상품'
  ];

  // 상품 등록 폼 상태 관리
  const [productForm, setProductForm] = useState({
    productName: '',  // 상품명
    price: '',  // 가격
    category: '',  // 카테고리
    customOptions: defaultCustomOptions,  // 기본 옵션 리스트
  });

  // 파일 업로드 상태 (이미지 파일 선택 및 미리보기)
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 파일 선택 처리 함수
  const handleFileSelect = (e) => {
    const file = e.target.files[0];  // 선택된 파일을 가져옴
    if (file) {
      setSelectedFile(file);  // 파일 상태 업데이트
      setPreview(URL.createObjectURL(file));  // 미리보기 이미지 생성
    }
  };

  // 추가 옵션 버튼 클릭 시 옵션 추가 함수
  const handleAddCustomOption = () => {
    setProductForm(prev => ({
      ...prev,
      customOptions: [...prev.customOptions, { optionName: '', optionPrice: '', key: '' }]  // 새로운 빈 옵션 추가
    }));
  };

  // 옵션 삭제 함수
  const handleRemoveCustomOption = (index) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, i) => i !== index)  // 해당 인덱스의 옵션 삭제
    }));
  };

  // 옵션 값 변경 처리 함수
  const handleCustomOptionChange = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [field]: value,  // 필드에 해당하는 값만 업데이트
            key: field === 'optionName' ? value.replace(/\s+/g, '').toLowerCase() : option.key  // 옵션 이름을 key로 변환
          };
        }
        return option;  // 다른 옵션은 그대로 반환
      })
    }));
  };

  // 모달 닫기 및 상태 초기화 함수
  const handleClose = () => {
    setProductForm({
      productName: '',
      price: '',
      category: '',
      customOptions: defaultCustomOptions  // 기본 옵션으로 리셋
    });
    setSelectedFile(null);  // 파일 선택 초기화
    setPreview(null);  // 미리보기 초기화
    onHide();  // 부모 컴포넌트의 onHide 호출 (모달 닫기)
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();  // 기본 폼 제출 동작을 막음
    const formData = new FormData();  // 폼 데이터를 FormData 객체로 생성

    try {
      // 상품 데이터 준비
      const productData = {
        productName: productForm.productName,  // 상품명
        price: parseInt(productForm.price),  // 가격 (숫자로 변환)
        category: productForm.category,  // 카테고리
        options: productForm.customOptions.map(opt => ({
          optionName: opt.optionName,  // 옵션명
          optionPrice: parseInt(opt.optionPrice),  // 옵션 가격 (숫자로 변환)
          isToggle: opt.isToggle || false,  // 옵션이 토글인지 여부 (기본값 false)
          key: opt.key  // 옵션의 고유 키
        }))
      };

      // 상품 데이터를 JSON 형식으로 변환하여 formData에 추가
      formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('image', selectedFile);  // 이미지 파일 추가
      }

      // 로컬 스토리지에서 access token을 가져옴
      const access = localStorage.getItem('access');
      
      // 서버에 POST 요청을 보내어 상품 등록
      await axios.post('http://localhost:8080/products', formData, {
        headers: {
          access,  // access token
          'Content-Type': 'multipart/form-data'  // multipart/form-data 타입으로 요청
        }
      });

      onProductAdded();  // 상품 추가가 완료되었으므로 부모 컴포넌트에 알림
      handleClose();  // 모달 닫기
    } catch (error) {
      console.error('Error:', error);
      alert('상품 등록 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류'));
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}  // 모달 닫을 때 handleClose 호출
      dialogClassName="modal-custom"  // 사용자 정의 모달 클래스
      backdrop="static"  // 모달 외부 클릭 시 모달이 닫히지 않도록 설정
      keyboard={false}  // 키보드 입력으로 모달 닫히지 않도록 설정
    >
      <Modal.Header closeButton>
        <Modal.Title>상품 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="product-form">
          <Form.Group className="mb-3">
            <Form.Label>상품명</Form.Label>
            <Form.Control
              type="text"
              value={productForm.productName}
              onChange={(e) => setProductForm({...productForm, productName: e.target.value})}  // 상품명 변경 시 상태 업데이트
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>가격</Form.Label>
            <Form.Control
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}  // 가격 변경 시 상태 업데이트
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}  // 카테고리 변경 시 상태 업데이트
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="image-upload-container">
            <div className="file-input-wrapper">
              <Form.Label className="mb-0">이미지</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}  // 이미지 파일 선택 시 처리 함수 호출
              />
            </div>
            {preview && (
              <div className="preview-container">
                <img
                  src={preview}
                  alt="미리보기"
                  className="preview-image"  // 이미지 미리보기
                />
              </div>
            )}
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">추가 옵션</Form.Label>
              <Button 
                variant="link" 
                onClick={handleAddCustomOption}  // 옵션 추가 버튼 클릭 시 처리 함수 호출
                className="p-0"
              >
                + 옵션 추가
              </Button>
            </div>
            {productForm.customOptions.map((option, index) => (
              <div key={index} className="option-row">
                <Form.Control
                  type="text"
                  value={option.optionName}
                  onChange={(e) => handleCustomOptionChange(index, 'optionName', e.target.value)}  // 옵션명 변경 시 처리 함수 호출
                  className="option-name"
                />
                <Form.Control
                  type="number"
                  value={option.optionPrice}
                  onChange={(e) => handleCustomOptionChange(index, 'optionPrice', e.target.value)}  // 옵션 가격 변경 시 처리 함수 호출
                  className="option-price"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => handleRemoveCustomOption(index)}  // 옵션 삭제 버튼 클릭 시 처리 함수 호출
                  className="remove-option"
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>

          <div className="button-container">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              취소
            </Button>
            <Button variant="primary" type="submit">
              등록
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProductRegistrationModal;