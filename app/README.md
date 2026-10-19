# MY 직원관리 데모

직원관리·조직도·회사설정을 시연하는 브라우저 전용 앱입니다. 샘플 데이터는 브라우저 `localStorage`에 저장되고, 로그인 상태는 `sessionStorage`에 저장됩니다.

## 로컬 실행

```sh
npm install
npm run dev
```

데모 계정: `admin` / `admin1234`

정적 빌드: `npm run build` (`dist/` 생성). 로컬 빌드 확인: `npm run preview`.

## Vercel 배포

Vercel 프로젝트를 만들 때 **Root Directory를 `app`**으로 설정합니다. `app/vercel.json`에서 Vite 빌드와 `dist` 출력 디렉터리를 지정합니다. 라우터가 해시 경로를 사용하므로 추가 rewrite 설정은 필요하지 않습니다.

배포된 사이트에서도 각 사용자의 브라우저 저장소에 데이터가 보관됩니다. 사용자 간 공유나 기기 간 동기화는 지원하지 않습니다.

## 폴더

- `src/data`: 시드, 저장소, Repository, 업무 규칙
- `src/features`: 로그인, 회사설정, 조직도, 직원등록 화면
- `src/components`: 공통 모달, 테이블, 부서선택, 토스트

휴가관리 화면은 현재 작업 범위에 포함되지 않습니다. 기존 데이터 계층의 휴가 계산과 샘플 휴가 데이터는 직원 삭제 제한 등 직원관리 동작에 사용됩니다.
