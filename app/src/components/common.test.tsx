import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DeptPicker } from './DeptPicker';
import { Modal } from './Modal';
import { Login } from '../features/auth/Login';
import { authRepo } from '../data/authRepo';
import { createSeed } from '../data/seed';
import { saveDb } from '../data/store';
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); saveDb(createSeed()); });
afterEach(cleanup);
const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{children}</QueryClientProvider>;
describe('공통 컴포넌트', () => {
  it('부모 부서 선택 시 하위 부서를 함께 고른다', async () => { await authRepo.login({ loginId: 'admin', password: 'admin1234' }); let chosen: number[] = []; render(<DeptPicker mode="multi" selectedIds={[]} includeUnassigned onConfirm={r => { chosen = r.departmentIds; }} onCancel={() => undefined} />, { wrapper }); const input = await screen.findByLabelText('개발팀'); fireEvent.click(input); fireEvent.click(screen.getByText('확인')); expect(chosen).toEqual(expect.arrayContaining([1, 2, 3])); });
  it('dirty 모달 닫기 전에 확인한다', () => { let closed = false; render(<Modal title="편집" dirty onClose={() => { closed = true; }}><input aria-label="값" /></Modal>); fireEvent.click(screen.getByLabelText('닫기')); expect(screen.getByText('작성 중인 내용이 있습니다. 닫으시겠습니까?')).toBeTruthy(); expect(closed).toBe(false); });
  it('외부 redirect를 무시한다', async () => { render(<MemoryRouter initialEntries={['/login?redirect=https://example.com']}><Routes><Route path="/login" element={<Login />} /><Route path="/employees" element={<p>직원 목록 도착</p>} /></Routes></MemoryRouter>, { wrapper }); fireEvent.click(await screen.findByTestId('login.fillDemo')); fireEvent.click(screen.getByTestId('login.submit')); await waitFor(() => expect(screen.getByText('직원 목록 도착')).toBeTruthy()); });
});
