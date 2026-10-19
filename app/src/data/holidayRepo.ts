import { DataError, validation } from './errors';
import { requireAuth, writeAuthed } from './store';
import { dateRangeDays } from '../lib/date';
import { validDate } from './calc';
import type { Holiday, HolidayInput, HolidayQuery } from './types';
function dto(h: Holiday): Holiday { return { holidayId: h.holidayId, date: h.date, name: h.name, type: h.type, origin: h.origin }; }
export const holidayRepo = {
  async list(q: HolidayQuery): Promise<Holiday[]> { const db = requireAuth(); if (!validDate(q.from) || !validDate(q.to) || q.to < q.from || dateRangeDays(q.from, q.to) > 366) validation('to', '조회 기간은 최대 366일까지 설정할 수 있습니다.'); return db.holidays.filter(h => h.date >= q.from && h.date <= q.to).sort((a, b) => a.date.localeCompare(b.date)).map(dto); },
  async create(input: HolidayInput): Promise<Holiday> { return writeAuthed(db => { if (!validDate(input.date) || input.date < '2000-01-01' || input.date > '2100-12-31') validation('date', '일자 형식이 올바르지 않습니다.'); const name = input.name.trim(); if (!name || name.length > 30) validation('name', name ? '휴일명 형식이 올바르지 않습니다.' : '필수 입력 항목입니다.'); if (db.holidays.some(h => h.date === input.date)) throw new DataError('HOLIDAY_DATE_DUPLICATED'); const stamp = new Date().toISOString(); const h = { holidayId: ++db.seq.holiday, date: input.date, name, type: 'HOLIDAY' as const, origin: 'CUSTOM' as const, createdAt: stamp, updatedAt: stamp }; db.holidays.push(h); return dto(h); }); },
  async remove(id: number): Promise<void> { writeAuthed(db => { const h = db.holidays.find(item => item.holidayId === id); if (!h) throw new DataError('NOT_FOUND'); if (h.origin === 'STATUTORY') throw new DataError('HOLIDAY_STATUTORY_PROTECTED'); db.holidays = db.holidays.filter(item => item.holidayId !== id); }); }
};
