import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

async function createStockTx(
  tx: Prisma.TransactionClient,
  data: Prisma.StockCreateInput
) {
  return await tx.stock.create({ data });
}

async function findStocksByProductId(productId: string) {
  return await prisma.stock.findMany({
    where: {
      productId: productId,
    },
  });
}

async function updateStockTx(
  tx: Prisma.TransactionClient,
  input: { where: Prisma.StockWhereUniqueInput; data: Prisma.StockUpdateInput }
) {
  return await tx.stock.update(input);
}

export default {
  createStockTx,
  findStocksByProductId,
  updateStockTx,
};
