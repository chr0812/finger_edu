import { createSeed } from './seed';
import { DataError } from './errors';
import type { Db } from './types';

const DB_KEY = 'myhr.v1.db';
const SESSION_KEY = 'myhr.v1.session';
function storageError(error: unknown): DataError { return new DataError(error instanceof DOMException && error.name === 'QuotaExceededError' ? 'STORAGE_QUOTA' : 'STORAGE_UNAVAILABLE'); }
export function ensureSeeded(): Db {
  let raw: string | null;
  try { raw = localStorage.getItem(DB_KEY); } catch (error) { throw storageError(error); }
  if (raw) {
    try { const parsed: unknown = JSON.parse(raw); if (parsed && typeof parsed === 'object' && 'schemaVersion' in parsed && parsed.schemaVersion === 1) return parsed as Db; } catch { /* invalid JSON is reseeded */ }
  }
  const seed = createSeed();
  saveDb(seed);
  return seed;
}
export function readDb(): Db { return ensureSeeded(); }
export function saveDb(db: Db): void { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (error) { throw storageError(error); } }
export function writeDb<T>(change: (copy: Db) => T): T { const copy = structuredClone(readDb()); const result = change(copy); saveDb(copy); return result; }
export function readSession(): number | null {
  try { const raw = sessionStorage.getItem(SESSION_KEY); if (!raw) return null; const value: unknown = JSON.parse(raw); return value && typeof value === 'object' && 'accountId' in value && value.accountId === 1 ? 1 : null; } catch (error) { if (error instanceof SyntaxError) return null; throw storageError(error); }
}
export function setSession(accountId: number): void { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ accountId })); } catch (error) { throw storageError(error); } }
export function clearSession(): void { try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { throw storageError(error); } }
export function requireAuth(): Db { if (readSession() === null) throw new DataError('AUTH_REQUIRED'); return readDb(); }
export function writeAuthed<T>(change: (copy: Db) => T): T { if (readSession() === null) throw new DataError('AUTH_REQUIRED'); return writeDb(change); }
export function subscribe(listener: () => void): () => void { const handler = (event: StorageEvent) => { if (event.key === DB_KEY || event.key === SESSION_KEY) listener(); }; window.addEventListener('storage', handler); return () => window.removeEventListener('storage', handler); }
