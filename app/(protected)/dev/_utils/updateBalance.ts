import { PrismaClient } from "@prisma/client";

export async function createBalance(userId: string, amount: number, accountId: string) {
    try {
      const prisma = new PrismaClient();
     
      const newBalance = await prisma.balance.create({
        data: {
          userId,
          amount,
          accountId,
        },
      });
  
      return newBalance;
    } catch (error) {
      console.error("Error creating balance:", error);
      throw new Error("Could not create balance");
    } 
  }
  