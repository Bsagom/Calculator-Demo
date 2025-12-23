# GitHub Actions & GitHub Pages 배포 가이드

## 개요
이 프로젝트는 GitHub Actions를 통해 자동으로 빌드되고, GitHub Pages에 배포됩니다.

---

## 배포 워크플로우

### 자동 배포 트리거
- `main` 브랜치에 코드가 푸시될 때 자동 실행
- 수동 실행도 가능 (workflow_dispatch)

### 배포 프로세스
```
코드 푸시 (main)
    ↓
GitHub Actions 트리거
    ↓
빌드 작업 (build job)
    ↓
아티팩트 업로드
    ↓
배포 작업 (deploy job)
    ↓
GitHub Pages 배포 완료
```

---

## 초기 설정 방법

### 1. GitHub 저장소 생성

```bash
# 로컬 Git 초기화
git init

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Scientific Calculator Web App"

# 기본 브랜치를 main으로 설정
git branch -M main

# 원격 저장소 추가 (본인의 GitHub 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/Calculator-Demo-2.git

# 푸시
git push -u origin main
```

### 2. GitHub Pages 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Source: **GitHub Actions** 선택
5. 설정 완료!

### 3. 워크플로우 권한 확인

1. **Settings** > **Actions** > **General**로 이동
2. **Workflow permissions** 섹션에서:
   - ✅ **Read and write permissions** 선택
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크
3. **Save** 클릭

---

## 워크플로우 파일 설명

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

# 트리거 조건
on:
  push:
    branches:
      - main          # main 브랜치에 푸시 시
  workflow_dispatch:  # 수동 실행 가능

# 권한 설정
permissions:
  contents: read      # 저장소 읽기
  pages: write        # Pages 쓰기
  id-token: write     # OIDC 토큰

# 동시 실행 방지
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # 빌드 작업
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'    # 전체 프로젝트 업로드

  # 배포 작업
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build       # build 작업 완료 후 실행
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 배포 확인

### 1. 워크플로우 실행 확인

1. GitHub 저장소의 **Actions** 탭으로 이동
2. 최근 워크플로우 실행 상태 확인
3. 각 단계별 로그 확인 가능

### 2. 배포된 사이트 접속

배포가 완료되면 다음 URL로 접속 가능:
```
https://YOUR_USERNAME.github.io/Calculator-Demo-2/
```

또는 저장소 **Settings** > **Pages**에서 배포된 URL 확인

---

## 배포 프로세스

### 일반적인 개발 워크플로우

```bash
# 1. 코드 수정
# (index.html, js/*, css/* 등 수정)

# 2. 변경사항 확인
git status

# 3. 스테이징
git add .

# 4. 커밋
git commit -m "feat: Add new calculator feature"

# 5. 푸시 (자동 배포 트리거)
git push origin main

# 6. GitHub Actions에서 자동 빌드 & 배포
# 7. 1-2분 후 배포 완료
```

### 커밋 메시지 컨벤션 (권장)

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정 등
```

예시:
```bash
git commit -m "feat: Add trigonometric functions"
git commit -m "fix: Resolve division by zero error"
git commit -m "docs: Update README with deployment guide"
```

---

## 문제 해결

### 배포 실패 시

#### 1. 워크플로우 로그 확인
- **Actions** 탭에서 실패한 워크플로우 클릭
- 빨간색 X 표시된 단계 확인
- 에러 메시지 확인

#### 2. 권한 문제
```
Error: Resource not accessible by integration
```
**해결 방법**:
- Settings > Actions > General
- Workflow permissions를 "Read and write permissions"로 변경

#### 3. Pages 설정 문제
```
Error: Pages deployment failed
```
**해결 방법**:
- Settings > Pages
- Source가 "GitHub Actions"로 설정되어 있는지 확인

#### 4. 브랜치 문제
```
Error: No commits on main branch
```
**해결 방법**:
```bash
git branch -M main
git push -u origin main
```

### 로컬에서 테스트

배포 전 로컬에서 테스트:

```bash
# Python 서버 (Python 3)
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

또는 VS Code의 Live Server 확장 사용

---

## 고급 설정

### 커스텀 도메인 설정 (선택 사항)

1. 도메인 구매 (예: example.com)
2. DNS 설정:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
3. GitHub 저장소 Settings > Pages
4. Custom domain에 도메인 입력 (예: www.example.com)
5. Enforce HTTPS 체크

### 환경별 배포 (선택 사항)

개발/스테이징/프로덕션 환경 분리:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches:
      - develop

# staging 환경으로 배포
```

---

## 성능 모니터링

### Lighthouse CI (선택 사항)

배포 시 자동으로 성능 측정:

```yaml
# .github/workflows/deploy.yml에 추가
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://YOUR_USERNAME.github.io/Calculator-Demo-2/
    uploadArtifacts: true
```

---

## 체크리스트

배포 전 확인사항:

- [ ] Git 저장소 초기화 완료
- [ ] GitHub 원격 저장소 생성 및 연결
- [ ] `.github/workflows/deploy.yml` 파일 생성
- [ ] GitHub Pages 설정 (Source: GitHub Actions)
- [ ] Workflow permissions 설정 (Read and write)
- [ ] main 브랜치에 코드 푸시
- [ ] Actions 탭에서 워크플로우 실행 확인
- [ ] 배포된 URL 접속 테스트

---

## 참고 자료

### 공식 문서
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)

### 유용한 링크
- [GitHub Actions 마켓플레이스](https://github.com/marketplace?type=actions)
- [Workflow 문법](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## 배포 상태 뱃지

README.md에 배포 상태 뱃지 추가:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/Calculator-Demo-2/actions/workflows/deploy.yml/badge.svg)
```

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-12-23  
**작성자**: AI Assistant
