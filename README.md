JASS COFFEE 장바구니 기능 구현 가이드
🛒 장바구니 데이터 구조
장바구니는 localStorage를 사용하여 관리됩니다.
기본 정보

저장소 키: 'cart'
데이터 형식: JSON 문자열로 저장된 배열
접근 방법: localStorage.getItem('cart')

장바구니 아이템 객체 구조
javascriptCopy{
  productId: number,       // 상품 고유 ID
  productName: string,     // 상품명
  price: number,          // 상품 기본 가격
  quantity: number,       // 수량
  selectedOptions: [      // 선택된 옵션 배열
    {
      optionName: string,  // 옵션명 (예: "Extra Shot")
      optionPrice: number  // 옵션 추가 가격
    }
  ],
  totalPrice: number      // 총 가격 (기본가격 + 옵션가격) * 수량
}
예시 데이터
javascriptCopy[
  {
    "productId": 1,
    "productName": "아메리카노",
    "price": 4500,
    "quantity": 2,
    "selectedOptions": [
      {
        "optionName": "Extra Shot",
        "optionPrice": 500
      }
    ],
    "totalPrice": 10000
  }
]
📝 사용 예시
1. 장바구니 조회
javascriptCopyconst cart = JSON.parse(localStorage.getItem('cart') || '[]');
2. 장바구니 아이템 추가
javascriptCopyconst newItem = {
  productId: product.id,
  productName: product.name,
  price: product.price,
  quantity: 1,
  selectedOptions: selectedOptions,
  totalPrice: calculateTotalPrice()
};
cart.push(newItem);
localStorage.setItem('cart', JSON.stringify(cart));
3. 장바구니 아이템 수정
javascriptCopycart[index].quantity = newQuantity;
cart[index].totalPrice = calculateNewTotal();
localStorage.setItem('cart', JSON.stringify(cart));
4. 장바구니 아이템 삭제
javascriptCopycart.splice(index, 1);
localStorage.setItem('cart', JSON.stringify(cart));
5. 장바구니 비우기
javascriptCopylocalStorage.removeItem('cart');
⚠️ 주의사항

localStorage는 문자열만 저장 가능하므로 JSON.stringify()로 변환 필수
데이터 읽을 때는 JSON.parse()로 파싱 필수
기본값으로 빈 배열('[]') 사용 권장
totalPrice는 항상 (기본가격 + 옵션가격의 합계) * 수량으로 계산
quantity는 1 이상의 정수만 허용

📂 관련 컴포넌트

ProductDetailPage: 장바구니 담기 기능
CartList: 장바구니 목록 표시 및 관리
CartPage: 장바구니 페이지 레이아웃

🔍 기능 확인 방법

상품 상세 페이지에서 옵션 선택 후 장바구니 담기
장바구니 페이지에서 수량 조절 및 옵션 확인
개별 상품 삭제 또는 전체 삭제 기능 테스트
총 금액이 올바르게 계산되는지 확인

💡 개발 팁

장바구니 상태 변경 시 즉시 localStorage 업데이트 필수
동일 상품 추가 시 수량만 증가시키는 로직 구현
옵션 변경 시 새로운 상품으로 처리
수량 변경 시 totalPrice 재계산 로직 확인