import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import { User } from "@prisma/client";
import {
  sellerUser,
  category1,
  fullProduct,
  size1,
  store1,
  fullProduct2,
  fullProduct3,
  fullProduct4,
  fullProduct5,
  size2,
  size4,
  size3,
  category2,
  category3,
  seller2,
  seller3,
  store2,
  store3,
} from "./productDummy";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { Decimal } from "@prisma/client/runtime/library";
import app from "../src/app";
import request from "supertest";

describe("Product API 테스트", () => {
  let sellerUser1: User;
  beforeAll(async () => {
    await clearDatabase();
    sellerUser1 = await prisma.user.create({
      data: {
        ...sellerUser,
        password: await bcrypt.hash(sellerUser.password, 10),
      },
    });
    await prisma.user.create({
      data: {
        ...seller2,
        password: await bcrypt.hash(seller2.password, 10),
      },
    });
    await prisma.user.create({
      data: {
        ...seller3,
        password: await bcrypt.hash(seller3.password, 10),
      },
    });
    await prisma.store.create({ data: store1 });
    await prisma.store.create({ data: store2 });
    await prisma.store.create({ data: store3 });
    await prisma.size.create({
      data: size1,
    });
    await prisma.size.create({ data: size2 });
    await prisma.size.create({ data: size3 });
    await prisma.size.create({ data: size4 });
    await prisma.category.create({
      data: category1,
    });
    await prisma.category.create({ data: category2 });
    await prisma.category.create({ data: category3 });
    await prisma.product.create({
      data: fullProduct,
    });
    await prisma.product.create({ data: fullProduct2 });
    await prisma.product.create({ data: fullProduct3 });
    await prisma.product.create({ data: fullProduct4 });
    await prisma.product.create({ data: fullProduct5 });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });

  test("POST /api/products - 상품 추가", async () => {
    const newProduct = {
      name: "가디건",
      image: "https://s3-URL",
      content: "상품 상세 설명",
      price: Decimal(100),
      categoryName: "clothing",
      stocks: [
        {
          sizeId: "size1-id",
          quantity: 10,
        },
      ],
    };
    const authReq = getAuthenticatedReq(sellerUser1.id);
    const response = await authReq.post("/api/products").send(newProduct);

    expect(response.status).toBe(201);

    const body = response.body;

    // 기본 필드
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("content");
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("image");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("updatedAt");
    expect(body).toHaveProperty("reviewsRating");
    expect(body).toHaveProperty("storeId");
    expect(body).toHaveProperty("storeName");
    expect(body).toHaveProperty("price");
    expect(body).toHaveProperty("discountPrice");
    expect(body).toHaveProperty("discountRate");
    expect(body).toHaveProperty("discountStartTime");
    expect(body).toHaveProperty("discountEndTime");
    expect(body).toHaveProperty("reviewsCount");

    // reviews 배열
    expect(body).toHaveProperty("reviews");
    expect(Array.isArray(body.reviews)).toBe(true);

    // inquiries 배열
    expect(body).toHaveProperty("inquiries");
    expect(Array.isArray(body.inquiries)).toBe(true);

    // category 배열
    expect(body).toHaveProperty("category");
    expect(Array.isArray(body.category)).toBe(true);
    const category = body.category[0];
    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name");

    // stocks 배열
    expect(body).toHaveProperty("stocks");
    expect(Array.isArray(body.stocks)).toBe(true);
    const stock = body.stocks[0];
    expect(stock).toHaveProperty("id");
    expect(stock).toHaveProperty("productId");
    expect(stock).toHaveProperty("sizeId");
    expect(stock).toHaveProperty("quantity");
  });
  describe("GET /api/products - 상품 목록 조회", () => {
    beforeAll(async () => {});

    test("기본 조회 - 페이징 기본값", async () => {
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
      expect(typeof res.body.totalCount).toBe("number");
    });

    test("검색어로 이름 검색", async () => {
      const res = await request(app).get("/api/products").query({
        searchBy: "name",
        search: "가디건",
      });
      expect(res.status).toBe(200);
      res.body.list.forEach((p: any) => {
        expect(p.name.toLowerCase()).toContain("가디건");
      });
    });

    test("검색어로 상점 이름 검색", async () => {
      const storeName = "내가 만든 상점";
      const res = await request(app).get("/api/products").query({
        searchBy: "store",
        search: storeName,
      });
      expect(res.status).toBe(200);
      res.body.list.forEach((p: any) => {
        expect(p.storeId).toBeDefined();
      });
    });

    test("카테고리 필터링", async () => {
      const categoryName = "clothing";
      const res = await request(app).get("/api/products").query({
        categoryName,
      });
      expect(res.status).toBe(200);
      res.body.list.forEach((p: any) => {
        expect(p.categoryId).toBeDefined();
      });
    });

    test("가격 필터링 (min, max)", async () => {
      const res = await request(app).get("/api/products").query({
        priceMin: 5000,
        priceMax: 10000,
      });
      expect(res.status).toBe(200);
      res.body.list.forEach((p: any) => {
        expect(p.price).toBeGreaterThanOrEqual(5000);
        expect(p.price).toBeLessThanOrEqual(10000);
      });
    });

    //사이즈 필터링이 되는지 확인해야하는데, 요구하는 responseBody 에 사이즈 정보가없으므로 보류.

    test("정렬 조건별 조회", async () => {
      const sorts = [
        "mostReviewed",
        "highRating",
        "HighPrice",
        "lowPrice",
        "recent",
        "salesRanking",
      ];

      for (const sort of sorts) {
        const res = await request(app).get("/api/products").query({ sort });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.list)).toBe(true);
      }
    });

    test("페이지네이션 테스트", async () => {
      const pageSize = 2;
      const res1 = await request(app)
        .get("/api/products")
        .query({ page: 1, pageSize });
      const res2 = await request(app)
        .get("/api/products")
        .query({ page: 2, pageSize });

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.list.length).toBeLessThanOrEqual(pageSize);
      expect(res2.body.list.length).toBeLessThanOrEqual(pageSize);
      // 페이지 별로 결과가 다름을 간단히 확인
      if (res1.body.list.length > 0 && res2.body.list.length > 0) {
        expect(res1.body.list[0].id).not.toBe(res2.body.list[0].id);
      }
    });
  });
  describe("PATCH /products/:id - 상품 수정", () => {
    test("기본 수정 테스트", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        name: "Updated Product",
        price: 19900,
        content: "Updated content",
        image: "https://example.com/image.jpg",
        discountRate: 10,
        discountStartTime: new Date(),
        discountEndTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
        categoryName: "Updated Category",
        stocks: [
          { sizeId: "size1-id", quantity: 5 },
          { sizeId: "size2-id", quantity: 10 },
        ],
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Updated Product");
      expect(response.body.stocks.length).toBeGreaterThan(0);
    });

    test("일부 필드만 수정", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        price: 29900,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.price).toBe("29900");
    });

    test("Int 필드에 잘못된타입 삽입 테스트", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        price: "not-a-number",
      });

      expect(response.statusCode).toBe(400);
    });

    test("본인의 상품이 아닌 경우 Unauthorized(401) 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product2-id").send({
        name: "Some Name",
      });
      expect(response.status).toBe(401);
    });
  });
  describe("DELETE /api/products/:id - 상품 삭제", () => {
    test("기본 삭제 테스트", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);

      const deleteResponse = await authReq.delete("/api/products/product1-id");
      expect(deleteResponse.status).toBe(204);

      // 삭제된 상품 한번더 삭제시 404 에러 발생 확인
      const Response = await authReq.delete("/api/products/product1-id");
      expect(Response.status).toBe(404);
    });
  });
});
