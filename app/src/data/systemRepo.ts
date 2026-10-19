import { createSeed } from './seed';
import { readSession, saveDb } from './store';
import { DataError } from './errors';
export const systemRepo = { async resetDemo(): Promise<void> { if (readSession() === null) throw new DataError('AUTH_REQUIRED'); saveDb(createSeed()); } };
