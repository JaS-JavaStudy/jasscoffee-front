import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../product/ProductCarousel.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const navigate = useNavigate();

  // 이미지 불러오기 함수
  const fetchImage = async (imageUrl, productId, access) => {
    if (!imageUrl) return null;
    
    try {
      const response = await axios.get(`http://localhost:8080${imageUrl}`, {
        headers: {
          'access': access,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Invalid image content type');
      }

      const blob = new Blob([response.data], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`이미지 로딩 실패 (상품 ID: ${productId}):`, error);
      return null;
    }
  };

  // 상품 데이터 로드
  useEffect(() => {
    const fetchProducts = async () => {
      const access = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8080/products', {
          headers: {
            'access': access,
          },
        });
        // 랜덤으로 5개 선택
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 5));
      } catch (error) {
        console.error('상품 로드 실패:', error);
      }
    };

    fetchProducts();
  }, []);

  // 이미지 로드
  useEffect(() => {
    const loadImages = async () => {
      const access = localStorage.getItem('access');
      const urls = { ...imageUrls };
      
      for (const product of products) {
        if (product.imageUrl && !urls[product.productId]) {
          const url = await fetchImage(product.imageUrl, product.productId, access);
          if (url) {
            urls[product.productId] = url;
          }
        }
      }
      
      setImageUrls(urls);
    };

    if (products.length > 0) {
      loadImages();
    }

    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [products]);

  return (
    <Carousel className={styles.carousel}>
      {products.map(product => (
        <Carousel.Item 
          key={product.productId} 
          onClick={() => navigate(`/product/${product.productId}`)}
          className={styles.carouselItem}
        >
          {imageUrls[product.productId] ? (
            <img
              src={imageUrls[product.productId]}
              alt={product.productName}
              className={styles.carouselImage}
            />
          ) : (
            <div className={styles.loading}>
              이미지 로딩중...
            </div>
          )}
          <Carousel.Caption className={styles.caption}>
            <h3 className={styles.title}>{product.productName}</h3>
            <p className={styles.price}>{product.price.toLocaleString()}원</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;