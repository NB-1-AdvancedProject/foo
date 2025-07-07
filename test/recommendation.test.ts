import { runPythonScript } from "../src/lib/runPython";
import prisma from "../src/lib/prisma";
import { connectRedis, getRedisClient } from "../src/lib/redis";
import { seedForRecommendation } from "./seedForRecommendation";
import { clearDatabase, disconnectTestDB } from "./testUtil";
import request from "supertest";
import app from "../src/app";

describe("Python 추천 알고리즘 통합 테스트", () => {
  let products: Awaited<ReturnType<typeof seedForRecommendation>>;
  let redis: ReturnType<typeof getRedisClient>;
  beforeAll(async () => {
    await clearDatabase();
    products = await seedForRecommendation();
    redis = await connectRedis();
    await redis.flushAll();
  });
  afterAll(async () => {
    await disconnectTestDB();
    if (redis && redis.isReady) {
      await redis.quit();
    }
  });

  test("배치 알고리즘 실행 → DB & Redis 저장 확인", async () => {
    await runPythonScript("batch_processor.py");

    const productAId = products.productA.id;
    // DB 확인
    const rec = await prisma.recommendation.findUnique({
      where: { productId: productAId },
    });
    expect(rec).toBeDefined();
    const recJson = rec!.recommendations as {
      items: { productId: string; score: number }[];
    };
    expect(recJson!.items).toBeInstanceOf(Array);

    // Redis 확인
    if (!redis || !redis.isReady) {
      console.warn("Redis client not connect ed or not ready.");
    }
    const redisKey = `item:recommendation:${productAId}`;
    const redisResult = await redis!.get(redisKey);
    expect(redisResult).toBeDefined();
    const redisJson = JSON.parse(redisResult!);
    expect(redisJson.items.length).toBeGreaterThan(0);
  });

  test("추천 요청 API 확인 (GET api/recommendations/:productId", async () => {
    const productAId = products.productA.id;
    const req = await request(app).get(`/api/recommendations/${productAId}`);
    expect(req.status).toBe(200);
    expect(req.body.productId).toBe(productAId);
    expect(req.body.recommendations.length).toBeGreaterThan(0);
  });
});
