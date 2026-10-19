import { DataError } from './errors';
import { clearSession, ensureSeeded, readSession, setSession } from './store';
import type { LoginRequest, Me } from './types';
function toMe(): Me { const db = ensureSeeded(); return { accountId: db.account.accountId, loginId: db.account.loginId, name: db.account.name, company: { companyId: db.company.companyId, name: db.company.name } }; }
export const authRepo = {
  async login(req: LoginRequest): Promise<Me> { const db = ensureSeeded(); if (req.loginId !== db.account.loginId || req.password !== db.account.password) throw new DataError('AUTH_INVALID_CREDENTIALS'); setSession(db.account.accountId); return toMe(); },
  async me(): Promise<Me | null> { return readSession() === null ? null : toMe(); },
  async logout(): Promise<void> { clearSession(); }
};
