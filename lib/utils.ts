import { NextRouter } from 'next/router';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction utilitaire pour rediriger après un délai
export function redirectAfterDelay(router: NextRouter, url: string, delay: number): void {
  setTimeout(() => {
    router.push(url);
  }, delay);
}
