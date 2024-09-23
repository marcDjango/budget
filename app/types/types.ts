// types.ts

export type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  role: string;
};

export type Session = {
  user: User;
  expires: string;
} | null;

export type Account = {
  id: string;
  userId: string;              // Référence à l'utilisateur propriétaire du compte
  typeId: string;              // Référence au type de compte (perso ou conjoint)
  isDefault: boolean;
  provider?: string | null;    // Le fournisseur (ex: Google, GitHub)
  providerAccountId?: string | null; // ID du compte chez le fournisseur
  refresh_token?: string | null;     // Jeton de rafraîchissement pour OAuth
  access_token?: string | null;      // Jeton d'accès pour OAuth
  expires_at?: number | null;        // Expiration du jeton OAuth en timestamp UNIX
  token_type?: string | null;        // Type de jeton (par ex: Bearer)
  scope?: string | null;             // Portée du jeton OAuth
  id_token?: string | null;          // Jeton d'identification pour OAuth
  session_state?: string | null;     // État de la session pour OAuth
  authorizedUserId?: string | null;  // Référence à l'utilisateur autorisé (nullable)
  createdAt: Date;                   // Date de création
  updatedAt: Date;                   // Date de mise à jour automatique (optionnel si besoin)
};
