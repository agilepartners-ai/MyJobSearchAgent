import { atom } from "jotai";

// Atom to store the API token (no longer using Tavus)
export const apiTokenAtom = atom<string | null>(null);

// Atom to track if token is being validated
export const isValidatingTokenAtom = atom(false);

// Derived atom to check if token exists
export const hasTokenAtom = atom((get) => get(apiTokenAtom) !== null);
