import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ProductRegistrationModal.css';

function ProductEditModal({ show, onHide, onProductEdited, productId }) {
  const categories = [
    '시즌한정',
    '커피·티',
    '논커피 라떼',
    '프라페·스무디',
    '밀크쉐이크',
    '에이드·주스',
    '티',
    '디저트',
    'MD상품'
  ];

  const defaultOptions = [
    { key: 'isIce', label: 'isIce', price: 0, isToggle: true },
    { key: 'isLarge', label: 'Large Size', price: 500, isToggle: true },
    { key: 'extraShot', label: 'Extra Shot', price: 500 },
    { key: 'vanillaSyrup', label: 'Vanilla Syrup', price: 300 },
    { key: 'hazelnutSyrup', label: 'Hazelnut Syrup', price: 300 },
    { key: 'caramelSyrup', label: 'Caramel Syrup', price: 300 },
    { key: 'extraTeaBag', label: 'Extra Tea Bag', price: 500 },
    { key: 'addWhippedCream', label: 'Add Whipped Cream', price: 500 },
    { key: 'addPearl', label: 'Add Pearl', price: 500 }
  ];

  const [productForm, setProductForm] = useState({
    productName: '',
    price: '',
    category: '',
    defaultOptions: [],
    customOptions: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (productId && show) {
        try {
          const access = localStorage.getItem('access');
          const response = await axios.get(`http://localhost:8080/products/${productId}`, {
            headers: { access }
          });
          
          const product = response.data;
          
          // 기존 옵션들을 defaultOptions와 customOptions로 분류
          const defaultOptionKeys = defaultOptions.map(opt => opt.key);
          const existingDefaultOptions = [];
          const customOptions = [];

          product.options?.forEach(option => {
            const defaultOption = defaultOptions.find(opt => opt.key === option.key);
            if (defaultOption) {
              existingDefaultOptions.push(defaultOption);
            } else {
              customOptions.push({
                optionName: option.optionName,
                optionPrice: option.optionPrice,
                key: option.key
              });
            }
          });
          
          setProductForm({
            productName: product.productName,
            price: product.price,
            category: product.category,
            defaultOptions: existingDefaultOptions,
            customOptions: customOptions
          });

          // 이미지 미리보기 설정
          if (product.imageUrl) {
            const imageResponse = await axios.get(`http://localhost:8080${product.imageUrl}`, {
              headers: { access },
              responseType: 'blob'
            });
            const blob = new Blob([imageResponse.data], { 
              type: imageResponse.headers['content-type'] 
            });
            setPreview(URL.createObjectURL(blob));
          }
        } catch (error) {
          console.error('상품 데이터 로드 실패:', error);
          alert('상품 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchProductData();

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [productId, show]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDefaultOptionChange = (option) => {
    setProductForm(prev => {
      const exists = prev.defaultOptions.some(opt => opt.key === option.key);
      const updatedOptions = exists
        ? prev.defaultOptions.filter(opt => opt.key !== option.key)
        : [...prev.defaultOptions, option];
      return { ...prev, defaultOptions: updatedOptions };
    });
  };

  const handleAddCustomOption = () => {
    setProductForm(prev => ({
      ...prev,
      customOptions: [...prev.customOptions, { optionName: '', optionPrice: '', key: '' }]
    }));
  };

  const handleRemoveCustomOption = (index) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, i) => i !== index)
    }));
  };

  const handleCustomOptionChange = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      customOptions: prev.customOptions.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [field]: value,
            key: field === 'optionName' ? value.replace(/\s+/g, '').toLowerCase() : option.key
          };
        }
        return option;
      })
    }));
  };

  const handleClose = () => {
    setProductForm({
      productName: '',
      price: '',
      category: '',
      defaultOptions: [],
      customOptions: []
    });
    setSelectedFile(null);
    setPreview(null);
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      // Combine default and custom options
      const allOptions = [
        ...productForm.defaultOptions.map(opt => ({
          optionName: opt.label,
          optionPrice: opt.price,
          isToggle: opt.isToggle || false,
          key: opt.key
        })),
        ...productForm.customOptions
          .filter(opt => opt.optionName && opt.optionPrice)
          .map(opt => ({
            optionName: opt.optionName,
            optionPrice: parseInt(opt.optionPrice),
            key: opt.key
          }))
      ];

      const productData = {
        productName: productForm.productName,
        price: parseInt(productForm.price),
        category: productForm.category,
        options: allOptions
      };

      formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const access = localStorage.getItem('access');
      await axios.put(`http://localhost:8080/products/${productId}`, formData, {
        headers: {
          access,
          'Content-Type': 'multipart/form-data'
        }
      });

      onProductEdited();
      handleClose();
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

          <Form.Group className="mb-3">
            <Form.Label>기본 옵션</Form.Label>
            <div className="default-options-container">
              {defaultOptions.map((option) => (
                <div key={option.key} className="default-option-item">
                  <Form.Check
                    type="checkbox"
                    id={`option-${option.key}`}
                    label={
                      <span>
                        {option.label}
                        {option.price > 0 && <span className="option-price"> (+{option.price}원)</span>}
                        {option.isToggle && <span className="toggle-indicator"> (토글)</span>}
                      </span>
                    }
                    checked={productForm.defaultOptions.some(opt => opt.key === option.key)}
                    onChange={() => handleDefaultOptionChange(option)}
                  />
                </div>
              ))}
            </div>
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">추가 옵션</Form.Label>
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
                  variant="outline-danger"
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