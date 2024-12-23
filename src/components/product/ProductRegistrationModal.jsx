import  { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ProductRegistrationModal.css';

function ProductRegistrationModal({ show, onHide, onProductAdded }) {
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
    { key: 'isIce', label: '얼음', price: 0 },
    { key: 'shot', label: '샷 추가', price: 500 },
    { key: 'pearl', label: '타피오카 펄', price: 500 },
    { key: 'milk', label: '우유', price: 500 },
    { key: 'syrup', label: '시럽', price: 300 },
    { key: 'vanilaSyrup', label: '바닐라 시럽', price: 300 },
    { key: 'hazelnutSyrup', label: '헤이즐넛 시럽', price: 300 },
    { key: 'isWhip', label: '휘핑크림', price: 500 }
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
      customOptions: [...prev.customOptions, { optionName: '', optionPrice: '' }]
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
      customOptions: prev.customOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      // Combine default and custom options
      const allOptions = [
        ...productForm.defaultOptions.map(opt => ({
          optionName: opt.label,
          optionPrice: opt.price
        })),
        ...productForm.customOptions
          .filter(opt => opt.optionName && opt.optionPrice)
          .map(opt => ({
            optionName: opt.optionName,
            optionPrice: parseInt(opt.optionPrice)
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
      await axios.post('http://localhost:8080/products', formData, {
        headers: {
          access,
          'Content-Type': 'multipart/form-data'
        }
      });

      onProductAdded();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      alert('상품 등록 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류'));
    }
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

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      dialogClassName="modal-custom"
      backdrop="static"
      keyboard={false}
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
              등록
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProductRegistrationModal;