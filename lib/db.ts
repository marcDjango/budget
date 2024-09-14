import { PrismaClient } from "@prisma/client";

declare global {
  // Permet d'utiliser 'prisma' globalement sans provoquer d'erreur TypeScript
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// Vérification correcte de la variable d'environnement
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
