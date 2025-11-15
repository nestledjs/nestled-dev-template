import { type ClassValue, cn } from 'cn'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(cn(inputs))
}
