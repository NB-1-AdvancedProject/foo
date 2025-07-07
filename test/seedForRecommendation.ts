import prisma from "../src/lib/prisma";

export async function seedForRecommendation() {
  console.log("추천용 시드 테스트 데이터 생성 시작...");

  // --- 1. BUYER 유저 생성 (여러 명) ---
  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer1@example.com" },
    update: {},
    create: {
      email: "buyer1@example.com",
      password: "hashedpassword",
      name: "테스트구매자1",
      type: "BUYER",
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: "buyer2@example.com" },
    update: {},
    create: {
      email: "buyer2@example.com",
      password: "hashedpassword",
      name: "테스트구매자2",
      type: "BUYER",
    },
  });

  const buyer3 = await prisma.user.upsert({
    where: { email: "buyer3@example.com" },
    update: {},
    create: {
      email: "buyer3@example.com",
      password: "hashedpassword",
      name: "테스트구매자3",
      type: "BUYER",
    },
  });

  // --- 2. SELLER 유저 생성 ---
  const seller = await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: {},
    create: {
      email: "seller@example.com",
      password: "hashedpassword",
      name: "테스트판매자",
      type: "SELLER",
    },
  });

  // --- 3. SELLER의 Store 생성 ---
  const store = await prisma.store.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      name: "테스트스토어",
      address: "서울시 강남구 어딘가",
      phoneNumber: "010-1234-5678",
      content: "테스트 스토어 설명입니다.",
      userId: seller.id,
    },
  });

  // --- 4. 카테고리 생성 (여러 개) ---
  const categoryClothing = await prisma.category.upsert({
    where: { name: "의류" },
    update: {},
    create: {
      name: "의류",
      description: "다양한 의류",
    },
  });

  const categoryAccessory = await prisma.category.upsert({
    where: { name: "액세서리" },
    update: {},
    create: {
      name: "액세서리",
      description: "멋진 액세서리",
    },
  });

  const categoryElectronics = await prisma.category.upsert({
    where: { name: "전자제품" },
    update: {},
    create: {
      name: "전자제품",
      description: "최신 전자제품",
    },
  });

  // --- 5. 상품(Product) 생성 (여러 개) ---
  const productA = await prisma.product.create({
    data: {
      name: "남성용 티셔츠",
      price: 25000,
      image: "https://via.placeholder.com/150?text=T-Shirt",
      content: "편안한 남성용 티셔츠입니다.",
      categoryId: categoryClothing.id,
      storeId: store.id,
    },
  });

  const productB = await prisma.product.create({
    data: {
      name: "여성용 청바지",
      price: 55000,
      image: "https://via.placeholder.com/150?text=Jeans",
      content: "세련된 여성용 청바지입니다.",
      categoryId: categoryClothing.id,
      storeId: store.id,
    },
  });

  const productC = await prisma.product.create({
    data: {
      name: "가죽 벨트",
      price: 30000,
      image: "https://via.placeholder.com/150?text=Belt",
      content: "고급스러운 가죽 벨트입니다.",
      categoryId: categoryAccessory.id,
      storeId: store.id,
    },
  });

  const productD = await prisma.product.create({
    data: {
      name: "무선 이어폰",
      price: 120000,
      image: "https://via.placeholder.com/150?text=Earbuds",
      content: "선명한 음질의 무선 이어폰.",
      categoryId: categoryElectronics.id,
      storeId: store.id,
    },
  });

  const productE = await prisma.product.create({
    data: {
      name: "스마트워치",
      price: 200000,
      image: "https://via.placeholder.com/150?text=Smartwatch",
      content: "다양한 기능을 갖춘 스마트워치.",
      categoryId: categoryElectronics.id,
      storeId: store.id,
    },
  });

  const productF = await prisma.product.create({
    data: {
      name: "백팩",
      price: 70000,
      image: "https://via.placeholder.com/150?text=Backpack",
      content: "캐주얼 백팩.",
      categoryId: categoryAccessory.id,
      storeId: store.id,
    },
  });

  // --- 6. Size 생성 (다양하게) ---
  const sizes = await Promise.all([
    prisma.size.upsert({
      where: { size: "S" },
      update: {},
      create: { size: "S" },
    }),
    prisma.size.upsert({
      where: { size: "M" },
      update: {},
      create: { size: "M" },
    }),
    prisma.size.upsert({
      where: { size: "L" },
      update: {},
      create: { size: "L" },
    }),
    prisma.size.upsert({
      where: { size: "XL" },
      update: {},
      create: { size: "XL" },
    }),
    prisma.size.upsert({
      where: { size: "Free" },
      update: {},
      create: { size: "Free" },
    }),
  ]);
  const sizeS = sizes[0];
  const sizeM = sizes[1];
  const sizeL = sizes[2];
  const sizeXL = sizes[3];
  const sizeFree = sizes[4];

  // --- 7. 재고 등록 ---
  await prisma.stock.createMany({
    data: [
      { productId: productA.id, sizeId: sizeM.id, quantity: 20 },
      { productId: productA.id, sizeId: sizeL.id, quantity: 15 },
      { productId: productB.id, sizeId: sizeS.id, quantity: 15 },
      { productId: productB.id, sizeId: sizeM.id, quantity: 15 },
      { productId: productC.id, sizeId: sizeFree.id, quantity: 30 },
      { productId: productD.id, sizeId: sizeFree.id, quantity: 10 },
      { productId: productE.id, sizeId: sizeFree.id, quantity: 8 },
      { productId: productF.id, sizeId: sizeFree.id, quantity: 25 },
    ],
  });

  // --- 8. 장바구니 생성 (각 구매자별로 하나씩만 생성) ---
  // upsert를 사용하여 각 유저당 하나의 카트만 존재하도록 유지합니다.
  const cart1 = await prisma.cart.upsert({
    where: { userId: buyer1.id },
    update: {},
    create: {
      userId: buyer1.id,
    },
  });

  const cart2 = await prisma.cart.upsert({
    where: { userId: buyer2.id },
    update: {},
    create: {
      userId: buyer2.id,
    },
  });

  const cart3 = await prisma.cart.upsert({
    where: { userId: buyer3.id },
    update: {},
    create: {
      userId: buyer3.id,
    },
  });

  // --- 9. 장바구니에 상품 추가 (다양한 조합으로, 기존 카트에 추가) ---

  // 구매자1의 카트: 티셔츠, 청바지, 벨트, 백팩
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart1.id,
        productId: productA.id,
        sizeId: sizeM.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }, // 7일 전
      {
        cartId: cart1.id,
        productId: productB.id,
        sizeId: sizeS.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }, // 7일 전
      {
        cartId: cart1.id,
        productId: productC.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }, // 7일 전
      {
        cartId: cart1.id,
        productId: productF.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }, // 7일 전
    ],
    skipDuplicates: true,
  });

  // 구매자2의 카트: 티셔츠, 이어폰, 벨트
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart2.id,
        productId: productA.id,
        sizeId: sizeM.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }, // 5일 전
      {
        cartId: cart2.id,
        productId: productD.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }, // 5일 전
      {
        cartId: cart2.id,
        productId: productC.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }, // 5일 전
    ],
    skipDuplicates: true,
  });

  // 구매자3의 카트: 청바지, 스마트워치, 백팩
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart3.id,
        productId: productB.id,
        sizeId: sizeM.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }, // 3일 전
      {
        cartId: cart3.id,
        productId: productE.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }, // 3일 전
      {
        cartId: cart3.id,
        productId: productF.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }, // 3일 전
    ],
    skipDuplicates: true,
  });

  // 추가적인 카트 아이템 시나리오: 기존 카트에 다른 상품들을 추가하여 패턴 강화
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart2.id,
        productId: productF.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }, // 1일 전 (cart2에 F 추가)
      {
        cartId: cart1.id,
        productId: productD.id,
        sizeId: sizeFree.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }, // 1일 전 (cart1에 D 추가)
      {
        cartId: cart3.id,
        productId: productA.id,
        sizeId: sizeM.id,
        quantity: 1,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }, // 1일 전 (cart3에 A 추가)
    ],
    skipDuplicates: true,
  });

  console.log("추천용 시드 데이터 생성 완료!");
  return {
    productA,
    productB,
    productC,
    productD,
    productE,
    productF,
  };
}
