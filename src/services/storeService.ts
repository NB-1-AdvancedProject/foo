import {
  CreateStoreDTO,
  GetMyStoreProductsDTO,
  MyStoreProductDTO,
  MyStoreProductsDTO,
  ProductWithStocks,
  MyStoreDTO,
  StoreResDTO,
  StoreWithFavoriteCountDTO,
  UpdateMyStoreDTO,
  FavoriteStoreTargetDTO,
  FavoriteStoreResDTO,
  favoriteStoreType,
} from "../lib/dto/storeDTO";

import * as storeRepository from "../repositories/storeRepository";
import UnauthError from "../lib/errors/UnauthError";
import BadRequestError from "../lib/errors/BadRequestError";
import { UserType } from "@prisma/client";
import { Store } from "../types/storeType";
import NotFoundError from "../lib/errors/NotFoundError";
import AlreadyExstError from "../lib/errors/AlreadyExstError";

export async function createStore(dto: CreateStoreDTO): Promise<StoreResDTO> {
  const { userType, ...storeData } = dto;
  if (userType !== UserType.SELLER) {
    throw new UnauthError();
  }
  const existingStore = await storeRepository.findStoreByUserId(dto.userId);
  if (existingStore) {
    throw new AlreadyExstError("Store");
  }

  const store: Store = await storeRepository.createStore(storeData);
  return new StoreResDTO(store);
}

export async function getStoreInfo(
  storeId: string
): Promise<StoreWithFavoriteCountDTO> {
  const store = await storeRepository.getStoreById(storeId);
  const favoriteCount = await storeRepository.countFavoriteStoreByStoreId(
    storeId
  );
  return new StoreWithFavoriteCountDTO(store, favoriteCount);
}
export async function getStoreByUserId(
  userId: string
): Promise<StoreResDTO | null> {
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    return null;
  }
  return new StoreResDTO(store);
}

export async function getMyStoreProductList(
  dto: GetMyStoreProductsDTO
): Promise<MyStoreProductsDTO> {
  const { userId, page = 1, pageSize = 10 } = dto;
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("store", `userId: ${userId}`);
  }
  const products: ProductWithStocks[] =
    await storeRepository.getProductsWithStocksByStoreId({
      storeId: store.id,
      page,
      pageSize,
    });
  const list = await Promise.all(
    products.map((product) => {
      return new MyStoreProductDTO(product);
    })
  );
  const totalCount = await storeRepository.countProductByStoreId(store.id);
  return { list, totalCount };
}

export async function getMyStoreInfo(userId: string): Promise<MyStoreDTO> {
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("store", `userId: ${userId}`);
  }
  const productCount = await storeRepository.countProductByStoreId(store.id);
  const monthFavoriteCount = await storeRepository.countMonthFavoriteStore(
    store.id
  );
  const favoriteCount = await storeRepository.countFavoriteStoreByStoreId(
    store.id
  );
  return new MyStoreDTO(store, favoriteCount, productCount, monthFavoriteCount);
}

export async function updateMyStore(
  dto: UpdateMyStoreDTO
): Promise<StoreResDTO> {
  const { storeId, userId, ...rest } = dto;
  const store = await storeRepository.findStoreByUserIdAndStoreId(
    userId,
    storeId
  );
  if (!store) {
    throw new UnauthError();
  }
  const result = await storeRepository.updateStore({ storeId, ...rest });
  return new StoreResDTO(result);
}

export async function registerFavoriteStore(
  dto: FavoriteStoreTargetDTO
): Promise<FavoriteStoreResDTO> {
  const { storeId, userId } = dto;
  const existingFavoriteStore =
    await storeRepository.countFavoriteStoreByStoreIdAndUserID(storeId, userId);
  if (existingFavoriteStore !== 0) {
    throw new AlreadyExstError("FavoriteStore");
  }
  const newFavoriteStore = await storeRepository.createFavoriteStore(dto);
  const store = await storeRepository.getStoreById(newFavoriteStore.storeId);
  return new FavoriteStoreResDTO(favoriteStoreType.register, store);
}

export async function deleteFavoriteStore(
  dto: FavoriteStoreTargetDTO
): Promise<FavoriteStoreResDTO> {
  const { storeId, userId } = dto;
  const existingFavoriteStore =
    await storeRepository.countFavoriteStoreByStoreIdAndUserID(storeId, userId);
  if (existingFavoriteStore === 0) {
    throw new NotFoundError(
      "FavoriteStore",
      `userId: ${userId} + storeId: ${storeId}`
    );
  }
  const deletedFavoriteStore = await storeRepository.deleteFavoriteStore(dto);
  const store = await storeRepository.getStoreById(
    deletedFavoriteStore.storeId
  );
  return new FavoriteStoreResDTO(favoriteStoreType.delete, store);
}

export async function getStoreById(storeId: string) {
  return await storeRepository.findStoreById(storeId);
}
