import { prisma } from "../prisma/client";

export async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = String(1000 + Math.floor(Math.random() * 9000));
    const existing = await prisma.order.findUnique({ where: { orderNumber: candidate } });
    if (!existing) return candidate;
  }

  return String(Date.now()).slice(-6);
}
