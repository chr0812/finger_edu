export type YmdString = string;
export type HmString = string;
export type IsoString = string;
export interface Audit { createdAt: IsoString; updatedAt: IsoString }
export interface Db {
  schemaVersion: 1;
  seq: { employee: number; department: number; position: number; rank: number; workType: number; holiday: number; leave: number };
  company: CompanyEntity; account: AccountEntity; departments: DepartmentEntity[]; positions: MasterEntity[]; ranks: MasterEntity[];
  workTypes: WorkTypeEntity[]; holidays: HolidayEntity[]; employees: EmployeeEntity[]; leaves: LeaveEntity[]; leaveGrants: LeaveGrantEntity[];
}
export interface CompanyEntity { companyId: 1; name: string; bizNo: string | null }
export interface AccountEntity extends Audit { accountId: 1; companyId: 1; loginId: string; password: string; name: string; email: string }
export interface DepartmentEntity extends Audit { departmentId: number; parentId: number | null; name: string; sortOrder: number }
export interface MasterEntity extends Audit { id: number; name: string; sortOrder: number }
export type WorkTypeKind = 'FIXED' | 'FLEXIBLE';
export interface WorkTypeEntity extends Audit { workTypeId: number; name: string; kind: WorkTypeKind; startTime: HmString | null; endTime: HmString | null; weeklyHours: number; isDefault: boolean }
export type HolidayType = 'HOLIDAY' | 'SUBSTITUTE';
export type HolidayOrigin = 'STATUTORY' | 'CUSTOM';
export interface HolidayEntity extends Audit { holidayId: number; date: YmdString; name: string; type: HolidayType; origin: HolidayOrigin }
export type EmployeeStatus = 'ACTIVE' | 'RESIGNED';
export type ContractType = 'REGULAR' | 'NON_REGULAR';
export interface EmployeeEntity extends Audit { employeeNo: string; name: string; phone: string; email: string; birthDate: YmdString; status: EmployeeStatus; hireDate: YmdString; contractType: ContractType; workTypeId: number; departmentId: number | null; positionId: number | null; rankId: number | null }
export type LeaveType = 'ANNUAL' | 'HALF';
export interface LeaveEntity { leaveId: number; employeeNo: string; leaveType: LeaveType; startDate: YmdString; endDate: YmdString; days: number; reason: string | null; registeredDate: YmdString; createdAt: IsoString }
export interface LeaveGrantEntity { employeeNo: string; year: number; granted: number; lastGrantedDate: YmdString }
export interface Page<T> { items: T[]; page: number; size: number; totalElements: number; totalPages: number }
export interface LoginRequest { loginId: string; password: string }
export interface Me { accountId: number; loginId: string; name: string; company: { companyId: number; name: string } }
export interface EmployeeQuery { status?: EmployeeStatus; departmentIds?: number[]; unassigned?: boolean; keywordType?: 'name' | 'email' | 'phone'; keyword?: string; sort?: 'name,asc' | 'name,desc' | 'hireDate,asc' | 'hireDate,desc'; page?: number; size?: number }
export interface EmployeeListItem { employeeNo: string; name: string; departmentId: number | null; departmentName: string | null; positionName: string | null; rankName: string | null; status: EmployeeStatus; hireDate: YmdString }
export interface EmployeeInput { name: string; phone: string; email: string; birthDate: YmdString; status: EmployeeStatus; departmentId: number | null; positionId: number | null; rankId: number | null; contractType: ContractType; hireDate: YmdString; workTypeId: number }
export interface EmployeeDetail extends EmployeeInput { employeeNo: string; hasLeaves: boolean }
export interface DepartmentNode { departmentId: number; parentId: number | null; name: string; sortOrder: number; depth: number; employeeCount: number }
export interface DepartmentTree { companyName: string; totalEmployees: number; unassignedCount: number; departments: DepartmentNode[] }
export interface MasterItem { id: number; name: string; sortOrder: number; employeeCount: number }
export interface MasterInput { id: number | null; name: string }
export interface WorkType extends Omit<WorkTypeEntity, 'createdAt' | 'updatedAt'> { employeeCount: number }
export interface WorkTypeInput { name: string; kind: WorkTypeKind; startTime: HmString | null; endTime: HmString | null; weeklyHours: number }
export type Holiday = Omit<HolidayEntity, 'createdAt' | 'updatedAt'>;
export interface HolidayQuery { from: YmdString; to: YmdString }
export interface HolidayInput { date: YmdString; name: string }
export interface LeaveQuery { leaveType?: LeaveType; departmentIds?: number[]; unassigned?: boolean; from?: YmdString; to?: YmdString; page?: number; size?: number }
export interface LeaveRecord { leaveId: number; employeeNo: string; employeeName: string; employeeResigned: boolean; departmentName: string | null; rankName: string | null; leaveType: LeaveType; registeredDate: YmdString; startDate: YmdString; endDate: YmdString; days: number; reason: string | null }
export interface LeaveInput { employeeNo: string; leaveType: LeaveType; startDate: YmdString; endDate: YmdString; reason?: string | null }
export interface LeavePreview { days: number; year: number; granted: number; used: number; remainingBefore: number; remainingAfter: number }
export interface LeaveGrantQuery { year: number; departmentIds?: number[]; unassigned?: boolean; keyword?: string; page?: number; size?: number }
export interface LeaveGrantRow { employeeNo: string; name: string; departmentName: string | null; rankName: string | null; hireDate: YmdString; tenure: { years: number; months: number } | null; year: number; granted: number; used: number; remaining: number; lastGrantedDate: YmdString | null }
export interface LeaveGrantInput { employeeNo: string; year: number; amount: number }
