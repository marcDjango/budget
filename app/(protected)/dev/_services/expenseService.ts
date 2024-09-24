import { PrismaClient } from "@prisma/client";
import { createBalance } from "@/app/(protected)/dev/_utils/updateBalance"; // Nouvelle fonction utilitaire

const prisma = new PrismaClient();

export const expenseService = {
  async createExpense(data: any) {
    try {
      const newExpense = await prisma.expense.create({ data });
      return newExpense;
    } catch (error) {
      throw new Error("Could not create expense");
    }
  },

  async updateExpense(id: string, data: any) {
    try {
      // Récupérer la dépense actuelle avant la mise à jour
      const currentExpense = await prisma.expense.findUnique({
        where: { id },
      });

      if (!currentExpense) {
        throw new Error("Dépense non trouvée");
      }
      // Mise à jour de la dépense
      const updatedExpense = await prisma.expense.update({
        where: { id },
        data,
      });

      if (updatedExpense && updatedExpense.id === id) {
        console.log("Mise à jour réussie :", updatedExpense);

        // Récupérer le dernier solde pour cet utilisateur et ce compte
        const previousBalance = await prisma.balance.findMany({
          where: {
            userId: updatedExpense.userId,
            accountId: updatedExpense.accountId as string,
          },
          orderBy: { updatedAt: "desc" }, // Trier par date de mise à jour la plus récente
          take: 1, // Récupérer uniquement le dernier
        });

        if (previousBalance.length === 0) {
          throw new Error(
            "Aucun solde trouvé pour cet utilisateur et ce compte"
          );
        }

        // Calculer le nouveau solde
        let newBalanceAmount = previousBalance[0].amount;

        if (!currentExpense.paid && data.paid) {
          newBalanceAmount -= updatedExpense.amount;
        } else if (currentExpense.paid && !data.paid) {
          if (currentExpense.amount === data.amount) {
            newBalanceAmount += updatedExpense.amount;
          } else {
            newBalanceAmount += currentExpense.amount;
          }
        }

        // Créer un nouveau solde avec le montant mis à jour
        const newBalance = await prisma.balance.create({
          data: {
            userId: updatedExpense.userId,
            accountId: updatedExpense.accountId as string,
            amount: newBalanceAmount,
          },
        });

        console.log("Nouveau solde créé :", newBalance);

        return updatedExpense;
      } else {
        throw new Error("Mise à jour échouée : données invalides");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense :", error);
      throw new Error("Could not update expense");
    }
  },
};
