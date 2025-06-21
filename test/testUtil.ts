import prisma from "../src/lib/prisma";
import request from "supertest";
import app from "../src/app";
import bcrypt from "bcrypt";
import { User } from "../src/types/user";
import { createAccessToken } from "../src/utils/jwt";

export async function clearDatabase() {
  await prisma.reply.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favoriteStore.deleteMany();
  await prisma.alarm.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.grade.deleteMany();
}

export async function disconnectTestDB() {
  await prisma.$disconnect();
}

export async function createTestUser(userData: Omit<User, "id">) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      type: userData.type,
    },
  });
}

// agent 와 유사하게 header를 자동 세팅해주는 함수
// 사용법은 store.test.ts 를 참고하세요~
export function getAuthenticatedReq(userId: string) {
  const accessToken = createAccessToken(userId);
  const agent = request(app);

  return {
    get: (url: string) =>
      agent.get(url).set("Authorization", `Bearer ${accessToken}`),
    post: (url: string) =>
      agent.post(url).set("Authorization", `Bearer ${accessToken}`),
    put: (url: string) =>
      agent.put(url).set("Authorization", `Bearer ${accessToken}`),
    delete: (url: string) =>
      agent.delete(url).set("Authorization", `Bearer ${accessToken}`),
    patch: (url: string) =>
      agent.patch(url).set("Authorization", `Bearer ${accessToken}`),
  };
}
