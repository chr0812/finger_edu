import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
type Toast = { id: number; text: string; kind: 'success' | 'error' };
const Context = createContext<(text: string, kind?: Toast['kind']) => void>(() => undefined);
export function ToastProvider({ children }: { children: ReactNode }) { const [toasts, setToasts] = useState<Toast[]>([]); const show = useCallback((text: string, kind: Toast['kind'] = 'success') => { const id = Date.now() + Math.random(); setToasts(old => [...old.slice(-2), { id, text, kind }]); window.setTimeout(() => setToasts(old => old.filter(item => item.id !== id)), kind === 'success' ? 3000 : 5000); }, []); return <Context.Provider value={show}>{children}<div className="toast-stack" role="status">{toasts.map(item => <div key={item.id} className={`toast ${item.kind}`}>{item.text}</div>)}</div></Context.Provider>; }
export const useToast = () => useContext(Context);
