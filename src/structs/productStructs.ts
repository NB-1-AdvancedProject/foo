import {
  array,
  date,
  defaulted,
  Infer,
  number,
  object,
  optional,
  string,
} from "superstruct";
import { integerString } from "./commonStructs";

export const CreateProductBodyStruct = object({
  name: string(),
  price: number(),
  content: string(),
  image: string(),
  discountRate: optional(number()),
  discountStartTime: optional(date()),
  discountEndTime: optional(date()),
  categoryName: string(),
  stocks: array(
    object({
      sizeId: string(),
      quantity: number(),
    })
  ),
});

export type CreateProductBody = Infer<typeof CreateProductBodyStruct>;

export const PatchProductBodyStruct = object({
  name: optional(string()),
  price: optional(number()),
  content: optional(string()),
  image: optional(string()),
  discountRate: optional(number()),
  discountStartTime: optional(date()),
  discountEndTime: optional(date()),
  categoryName: optional(string()),
  stocks: optional(
    array(
      object({
        sizeId: string(),
        quantity: number(),
      })
    )
  ),
});

export type PatchProductBody = Infer<typeof PatchProductBodyStruct>;

export const ProductListParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 16),
  search: optional(string()),
  searchBy: optional(string()),
  sort: optional(string()),
  priceMin: optional(number()),
  priceMax: optional(number()),
  favoriteStore: optional(string()),
  size: optional(string()),
  categoryName: optional(string()),
});

export type ProductListParams = Infer<typeof ProductListParamsStruct>;
