import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './ProductRegistrationModal.css';

function ProductRegistrationModal({ show, onHide, onProductAdded }) {
  const [productForm, setProductForm] = useState({
    productName: '',
    price: '',
    category: '',
    options: [{ optionName: '', optionPrice: '' }]
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

  const handleAddOption = () => {
    setProductForm({
      ...productForm,
      options: [...productForm.options, { optionName: '', optionPrice: '' }]
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = productForm.options.filter((_, i) => i !== index);
    setProductForm({ ...productForm, options: newOptions });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = productForm.options.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setProductForm({ ...productForm, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const productData = {
      productName: productForm.productName,
      price: parseInt(productForm.price),
      category: productForm.category,
      options: productForm.options
        .filter(opt => opt.optionName && opt.optionPrice)
        .map(opt => ({
          optionName: opt.optionName,
          optionPrice: parseInt(opt.optionPrice)
        }))
    };

    formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
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
      alert('상품 등록 실패: ' + (error.message || '알 수 없는 오류'));
    }
  };

  const handleClose = () => {
    setProductForm({
      productName: '',
      price: '',
      category: '',
      options: [{ optionName: '', optionPrice: '' }]
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
            <Form.Control
              type="text"
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              required
            />
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
              <Button variant="link" onClick={handleAddOption} className="p-0">
                + 옵션 추가
              </Button>
            </div>
            {productForm.options.map((option, index) => (
              <div key={index} className="option-row mb-2">
                <Form.Control
                  type="text"
                  placeholder="옵션명"
                  value={option.optionName}
                  onChange={(e) => handleOptionChange(index, 'optionName', e.target.value)}
                  className="option-name"
                />
                <Form.Control
                  type="number"
                  placeholder="가격"
                  value={option.optionPrice}
                  onChange={(e) => handleOptionChange(index, 'optionPrice', e.target.value)}
                  className="option-price"
                />
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveOption(index)}
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