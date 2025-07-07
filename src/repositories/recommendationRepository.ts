import { Product } from "@prisma/client";
import prisma from "../lib/prisma";
import { getRedisClient } from "../lib/redis";

export async function getRedisByKey(
  key: string
): Promise<string | null | void> {
  const redis = getRedisClient();
  if (!redis || !redis.isReady) {
    console.warn("Redis client not connect ed or not ready.");
    return;
  }
  return await redis.get(key);
}

export async function findProductForRecommendation(
  productId: string
): Promise<Product> {
  return await prisma.product.findUniqueOrThrow({ where: { id: productId } });
}
