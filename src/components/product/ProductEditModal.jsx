import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ProductRegistrationModal.css';

function ProductEditModal({ show, onHide, onProductEdited, productId }) {
  // 상품 카테고리 목록
  const categories = [
    '시즌한정', '커피·티', '논커피 라떼', '프라페·스무디',
    '밀크쉐이크', '에이드·주스', '티', '디저트', 'MD상품'
  ];

  // 상품 옵션의 기본값
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

  // 상품 폼의 상태를 관리하는 state
  const [productForm, setProductForm] = useState({
    productName: '',  // 상품명
    price: '',        // 가격
    category: '',     // 카테고리
    customOptions: defaultCustomOptions // 사용자 정의 옵션
  });
  
  // 이미지 파일 선택과 미리보기 상태를 관리하는 state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 상품 데이터 및 이미지를 불러오는 useEffect 훅
  useEffect(() => {
    const fetchProductData = async () => {
      if (productId && show) {  // 제품 ID와 모달이 열린 상태일 때만 실행
        try {
          const access = localStorage.getItem('access');  // 사용자 access 토큰 가져오기
          const response = await axios.get(`http://localhost:8080/products/${productId}`, {
            headers: { access }
          });
          
          const product = response.data;  // API에서 반환된 상품 데이터
          
          // 상품 폼 상태 설정
          setProductForm({
            productName: product.productName,
            price: product.price,
            category: product.category,
            customOptions: product.options.map(option => ({
              optionName: option.optionName,
              optionPrice: option.optionPrice.toString(),
              key: option.key,
              isToggle: option.isToggle
            }))
          });

          // 이미지가 있다면 미리보기 설정
          if (product.imageUrl) {
            const imageResponse = await axios.get(`http://localhost:8080${product.imageUrl}`, {
              headers: { access },
              responseType: 'blob'
            });
            const blob = new Blob([imageResponse.data], { 
              type: imageResponse.headers['content-type'] 
            });
            setPreview(URL.createObjectURL(blob));  // 미리보기 URL 생성
          }
        } catch (error) {
          console.error('상품 데이터 로드 실패:', error);
          alert('상품 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchProductData();

    // 컴포넌트 언마운트 시 미리보기 URL 해제
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [productId, show]);  // 상품 ID나 모달 상태가 바뀔 때마다 호출

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const file = e.target.files[0];  // 선택한 파일
    if (file) {
      setSelectedFile(file);  // 파일 상태 업데이트
      setPreview(URL.createObjectURL(file));  // 미리보기 URL 생성
    }
  };

  // 새로운 옵션 추가 핸들러
  const handleAddCustomOption = () => {
    setProductForm(prev => ({
      ...prev,
      customOptions: [...prev.customOptions, { optionName: '', optionPrice: '', key: '' }]
    }));
  };

  // 옵션 삭제 핸들러
  const handleRemoveCustomOption = (index) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, i) => i !== index)
    }));
  };

  // 옵션 값 변경 핸들러
  const handleCustomOptionChange = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [field]: value,  // 해당 필드 업데이트
            key: field === 'optionName' ? value.replace(/\s+/g, '').toLowerCase() : option.key
          };
        }
        return option;
      })
    }));
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setProductForm({
      productName: '',
      price: '',
      category: '',
      customOptions: defaultCustomOptions
    });
    setSelectedFile(null);
    setPreview(null);
    onHide();  // 부모 컴포넌트의 onHide 함수 호출
  };

  // 상품 수정 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      const productData = {
        productName: productForm.productName,
        price: parseInt(productForm.price),
        category: productForm.category,
        options: productForm.customOptions.map(opt => ({
          optionName: opt.optionName,
          optionPrice: parseInt(opt.optionPrice),
          isToggle: opt.isToggle || false,
          key: opt.key
        }))
      };

      // FormData에 상품 데이터와 이미지를 첨부
      formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const access = localStorage.getItem('access');
      // 상품 수정 API 호출
      await axios.put(`http://localhost:8080/products/${productId}`, formData, {
        headers: {
          access,
          'Content-Type': 'multipart/form-data'
        }
      });

      onProductEdited();  // 부모 컴포넌트에게 상품 수정 완료 알림
      handleClose();  // 모달 닫기
    } catch (error) {
      console.error('Error:', error);
      alert('상품 수정 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류'));
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      dialogClassName="modal-custom"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>상품 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="product-form">
          <Form.Group className="mb-3">
            <Form.Label>상품명</Form.Label>
            <Form.Control
              type="text"
              value={productForm.productName}
              onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>가격</Form.Label>
            <Form.Control
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
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
                onChange={handleFileSelect}
              />
            </div>
            {preview && (
              <div className="preview-container">
                <img
                  src={preview}
                  alt="미리보기"
                  className="preview-image"
                />
              </div>
            )}
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">옵션</Form.Label>
              <Button 
                variant="link" 
                onClick={handleAddCustomOption}
                className="p-0"
              >
                + 옵션 추가
              </Button>
            </div>
            {productForm.customOptions.map((option, index) => (
              <div key={index} className="option-row">
                <Form.Control
                  type="text"
                  placeholder="옵션명"
                  value={option.optionName}
                  onChange={(e) => handleCustomOptionChange(index, 'optionName', e.target.value)}
                  className="option-name"
                />
                <Form.Control
                  type="number"
                  placeholder="가격"
                  value={option.optionPrice}
                  onChange={(e) => handleCustomOptionChange(index, 'optionPrice', e.target.value)}
                  className="option-price"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => handleRemoveCustomOption(index)}
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
              수정
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProductEditModal;