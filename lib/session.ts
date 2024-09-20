import { auth } from "@/auth";
import { cache } from "react";

import React from 'react'

export const getSession = cache(async () =>{
  const session = await auth();
  return session;
})
