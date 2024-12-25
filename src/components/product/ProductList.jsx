import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUser } from '../../apis/userapis/getuser';
import { isStaff } from '../../apis/userapis/isStaff';
import ProductRegistrationModal from './ProductRegistrationModal';
import ProductEditModal from './ProductEditModal';
import './ProductList.css';

function ProductList() {
 const navigate = useNavigate();
 
 // 상태 관리
 const [products, setProducts] = useState([]); 
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('전체');
 const [sortBy, setSortBy] = useState('priceLow'); // 정렬 기본값
 const [showModal, setShowModal] = useState(false);
 const [editModalOpen, setEditModalOpen] = useState(false);
 const [selectedProductId, setSelectedProductId] = useState(null);
 const [imageUrls, setImageUrls] = useState({});
 const [imageLoadingStates, setImageLoadingStates] = useState({});
 const [isStaffStatus, setIsStaffStatus] = useState(false);

 // 이미지 로딩 상태 업데이트
 const updateImageLoadingState = (productId, isLoading) => {
   setImageLoadingStates(prev => ({
     ...prev,
     [productId]: isLoading
   }));
 };

 // 이미지 불러오기 
 const fetchImage = async (imageUrl, productId, access) => {
   if (!imageUrl) return null;
   
   updateImageLoadingState(productId, true);
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
   } finally {
     updateImageLoadingState(productId, false);
   }
 };

 // 상품 삭제
 const handleDeleteProduct = async (productId) => {
   const access = localStorage.getItem('access');
   try {
     await axios.delete(`http://localhost:8080/products/${productId}`, {
       headers: { access }
     });
     handleProductAdded();
   } catch (error) {
     console.error('삭제 실패:', error);
     alert('상품 삭제에 실패했습니다.');
   }
 };

 // 초기 데이터 로딩 
 useEffect(() => {
   const checkUser = async () => {
     const isUser = await getUser();
     const staffCheck = await isStaff();
   
     if (isUser == null) {
       alert("로그인이 필요합니다.");
       navigate('/');
     } else {
       setIsStaffStatus(staffCheck);
     }
   }
       
   const fetchProducts = async () => {
     const access = localStorage.getItem('access');
     try {
       const response = await axios.get('http://localhost:8080/products', {
         headers: { access },
       });
       setProducts(response.data);
       setLoading(false);
     } catch (error) {
       setError(error.message || '알 수 없는 오류 발생');
       setLoading(false);
     }
   };
   
   checkUser();
   fetchProducts();
 }, []);

 // 이미지 로딩
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

 // 상품 추가/수정 후 새로고침
 const handleProductAdded = async () => {
   const access = localStorage.getItem('access');
   try {
     const response = await axios.get('http://localhost:8080/products', {
       headers: { access },
     });
     setProducts(response.data);
     setShowModal(false);
     setEditModalOpen(false);
   } catch (error) {
     console.error('상품 목록 새로고침 실패:', error);
   }
 };

 const categories = ['전체', '커피·더치', '논커피 라떼', '프라페·스무디', '밀크쉐이크', '에이드·주스', '티', '디저트', 'MD상품'];

 // 필터링 및 정렬
 const filteredAndSortedProducts = products
   .filter(product => selectedCategory === '전체' ? true : product.category === selectedCategory)
   .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
   .sort((a, b) => {
     switch (sortBy) {
       case 'priceLow': return a.price - b.price;
       case 'priceHigh': return b.price - a.price;
       default: return a.productName.localeCompare(b.productName);
     }
   });

 if (loading) return <div className="product-list__loading">로딩 중...</div>;
 if (error) return <div className="product-list__error">에러 발생: {error}</div>;

 return (
   <div className="product-list">
     {/* 상단 카테고리 네비게이션 */}
     <nav className="product-list__nav">
       {categories.map(category => (
         <button 
           key={category}
           className={`product-list__nav-item ${selectedCategory === category ? 'active' : ''}`}
           onClick={() => setSelectedCategory(category)}
         >
           {category}
         </button>
       ))}
     </nav>

     {/* 검색/정렬 컨트롤 */}
     <div className="product-list__controls">
       <div className="product-list__sort">
         <select
           value={sortBy}
           onChange={(e) => setSortBy(e.target.value)}
           className="product-list__sort-select"
         >
           <option value="name">이름순</option>
           <option value="priceLow">가격 낮은순</option>
           <option value="priceHigh">가격 높은순</option>
         </select>
       </div>
       <div className="product-list__search">
         <input
           type="text"
           placeholder="메뉴 검색"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="product-list__search-input"
         />
       </div>
     </div>

     {/* 관리자 상품 등록 버튼 */}
     {isStaffStatus && (
       <div className="product-list__admin">
         <button 
           className="product-list__admin-btn"
           onClick={() => setShowModal(true)}
         >
           상품 등록
         </button>
       </div>
     )}

     {/* 상품 등록/수정 모달 */}
     <ProductRegistrationModal
       show={showModal}
       onHide={() => setShowModal(false)}
       onProductAdded={handleProductAdded}
     />
     <ProductEditModal
       show={editModalOpen}
       onHide={() => setEditModalOpen(false)}
       onProductEdited={handleProductAdded}
       productId={selectedProductId}
     />

     {/* 상품 그리드 */}
     <div className="product-list__grid">
       {filteredAndSortedProducts.map(product => (
         <div key={product.productId} className="product-list__item">
           <div 
             className="product-card"
             onClick={() => navigate(`/product/${product.productId}`)}
           >
             <div className="product-card__image-container">
               {imageLoadingStates[product.productId] ? (
                 <div className="product-card__loading">이미지 로딩중...</div>
               ) : imageUrls[product.productId] ? (
                 <img
                   src={imageUrls[product.productId]}
                   className="product-card__image"
                   alt={product.productName}
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.classList.add('product-card__image--error');
                   }}
                 />
               ) : (
                 <div className="product-card__no-image">
                   이미지 없음
                 </div>
               )}
             </div>
             <div className="product-card__content">
               <h5 className="product-card__title">{product.productName}</h5>
               <p className="product-card__price">{product.price.toLocaleString()}원</p>
               <span className="product-card__category">{product.category}</span>
             </div>
           </div>
           {/* 관리자 컨트롤 */}
           {isStaffStatus && (
             <div className="product-card__admin-controls">
               <button
                 className="product-card__edit-btn"
                 onClick={(e) => {
                   e.stopPropagation();
                   setSelectedProductId(product.productId);
                   setEditModalOpen(true);
                 }}
               >
                 수정
               </button>
               <button
                 className="product-card__delete-btn"
                 onClick={(e) => {
                   e.stopPropagation();
                   if (window.confirm('정말 삭제하시겠습니까?')) {
                     handleDeleteProduct(product.productId);
                   }
                 }}
               >
                 삭제
               </button>
             </div>
           )}
         </div>
       ))}
     </div>
   </div>
 );
}

export default ProductList;