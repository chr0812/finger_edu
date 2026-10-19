후속 작업: Vercel 배포 대비 (범위 밖 기능 추가 없음, 코드 로직 변경 금지)

1. vercel.json 없이도 정상 동작하는지 확인한다. 정적 서버(vite preview)에서 /#/leaves/grants 등을 새로고침해도 화면이 열려야 한다.
2. package.json에 engines.node를 명시한다.
3. app/README.md에 Vercel 설정값을 적는다: Framework Preset=Vite, Root Directory=app, Build Command=npm run build, Output Directory=dist.
4. npm run build, npm test가 계속 통과하는지 확인하고 결과를 보고한다.
