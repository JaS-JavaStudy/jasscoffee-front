// components/ProductModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ProductModal({ 
  show, 
  handleClose, 
  product, 
  handleSubmit, 
  mode 
}) {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: 'COFFEE'
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData(product);
    }
  }, [product, mode]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'add' ? '메뉴 추가' : '메뉴 수정'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>메뉴명</Form.Label>
            <Form.Control
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({
                ...formData,
                productName: e.target.value
              })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>가격</Form.Label>
            <Form.Control
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({
                ...formData,
                price: Number(e.target.value)
              })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              value={formData.category}
              onChange={(e) => setFormData({
                ...formData,
                category: e.target.value
              })}
            >
              <option value="COFFEE">COFFEE</option>
              <option value="TEA">TEA</option>
              <option value="JUICE">JUICE</option>
            </Form.Select>
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              취소
            </Button>
            <Button variant="primary" type="submit">
              {mode === 'add' ? '추가' : '수정'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}