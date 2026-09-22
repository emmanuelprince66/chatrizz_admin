import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Two-letter initials: "Akinola Samson" -> "AS". A single word, or an email
 * address, uses its first two letters: "akinolasamson1234@gmail.com" -> "AK".
 */
export function getInitials(nameOrEmail: string): string {
  const source = nameOrEmail.split("@")[0]
  const words = source.split(/[^\p{L}]+/u).filter(Boolean)
  if (words.length === 0) return "?"
  const initials =
    words.length === 1
      ? words[0].slice(0, 2)
      : `${words[0][0]}${words[words.length - 1][0]}`
  return initials.toUpperCase()
}
