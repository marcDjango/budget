import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Création des types de comptes
  const personalAccountType = await prisma.accountType.create({
    data: {
      name: "personal", // ou 'Perso'
    },
  });

  const jointAccountType = await prisma.accountType.create({
    data: {
      name: "joint", // ou 'Conjoint'
    },
  });

  // Création de deux utilisateurs
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@mail.com",
      password: "$2b$10$NoKgMmWa3lAyf.04DkTha.GuReRyhjxAxjFg4iRCf.urE57KcRNwe", // Exemple de mot de passe hashé
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@mail.com",
      password: "$2b$10$NoKgMmWa3lAyf.04DkTha.GuReRyhjxAxjFg4iRCf.urE57KcRNwe", // Exemple de mot de passe hashé
      role: "USER",
    },
  });

  // Création des comptes
  const personalAccount1 = await prisma.account.create({
    data: {
      userId: user1.id,
      typeId: personalAccountType.id, // Utilisation du type de compte personnel créé ci-dessus
      provider: "bank",
      providerAccountId: "unique-provider-id-1",
    },
  });

  const jointAccount1 = await prisma.account.create({
    data: {
      userId: user1.id,
      typeId: jointAccountType.id, // Utilisation du type de compte conjoint créé ci-dessus
      provider: "bank",
      providerAccountId: "unique-provider-id-2",
    },
  });

  const personalAccount2 = await prisma.account.create({
    data: {
      userId: user2.id,
      typeId: personalAccountType.id, // Utilisation du type de compte personnel
      provider: "bank",
      providerAccountId: "unique-provider-id-3",
    },
  });

  // Créer des soldes pour chaque compte avec un montant initial de 0
  await prisma.balance.createMany({
    data: [
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        amount: 0,
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        amount: 0,
      },
      {
        userId: user2.id,
        accountId: personalAccount2.id,
        amount: 0,
      },
    ],
  });
  // Créer des charges fixes (Loyer, électricité, assurance, etc.)
  await prisma.expense.createMany({
    data: [
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Loyer",
        amount: 1500.0,
        category: "Logement",
        paid: true,
        paymentDate: new Date(2024, 8, 1),
        type: "FIXED",
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Électricité",
        amount: 100.0,
        category: "Services Publics",
        paid: true,
        paymentDate: new Date(2024, 8, 5),
        type: "FIXED",
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Eau",
        amount: 30.0,
        category: "Services Publics",
        paid: true,
        paymentDate: new Date(2024, 8, 7),
        type: "FIXED",
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Abonnement Internet",
        amount: 50.0,
        category: "Télécommunications",
        paid: false,
        type: "FIXED",
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Assurance habitation",
        amount: 25.0,
        category: "Assurance",
        paid: true,
        paymentDate: new Date(2024, 8, 3),
        type: "FIXED",
      },
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        name: "Prêt immobilier",
        amount: 800.0,
        category: "Crédit",
        paid: false,
        type: "FIXED",
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Restaurant en famille",
        amount: 120.0,
        category: "Loisirs",
        paid: false,
        type: "MONTHLY",
        month: 9,
        year: 2024,
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Sortie cinéma",
        amount: 50.0,
        category: "Loisirs",
        paid: true,
        paymentDate: new Date(2024, 8, 12),
        type: "MONTHLY",
        month: 9,
        year: 2024,
      },
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        name: "Loisirs - parc d’attraction",
        amount: 200.0,
        category: "Loisirs",
        paid: false,
        type: "MONTHLY",
        month: 9,
        year: 2024,
      },
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        name: "Courses alimentaires",
        amount: 400.0,
        category: "Alimentation",
        paid: true,
        paymentDate: new Date(2024, 8, 8),
        type: "MONTHLY",
        month: 9,
        year: 2024,
      },
    ],
  });
  // Créer des charges fixes pour chaque utilisateur
  await prisma.fixedExpense.createMany({
    data: [
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        name: "Loyer",
        amount: 1200,
        category: "Logement",
        paid: false,
        paymentDate: new Date(2024, 8, 5), // 5 septembre 2024
        occurrence: "monthly",
      },
      {
        userId: user1.id,
        accountId: jointAccount1.id,
        name: "Électricité",
        amount: 100,
        category: "Services",
        paid: true,
        paymentDate: new Date(2024, 8, 5),
        occurrence: "monthly",
      },
      {
        userId: user2.id,
        accountId: personalAccount2.id,
        name: "Internet",
        amount: 50,
        category: "Services",
        paid: false,
        paymentDate: new Date(2024, 8, 5),
        occurrence: "monthly",
      },
    ],
  });

  // Créer des dépenses mensuelles pour chaque utilisateur
  await prisma.monthlyExpense.createMany({
    data: [
      {
        userId: user1.id,
        accountId: personalAccount1.id,
        month: new Date().getMonth() + 1, // Mois courant
        year: new Date().getFullYear(),
        amount: 1300, // Montant total des dépenses
      },
      {
        userId: user2.id,
        accountId: personalAccount2.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 1350, // Montant total des dépenses
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
