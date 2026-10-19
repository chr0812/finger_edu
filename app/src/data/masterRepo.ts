import { DataError, validation } from './errors';
import { requireAuth, writeAuthed } from './store';
import type { Db, MasterInput, MasterItem } from './types';
type Kind = 'positions' | 'ranks';
function listKind(db: Db, kind: Kind): MasterItem[] { const field = kind === 'positions' ? 'positionId' : 'rankId'; return db[kind].map(item => ({ id: item.id, name: item.name, sortOrder: item.sortOrder, employeeCount: db.employees.filter(e => e[field] === item.id).length })).sort((a, b) => a.sortOrder - b.sortOrder); }
function repo(kind: Kind) { return {
  async list(): Promise<MasterItem[]> { return listKind(requireAuth(), kind); },
  async saveAll(items: MasterInput[]): Promise<MasterItem[]> { return writeAuthed(db => { const names = new Set<string>(); const oldIds = new Set(db[kind].map(item => item.id)); const stamp = new Date().toISOString(); const next = items.map((item, index) => { const name = item.name.trim(); if (!name || name.length > 20) validation('name', name ? '형식이 올바르지 않습니다.' : '필수 입력 항목입니다.'); const lower = name.toLocaleLowerCase(); if (names.has(lower)) throw new DataError('MASTER_NAME_DUPLICATED'); names.add(lower); if (item.id !== null && !oldIds.has(item.id)) validation('id', '형식이 올바르지 않습니다.'); const id = item.id ?? ++db.seq[kind === 'positions' ? 'position' : 'rank']; const old = db[kind].find(existing => existing.id === id); return { id, name, sortOrder: index + 1, createdAt: old?.createdAt ?? stamp, updatedAt: stamp }; }); const retained = new Set(next.map(item => item.id)); const field = kind === 'positions' ? 'positionId' : 'rankId'; db.employees.forEach(e => { if (e[field] !== null && !retained.has(e[field]!)) e[field] = null; }); db[kind] = next; return listKind(db, kind); }); }
}; }
export const positionRepo = repo('positions');
export const rankRepo = repo('ranks');
