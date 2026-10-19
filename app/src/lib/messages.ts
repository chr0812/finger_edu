import { DataError } from '../data/errors';
export const MSG = {
  required: '필수 입력 항목입니다.', saved: '저장되었습니다.', deleted: '삭제되었습니다.', dirty: '작성 중인 내용이 있습니다. 닫으시겠습니까?', empty: '조회 결과가 없습니다.', error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', auth: '로그인이 필요합니다. 다시 로그인해 주세요.', noDept: '부서를 1개 이상 선택해 주세요.', periodOrder: '종료일은 시작일보다 빠를 수 없습니다.', periodLong: '조회 기간은 최대 366일까지 설정할 수 있습니다.', reset: '데모 데이터를 처음 상태로 되돌렸습니다.', invalidLogin: '아이디 또는 비밀번호가 올바르지 않습니다.'
} as const;
const errors: Record<string, string> = { AUTH_REQUIRED: MSG.auth, AUTH_INVALID_CREDENTIALS: MSG.invalidLogin, STORAGE_UNAVAILABLE: '브라우저 저장소를 사용할 수 없습니다. 시크릿 모드이거나 저장소가 차단되어 있는지 확인해 주세요.', STORAGE_QUOTA: '브라우저 저장 공간이 부족합니다. [데모 초기화] 후 다시 시도해 주세요.', EMP_HAS_LEAVES: '휴가 기록이 있는 직원은 삭제할 수 없습니다. 퇴사 처리해 주세요.', DEPT_NAME_DUPLICATED: '같은 상위 부서 아래 동일한 이름의 부서가 있습니다.', DEPT_HAS_EMPLOYEES: '소속 직원이 있는 부서는 삭제할 수 없습니다. 직원을 먼저 이동해 주세요.', DEPT_HAS_CHILDREN: '하위 부서가 있는 부서는 삭제할 수 없습니다.', DEPT_DEPTH_EXCEEDED: '부서는 최대 5단계까지 만들 수 있습니다.', MASTER_NAME_DUPLICATED: '이름이 중복되었습니다.', LEAVE_OVERLAP: '선택한 기간에 이미 등록된 휴가가 있습니다.', LEAVE_ZERO_DAYS: '선택한 기간에 사용할 수 있는 근무일이 없습니다. (주말·휴일 제외)', LEAVE_EMPLOYEE_NOT_ACTIVE: '재직 중인 직원만 선택할 수 있습니다.', GRANT_NEGATIVE_TOTAL: '부여 후 총 부여일수가 0보다 작을 수 없습니다.', WORKTYPE_NAME_DUPLICATED: '이미 사용 중인 근무유형 이름입니다.', WORKTYPE_DEFAULT_PROTECTED: '기본 제공 근무유형은 삭제할 수 없습니다.', WORKTYPE_IN_USE: '적용 직원이 있는 근무유형은 삭제할 수 없습니다.', HOLIDAY_DATE_DUPLICATED: '이미 등록된 휴일 일자입니다.', HOLIDAY_STATUTORY_PROTECTED: '법정공휴일은 삭제할 수 없습니다.' };
export function errorMessage(error: unknown): string { return error instanceof DataError ? (errors[error.code] ?? error.message ?? MSG.error) : MSG.error; }
export const guide: Record<string, string> = {
  '/employees': '직원 정보는 관리자만 등록·수정할 수 있습니다. / 휴가 기록이 있는 직원은 삭제할 수 없으며 퇴사 처리만 가능합니다.',
  '/organization/departments': '소속 직원이나 하위 부서가 있는 부서는 삭제할 수 없습니다. 부서는 최대 5단계까지 만들 수 있습니다.',
  '/organization/titles': "사용 중인 항목을 삭제하면 해당 직원의 직책·직위가 '미지정'으로 바뀝니다. 변경 후 [저장]을 눌러야 반영됩니다.",
  '/leaves/records': '휴가는 관리자가 직접 등록하며 등록 즉시 확정됩니다. 사용일수는 주말과 회사설정의 휴일을 제외하고 계산합니다. 반차는 0.5일입니다.',
  '/leaves/grants': '연차는 관리자가 직접 부여합니다. 사용일수는 시작일이 속한 연도에 집계됩니다. 잘못 부여한 경우 음수 값으로 정정할 수 있습니다.',
  '/settings/work-types': '기본 제공 근무유형과 적용 직원이 있는 근무유형은 삭제할 수 없습니다.',
  '/settings/holidays': '법정공휴일은 삭제할 수 없고, 직접 추가한 휴일만 삭제할 수 있습니다. 휴일을 바꿔도 이미 등록된 휴가의 사용일수는 바뀌지 않습니다.'
};
