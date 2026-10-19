import type { Db, DepartmentEntity, EmployeeEntity, HolidayEntity, LeaveEntity, LeaveGrantEntity, MasterEntity, WorkTypeEntity } from './types';

const stamp = '2026-10-19T00:00:00.000Z';
const audit = { createdAt: stamp, updatedAt: stamp };
const departments: DepartmentEntity[] = [
  [1, null, '개발팀', 1], [2, 1, '백엔드', 1], [3, 1, '프런트엔드', 2], [4, null, '인프라팀', 2], [5, null, '경영지원팀', 3]
].map(([departmentId, parentId, name, sortOrder]) => ({ departmentId: Number(departmentId), parentId: parentId === null ? null : Number(parentId), name: String(name), sortOrder: Number(sortOrder), ...audit }));
const positions: MasterEntity[] = ['팀장', '파트장'].map((name, i) => ({ id: i + 1, name, sortOrder: i + 1, ...audit }));
const ranks: MasterEntity[] = ['사원', '대리', '과장', '차장', '부장'].map((name, i) => ({ id: i + 1, name, sortOrder: i + 1, ...audit }));
const workTypes: WorkTypeEntity[] = [
  { workTypeId: 1, name: '표준근무', kind: 'FIXED', startTime: '09:00', endTime: '18:00', weeklyHours: 40, isDefault: true, ...audit },
  { workTypeId: 2, name: '시차출근', kind: 'FIXED', startTime: '10:00', endTime: '19:00', weeklyHours: 40, isDefault: false, ...audit },
  { workTypeId: 3, name: '유연근무', kind: 'FLEXIBLE', startTime: null, endTime: null, weeklyHours: 40, isDefault: false, ...audit }
];
const employeeRows = [
  ['한도윤', 1, 1, 5, 'REGULAR', '2015-03-02', '1980-05-14', 1, 'ACTIVE'],
  ['서지민', 2, 2, 4, 'REGULAR', '2018-09-03', '1985-11-02', 1, 'ACTIVE'],
  ['윤하준', 2, null, 2, 'REGULAR', '2022-02-14', '1991-03-21', 1, 'ACTIVE'],
  ['강서아', 2, null, 1, 'REGULAR', '2024-03-04', '1999-08-09', 2, 'ACTIVE'],
  ['임주원', 3, 2, 3, 'REGULAR', '2020-06-15', '1988-01-30', 1, 'ACTIVE'],
  ['조예린', 3, null, 2, 'REGULAR', '2023-01-09', '1993-12-05', 3, 'ACTIVE'],
  ['배도현', 4, 1, 4, 'REGULAR', '2017-11-20', '1984-07-17', 1, 'ACTIVE'],
  ['신유나', 4, null, 1, 'NON_REGULAR', '2025-04-01', '2000-04-25', 2, 'ACTIVE'],
  ['문재우', 5, 1, 3, 'REGULAR', '2019-01-21', '1987-09-12', 1, 'ACTIVE'],
  ['오하은', 5, null, 2, 'REGULAR', '2021-08-02', '1994-06-28', 1, 'ACTIVE'],
  ['권태양', null, null, 1, 'NON_REGULAR', '2026-09-01', '2001-10-10', 1, 'ACTIVE'],
  ['장수빈', 4, null, 2, 'REGULAR', '2020-03-16', '1992-02-19', 1, 'RESIGNED']
] as const;
const employees: EmployeeEntity[] = employeeRows.map(([name, departmentId, positionId, rankId, contractType, hireDate, birthDate, workTypeId, status], i) => ({
  employeeNo: String(i + 1).padStart(6, '0'), name, departmentId, positionId, rankId, contractType, hireDate, birthDate, workTypeId, status,
  phone: `010555000${String(i + 1).padStart(2, '0')}`, email: `emp${String(i + 1).padStart(2, '0')}@example.com`, ...audit
}));
const grantRows = [20, 18, 15, 15, 17, 15, 19, 11, 17, 16, null, 15];
const leaveGrants: LeaveGrantEntity[] = grantRows.flatMap((granted, i) => granted === null ? [] : [{ employeeNo: String(i + 1).padStart(6, '0'), year: 2026, granted, lastGrantedDate: '2026-01-02' }]);
const leaveRows = [
  [12, 'ANNUAL', '2026-03-04', '2026-03-06', 3, '2026-02-20', '개인 사정'],
  [1, 'ANNUAL', '2026-05-26', '2026-05-29', 4, '2026-05-12', '가족 행사 (5/25 대체공휴일 제외 구간)'],
  [3, 'ANNUAL', '2026-08-10', '2026-08-14', 5, '2026-07-20', '여름 휴가'],
  [5, 'ANNUAL', '2026-09-21', '2026-09-23', 3, '2026-09-01', '추석 연휴 연계'],
  [2, 'HALF', '2026-10-02', '2026-10-02', 0.5, '2026-09-25', '병원 진료'],
  [6, 'ANNUAL', '2026-10-12', '2026-10-13', 2, '2026-10-05', null],
  [10, 'ANNUAL', '2026-10-22', '2026-10-23', 2, '2026-10-15', null],
  [7, 'HALF', '2026-10-26', '2026-10-26', 0.5, '2026-10-16', null]
] as const;
const leaves: LeaveEntity[] = leaveRows.map(([employee, leaveType, startDate, endDate, days, registeredDate, reason], i) => ({ leaveId: i + 1, employeeNo: String(employee).padStart(6, '0'), leaveType, startDate, endDate, days, registeredDate, reason, createdAt: stamp }));
const holidayRows = [
  ['2026-01-01', '신정', 'HOLIDAY'], ['2026-02-16', '설날 연휴', 'HOLIDAY'], ['2026-02-17', '설날', 'HOLIDAY'], ['2026-02-18', '설날 연휴', 'HOLIDAY'],
  ['2026-03-01', '삼일절', 'HOLIDAY'], ['2026-03-02', '삼일절 대체공휴일', 'SUBSTITUTE'], ['2026-05-05', '어린이날', 'HOLIDAY'],
  ['2026-05-24', '부처님오신날', 'HOLIDAY'], ['2026-05-25', '부처님오신날 대체공휴일', 'SUBSTITUTE'], ['2026-06-03', '전국동시지방선거일', 'HOLIDAY'],
  ['2026-06-06', '현충일', 'HOLIDAY'], ['2026-08-15', '광복절', 'HOLIDAY'], ['2026-08-17', '광복절 대체공휴일', 'SUBSTITUTE'],
  ['2026-09-24', '추석 연휴', 'HOLIDAY'], ['2026-09-25', '추석', 'HOLIDAY'], ['2026-09-26', '추석 연휴', 'HOLIDAY'],
  ['2026-10-03', '개천절', 'HOLIDAY'], ['2026-10-05', '개천절 대체공휴일', 'SUBSTITUTE'], ['2026-10-09', '한글날', 'HOLIDAY'],
  ['2026-12-25', '성탄절', 'HOLIDAY'], ['2026-11-20', '창립기념일', 'HOLIDAY']
] as const;
const holidays: HolidayEntity[] = holidayRows.map(([date, name, type], i) => ({ holidayId: i + 1, date, name, type, origin: i === 20 ? 'CUSTOM' : 'STATUTORY', ...audit }));

export function createSeed(): Db { return structuredClone({ schemaVersion: 1, seq: { employee: 12, department: 5, position: 2, rank: 5, workType: 3, holiday: 21, leave: 8 }, company: { companyId: 1, name: '샘플컴퍼니', bizNo: null }, account: { accountId: 1, companyId: 1, loginId: 'admin', password: 'admin1234', name: '김관리', email: 'admin@example.com', ...audit }, departments, positions, ranks, workTypes, holidays, employees, leaves, leaveGrants }); }
