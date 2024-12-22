import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const customStyles = {
  modalHeader: {
    borderBottom: '1px solid #dee2e6',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#212529'
  },
  modalBody: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#495057'
  },
  input: {
    borderRadius: '0.375rem',
    border: '1px solid #ced4da',
    padding: '0.5rem 0.75rem',
    transition: 'border-color 0.15s ease-in-out',
  },
  imagePreview: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '0.375rem',
    marginTop: '0.75rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  optionContainer: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  optionGroup: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    alignItems: 'center'
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem'
  }
};

function ProductRegistrationModal({ show, onHide, onProductAdded }) {
  const [productForm, setProductForm] = useState({
    productName: '',
    price: '',
    category: '',
    options: [{ optionName: '', optionPrice: '' }]
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
    if (image) {
      formData.append('image', image);
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
    setImage(null);
    setImagePreview(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <div style={customStyles.modalHeader}>
        <h5 style={customStyles.modalTitle}>상품 등록</h5>
      </div>
      
      <div style={customStyles.modalBody}>
        <Form onSubmit={handleSubmit}>
          <div style={customStyles.formGroup}>
            <label style={customStyles.label}>상품명</label>
            <input
              className="form-control"
              style={customStyles.input}
              type="text"
              value={productForm.productName}
              onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
              required
            />
          </div>

          <div style={customStyles.formGroup}>
            <label style={customStyles.label}>가격</label>
            <input
              className="form-control"
              style={customStyles.input}
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              required
            />
          </div>

          <div style={customStyles.formGroup}>
            <label style={customStyles.label}>카테고리</label>
            <input
              className="form-control"
              style={customStyles.input}
              type="text"
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              required
            />
          </div>

          <div style={customStyles.formGroup}>
            <label style={customStyles.label}>이미지</label>
            <input
              className="form-control"
              style={customStyles.input}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="미리보기"
                style={customStyles.imagePreview}
              />
            )}
          </div>

          <div style={customStyles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <label style={customStyles.label}>옵션</label>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleAddOption}
              >
                + 옵션 추가
              </Button>
            </div>
            
            <div style={customStyles.optionContainer}>
              {productForm.options.map((option, index) => (
                <div key={index} style={customStyles.optionGroup}>
                  <input
                    className="form-control"
                    style={{ ...customStyles.input, flex: 2 }}
                    placeholder="옵션명"
                    value={option.optionName}
                    onChange={(e) => handleOptionChange(index, 'optionName', e.target.value)}
                  />
                  <input
                    className="form-control"
                    style={{ ...customStyles.input, flex: 1 }}
                    type="number"
                    placeholder="가격"
                    value={option.optionPrice}
                    onChange={(e) => handleOptionChange(index, 'optionPrice', e.target.value)}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div style={customStyles.footer}>
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
            <Button variant="primary" type="submit">
              등록
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default ProductRegistrationModal;