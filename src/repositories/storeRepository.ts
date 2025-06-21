import prisma from "../lib/prisma";
import {
  CreateStoreInput,
  FindMyStoreProductsInput,
  ProductWithStocks,
  FavoriteStoreTargetDTO,
  UpdateStoreInput,
} from "../lib/dto/storeDTO";
import { Store } from "../types/storeType";
import { FavoriteStore, Prisma } from "@prisma/client";

export async function createStore(data: CreateStoreInput): Promise<Store> {
  return await prisma.store.create({ data });
}

export async function findStoreByUserId(userId: string): Promise<Store | null> {
  return await prisma.store.findFirst({ where: { userId } });
}

export async function findStoreByUserIdAndStoreId(
  userId: string,
  storeId: string
): Promise<Store | null> {
  return await prisma.store.findFirst({
    where: { AND: [{ userId }, { id: storeId }] },
  });
}

export async function getStoreById(id: string): Promise<Store> {
  return await prisma.store.findUniqueOrThrow({ where: { id } });
}

export async function updateStore(data: UpdateStoreInput): Promise<Store> {
  const { storeId, ...storeData } = data;
  return await prisma.store.update({
    where: { id: storeId },
    data: storeData,
  });
}
// Product 관련
export async function countProductByStoreId(storeId: string): Promise<number> {
  return await prisma.product.count({ where: { storeId } });
}

// FavoriteStore 관련
export async function countFavoriteStoreByStoreId(
  storeId: string
): Promise<number> {
  return await prisma.favoriteStore.count({ where: { storeId } });
}
export async function countFavoriteStoreByStoreIdAndUserID(
  storeId: string,
  userId: string
): Promise<number> {
  return await prisma.favoriteStore.count({
    where: { AND: [{ storeId }, { userId }] },
  });
}

export async function createFavoriteStore(
  data: FavoriteStoreTargetDTO
): Promise<FavoriteStore> {
  return await prisma.favoriteStore.create({
    data: {
      userId: data.userId,
      storeId: data.storeId,
    },
  });
}

export async function deleteFavoriteStore(
  data: FavoriteStoreTargetDTO
): Promise<FavoriteStore> {
  return await prisma.favoriteStore.delete({
    where: {
      userId_storeId: {
        userId: data.userId,
        storeId: data.storeId,
      },
    },
  });
}

// Product 관련
export async function getProductsWithStocksByStoreId(
  data: FindMyStoreProductsInput
): Promise<ProductWithStocks[]> {
  const { storeId, page, pageSize } = data;
  return await prisma.product.findMany({
    where: { storeId },
    skip: pageSize * (page - 1),
    take: pageSize,
    include: { stocks: true },
  });
}

export async function countMonthFavoriteStore(
  storeId: string
): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await prisma.favoriteStore.count({
    where: { AND: [{ storeId }, { createdAt: { gte: thirtyDaysAgo } }] },
  });
}

export async function findStoreById(id: string) {
  return await prisma.store.findUnique({
    where: {
      id: id,
    },
  });
}
