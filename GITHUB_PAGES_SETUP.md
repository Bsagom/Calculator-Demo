# GitHub Pages 설정 가이드

## 문제
GitHub Actions 워크플로우가 실패하는 이유:
```
Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

## 해결 방법

### 1. GitHub 저장소로 이동
https://github.com/Bsagom/Calculator-Demo

### 2. Settings 탭 클릭
저장소 상단 메뉴에서 **Settings** 클릭

### 3. Pages 설정
왼쪽 사이드바에서 **Pages** 클릭

### 4. Source 설정
**Build and deployment** 섹션에서:
- **Source**: `GitHub Actions` 선택 (기본값은 Deploy from a branch일 수 있음)

### 5. 저장 및 확인
설정이 자동으로 저장됩니다.

### 6. 워크플로우 재실행
1. **Actions** 탭으로 이동
2. 실패한 워크플로우 클릭
3. 우측 상단의 **Re-run all jobs** 버튼 클릭

## 또는 수동으로 푸시하여 재실행

```bash
# 빈 커밋으로 워크플로우 재실행
git commit --allow-empty -m "chore: Trigger workflow after Pages setup"
git push origin main
```

## 확인 방법

워크플로우가 성공하면:
1. **Actions** 탭에서 녹색 체크 표시 확인
2. 배포된 사이트 접속: https://bsagom.github.io/Calculator-Demo/

## 스크린샷 가이드

### Settings → Pages 화면
```
Build and deployment
┌─────────────────────────────────────┐
│ Source                              │
│ ┌─────────────────────────────────┐ │
│ │ GitHub Actions              ▼   │ │  ← 이것을 선택
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 추가 참고

- GitHub Pages는 public 저장소에서 무료로 사용 가능
- private 저장소는 GitHub Pro 이상 필요
- 배포 URL: `https://<username>.github.io/<repository-name>/`
