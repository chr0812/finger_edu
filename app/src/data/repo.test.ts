import { beforeEach, describe, expect, it } from 'vitest';
import { authRepo } from './authRepo';
import { departmentRepo } from './departmentRepo';
import { employeeRepo } from './employeeRepo';
import { holidayRepo } from './holidayRepo';
import { workTypeRepo } from './workTypeRepo';
import { leaveGrantRepo } from './leaveGrantRepo';
import { leaveRepo } from './leaveRepo';
import { positionRepo } from './positionRepo';
import { createSeed } from './seed';
import { pageOf, tenure } from './calc';
import { readDb, saveDb } from './store';

beforeEach(async () => { localStorage.clear(); sessionStorage.clear(); saveDb(createSeed()); await authRepo.login({ loginId: 'admin', password: 'admin1234' }); });
describe('시드', () => {
  it('91 §11 수치', async () => { expect((await employeeRepo.list()).totalElements).toBe(12); expect((await employeeRepo.list({ status: 'ACTIVE' })).totalElements).toBe(11); expect((await departmentRepo.list()).departments.map(d => d.employeeCount)).toEqual([1, 3, 2, 3, 2]); expect((await holidayRepo.list({ from: '2026-01-01', to: '2026-12-31' })).length).toBe(21); expect((await leaveGrantRepo.list({ year: 2026 })).totalElements).toBe(11); const grant = (await leaveGrantRepo.list({ year: 2026 })).items.find(r => r.employeeNo === '000001'); expect([grant?.granted, grant?.used, grant?.remaining]).toEqual([20, 4, 16]); });
});
describe('휴가', () => {
  it('주말, 휴일, 반차, 연말 걸침', async () => { expect((await leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-10-08', endDate: '2026-10-12' })).days).toBe(2); expect((await leaveRepo.preview({ employeeNo: '000002', leaveType: 'HALF', startDate: '2026-10-08', endDate: '2026-10-12' })).days).toBe(0.5); const p = await leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-12-30', endDate: '2027-01-02' }); expect([p.days, p.year]).toEqual([3, 2026]); });
  it('겹침과 근무일 0 차단', async () => { await expect(leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-10-02', endDate: '2026-10-02' })).rejects.toMatchObject({ code: 'LEAVE_OVERLAP' }); await expect(leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-10-03', endDate: '2026-10-03' })).rejects.toMatchObject({ code: 'LEAVE_ZERO_DAYS' }); });
});
describe('삭제와 일괄 저장', () => {
  it('하위 부서 우선 차단', async () => { await expect(departmentRepo.remove(1)).rejects.toMatchObject({ code: 'DEPT_HAS_CHILDREN' }); await expect(departmentRepo.remove(4)).rejects.toMatchObject({ code: 'DEPT_HAS_EMPLOYEES' }); });
  it('직책 삭제 시 직원 참조 null, 중복 거부', async () => { await positionRepo.saveAll([{ id: 2, name: '파트장' }]); expect((await employeeRepo.get('000001')).positionId).toBeNull(); await expect(positionRepo.saveAll([{ id: 2, name: '파트장' }, { id: null, name: '파트장' }])).rejects.toMatchObject({ code: 'MASTER_NAME_DUPLICATED' }); });
  it('직원 삭제 시 부여 기록 삭제, 휴가 직원은 차단', async () => { await expect(employeeRepo.remove('000001')).rejects.toMatchObject({ code: 'EMP_HAS_LEAVES' }); await employeeRepo.remove('000008'); expect(readDb().leaveGrants.some(g => g.employeeNo === '000008')).toBe(false); });
  it('부여 합계 음수 차단', async () => { await expect(leaveGrantRepo.grant({ employeeNo: '000002', year: 2026, amount: -18.5 })).rejects.toMatchObject({ code: 'GRANT_NEGATIVE_TOTAL' }); expect((await leaveGrantRepo.list({ year: 2026 })).items.find(r => r.employeeNo === '000002')?.granted).toBe(18); });
});
describe('회사설정', () => {
  it('기본 근무유형 보호와 유연 유형 시간 정리', async () => { await expect(workTypeRepo.remove(1)).rejects.toMatchObject({ code: 'WORKTYPE_DEFAULT_PROTECTED' }); const value = await workTypeRepo.create({ name: '새 유연', kind: 'FLEXIBLE', startTime: '09:00', endTime: '18:00', weeklyHours: 40 }); expect([value.startTime, value.endTime]).toEqual([null, null]); });
  it('법정 휴일 보호와 추가 휴일 계산 반영', async () => { await expect(holidayRepo.remove(1)).rejects.toMatchObject({ code: 'HOLIDAY_STATUTORY_PROTECTED' }); const before = await leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-12-24', endDate: '2026-12-24' }); expect(before.days).toBe(1); await holidayRepo.create({ date: '2026-12-24', name: '회사 휴무일' }); await expect(leaveRepo.preview({ employeeNo: '000002', leaveType: 'ANNUAL', startDate: '2026-12-24', endDate: '2026-12-24' })).rejects.toMatchObject({ code: 'LEAVE_ZERO_DAYS' }); });
});
describe('계산', () => {
  it('말일과 윤년 근속', () => { expect(tenure('2024-02-29', '2025-02-28')).toEqual({ years: 0, months: 11 }); expect(tenure('2024-01-31', '2024-02-29')).toEqual({ years: 0, months: 0 }); });
  it('페이지를 범위로 보정', () => { expect(pageOf([1, 2, 3], 99, 2)).toMatchObject({ page: 2, totalPages: 2, items: [3] }); });
});
