/**
 * The common-namespace dictionary pair. ar is the source of truth for the
 * key set (Arabic-first repo convention); en is checked complete against it
 * — a missing or extra en key is a compile error.
 */
export { ar } from './ar.ts'
export { en } from './en.ts'
export type { CommonKey } from './ar.ts'
