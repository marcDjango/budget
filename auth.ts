// Importations nécessaires
import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import authConfig from "./auth.config"; // Auth configuration, assuming it's already set up


// Configuration NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db), // Utiliser Prisma Adapter
  session: { strategy: "jwt" }, // JWT pour les sessions
  callbacks: {
    // Manipuler la session pour ajouter l'ID utilisateur et le rôle
    async session({ token, session }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    // Manipuler le JWT pour ajouter des données personnalisées
    async jwt({ token }: any) {
      if (!token.sub) return token; // Si pas d'utilisateur, on retourne le token inchangé
      const existingUser = await getUserById(token.sub); // Récupère l'utilisateur existant
      if (!existingUser) return token; // Si l'utilisateur n'existe pas
      token.role = existingUser.role; // Ajoute le rôle dans le token
      return token;
    }
  },
  ...authConfig, // Autres configurations spécifiques (fournisseurs, etc.)
});


