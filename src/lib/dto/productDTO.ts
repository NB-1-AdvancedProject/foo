import { StocksReponseDTO } from "./stockDTO";
import { Product } from "@prisma/client";
export class DetailProductResponseDTO {
  id: string;
  name: string;
  content: string;
  price: number;
  image: string;
  stocks: StocksReponseDTO;

  constructor(
    id: string,
    name: string,
    content: string,
    price: number,
    image: string,
    createdAt: Date,
    updatedAt: Date,
    discountRate: number | null,
    discountStartTime: Date | null,
    discountEndTime: Date | null,
    category: { id: string; name: string }, //DTO 로 처리필요
    rewiews: {
      id: string;
      content: string;
      rating: number;
      createdAt: Date;
      updatedAt: Date;
      user: { id: string; name: string }; //DTO로 처리필요
    }[], //DTO로 처리필요
    stocks: StocksReponseDTO
  ) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.price = price;
    this.image = image;
    this.stocks = stocks;
  }
}

// export class ProductListDTO {
//   list: {
//     id: string;
//     name: string;
//     price: number;
//     discountPrice?: number | null;
//     image: string;
//     content: string;
//     categoryId: string;
//     storeId: string;
//     storeName?: string;
//     discountRate?: number | null;
//     discountStartTime?: string | null;
//     discountEndTime?: string | null;
//     sales: number;
//     reviewsCount?: number | null;
//     reviewsRating?: number | null;
//     createdAt: string;
//     updatedAt: string;
//   }[];

//   constructor(products: Product[]) {
//     this.list = products.map((p) => {
//       const price = Number(p.price);
//       const discount = p.discountRate
//         ? price * (1 - p.discountRate / 100)
//         : price;

//       return {
//         id: p.id,
//         name: p.name,
//         price,
//         discountPrice: p.discountRate ? Math.round(discount) : null,
//         image: p.image,
//         content: p.content,
//         categoryId: p.categoryId,
//         storeId: p.storeId,
//         storeName: p.store.name,
//         discountRate: p.discountRate,
//         discountStartTime: p.discountStartTime
//           ? p.discountStartTime.toISOString()
//           : null,
//         discountEndTime: p.discountEndTime
//           ? p.discountEndTime.toISOString()
//           : null,
//         sales: p.sales,
//         reviewsCount: p.reviewsCount,
//         reviewsRating: p.reviewsRating,
//         createdAt: p.createdAt.toISOString(),
//         updatedAt: p.updatedAt.toISOString(),
//       };
//     });
//   }
// }

// export class ProductListResponseDTO {
//   list: ProductListDTO["list"];
//   totalCount: number;

//   constructor(productList: ProductListDTO, totalCount: number) {
//     this.list = productList.list;
//     this.totalCount = totalCount;
//   }
// }
