// lib/session.ts
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

let sessionCache: any = null;
let sessionTimestamp: number = 0;

export async function fetchSession(req: NextApiRequest) {
  const cacheDuration = 60000; // Cache pendant 60 secondes
  const now = Date.now();

  if (!sessionCache || now - sessionTimestamp > cacheDuration) {
    sessionCache = await getSession({ req });
    sessionTimestamp = now;
  }

  return sessionCache;
}
