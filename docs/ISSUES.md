# GitHub Issues 현황

> 📅 최종 업데이트: 2025-12-24  
> 📊 전체 이슈: 7개 (진행 중: 7개, 완료: 0개)

---

## 📋 Phase 1: 프로젝트 초기 설정

### [Issue #1: 개발 환경 설정](https://github.com/Bsagom/Calculator-Demo/issues/1)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
프로젝트 개발을 시작하기 위한 기본 환경을 설정합니다. Node.js, Jest, ESLint, Prettier 등 필수 도구들을 설치하고 설정합니다.

#### 작업 내용
- [ ] Node.js 및 npm 설치 확인
- [ ] package.json 생성
- [ ] Jest 설치 및 설정
  - [ ] Jest 패키지 설치
  - [ ] jest.config.js 생성
  - [ ] package.json에 테스트 스크립트 추가
- [ ] ESLint, Prettier 설정
  - [ ] ESLint 설치 및 .eslintrc.json 생성
  - [ ] Prettier 설치 및 .prettierrc 생성
  - [ ] .editorconfig 생성
- [ ] .gitignore 파일 생성
  - [ ] node_modules 제외
  - [ ] coverage 폴더 제외
- [ ] Git 저장소 초기화 및 첫 커밋

#### 인수 조건
- [ ] `npm test` 명령어가 정상 작동
- [ ] `npm run test:watch` 명령어가 정상 작동  
- [ ] `npm run test:coverage` 명령어가 정상 작동
- [ ] ESLint 검사가 정상 작동
- [ ] Prettier 포맷팅이 정상 작동
- [ ] .gitignore가 node_modules와 coverage 폴더를 제외

**예상 시간:** 1일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 1.1

---

### [Issue #2: 프로젝트 구조 생성](https://github.com/Bsagom/Calculator-Demo/issues/2)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
프로젝트의 기본 폴더 구조와 파일들을 생성합니다. 코어 로직, UI, 테스트 폴더를 분리하여 관심사를 명확히 합니다.

#### 작업 내용
- [ ] 폴더 구조 생성
  - [ ] `js/core/` - 코어 로직
  - [ ] `js/ui/` - UI 레이어
  - [ ] `js/utils/` - 유틸리티
  - [ ] `tests/core/` - 코어 로직 테스트
  - [ ] `tests/utils/` - 유틸리티 테스트
  - [ ] `css/` - 커스텀 CSS
  - [ ] `assets/` - 이미지, 아이콘
- [ ] 기본 HTML 파일 생성 (`index.html`)
- [ ] README.md 작성

#### 인수 조건
- [ ] 모든 폴더가 생성되어 있음
- [ ] index.html 파일이 존재
- [ ] README.md에 프로젝트 설명이 포함됨
- [ ] 폴더 구조가 docs/TASKS.md의 명세와 일치

**예상 시간:** 0.5일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 1.2

---

### [Issue #3: 기본 HTML 구조 작성](https://github.com/Bsagom/Calculator-Demo/issues/3)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
계산기 웹앱의 기본 HTML 구조를 작성합니다. Tailwind CSS, Google Fonts, Material Icons를 추가하여 디자인 기반을 마련합니다.

#### 작업 내용
- [ ] Tailwind CSS CDN 추가
- [ ] Google Fonts 추가 (Space Grotesk, Noto Sans)
- [ ] Material Icons 추가
- [ ] 기본 레이아웃 구조 작성
  - [ ] Header 영역
  - [ ] Display 영역
  - [ ] Keypad 영역

#### 인수 조건
- [ ] index.html이 브라우저에서 정상적으로 열림
- [ ] Tailwind CSS가 적용됨
- [ ] Google Fonts가 로드됨
- [ ] Material Icons가 표시됨
- [ ] 기본 레이아웃이 디자인 레퍼런스와 유사함

**예상 시간:** 0.5일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 1.3  
**디자인 레퍼런스:** docs/design_reference/

---

## 🔧 Phase 2: 핵심 기능 구현 (TDD)

### [Issue #4: 유틸리티 함수 구현 (TDD)](https://github.com/Bsagom/Calculator-Demo/issues/4)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
계산기의 핵심 유틸리티 함수들을 TDD 방식으로 구현합니다. 각도 변환, 숫자 포맷팅, 입력 검증 등 재사용 가능한 함수들을 작성합니다.

#### 작업 내용

**각도 변환 함수 (`utils/angleConverter.js`)**
- [ ] 테스트: deg → rad 변환
- [ ] 테스트: rad → rad (그대로)
- [ ] 테스트: grad → rad 변환
- [ ] 구현: `convertAngle(value, mode)`
- [ ] 리팩토링

**숫자 포맷팅 함수 (`utils/formatter.js`)**
- [ ] 테스트: 일반 숫자 포맷팅
- [ ] 테스트: 지수 표기법 (큰 숫자)
- [ ] 테스트: 소수점 자리수 제한
- [ ] 구현: `formatNumber(num, maxDecimals)`
- [ ] 리팩토링

**입력 검증 함수 (`utils/validator.js`)**
- [ ] 테스트: 유효한 문자 검증
- [ ] 테스트: 괄호 매칭 검증
- [ ] 구현: `validateExpression(expr)`
- [ ] 리팩토링

#### 인수 조건
- [ ] 모든 테스트가 통과 (Red-Green-Refactor 완료)
- [ ] 테스트 커버리지 80% 이상
- [ ] 각 함수가 단일 책임 원칙(SRP)을 준수
- [ ] JSDoc 주석 작성 완료
- [ ] ESLint 검사 통과

**예상 시간:** 2일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 2.1  
**개발 규칙:** .agent/rules/tdd.md, .agent/rules/solid.md

---

### [Issue #5: 기본 연산 구현 (TDD)](https://github.com/Bsagom/Calculator-Demo/issues/5)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
사칙연산을 TDD 방식으로 구현합니다. Operation 인터페이스를 정의하고 개방-폐쇄 원칙(OCP)을 준수하여 확장 가능한 구조를 만듭니다.

#### 작업 내용

**Operation 인터페이스 (`core/operations/Operation.js`)**
- [ ] 추상 클래스 정의
- [ ] `execute()` 메서드 정의

**사칙연산 구현**

**AddOperation.js**
- [ ] 테스트: 양수 덧셈
- [ ] 테스트: 음수 덧셈
- [ ] 테스트: 0 덧셈
- [ ] 구현 및 리팩토링

**SubtractOperation.js**
- [ ] 테스트 작성 (양수, 음수, 0)
- [ ] 구현 및 리팩토링

**MultiplyOperation.js**
- [ ] 테스트 작성 (양수, 음수, 0)
- [ ] 구현 및 리팩토링

**DivideOperation.js**
- [ ] 테스트: 일반 나눗셈
- [ ] 테스트: 0으로 나누기 (예외)
- [ ] 테스트: 음수 나눗셈
- [ ] 구현 및 리팩토링

#### 인수 조건
- [ ] 모든 테스트가 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] Operation 인터페이스를 모든 연산이 상속
- [ ] 0으로 나누기 시 적절한 예외 발생
- [ ] SOLID 원칙 준수 (특히 OCP, LSP)
- [ ] ESLint 검사 통과

**예상 시간:** 2일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 2.2  
**개발 규칙:** .agent/rules/tdd.md, .agent/rules/solid.md

---

### [Issue #6: 과학 함수 - 삼각함수 구현 (TDD)](https://github.com/Bsagom/Calculator-Demo/issues/6)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
공학용 계산기의 핵심 기능인 삼각함수를 TDD 방식으로 구현합니다. 각도 모드(deg/rad/grad)를 지원하며, 각도 변환 유틸리티를 활용합니다.

#### 작업 내용

**SinOperation.js**
- [ ] 테스트: sin(0) = 0
- [ ] 테스트: sin(30°) = 0.5
- [ ] 테스트: sin(90°) = 1
- [ ] 구현 (각도 변환 포함)
- [ ] 리팩토링

**CosOperation.js**
- [ ] 테스트: cos(0°) = 1
- [ ] 테스트: cos(60°) = 0.5
- [ ] 테스트: cos(90°) = 0
- [ ] 구현
- [ ] 리팩토링

**TanOperation.js**
- [ ] 테스트: tan(0°) = 0
- [ ] 테스트: tan(45°) = 1
- [ ] 테스트: tan(90°) 예외 처리
- [ ] 구현
- [ ] 리팩토링

#### 인수 조건
- [ ] 모든 테스트가 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] deg, rad, grad 모드 모두 정상 작동
- [ ] angleConverter 유틸리티 활용 (DIP 준수)
- [ ] 부동소수점 오차 처리 (toBeCloseTo 사용)
- [ ] ESLint 검사 통과

**예상 시간:** 1.5일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 2.3  
**의존성:** #4 (유틸리티 함수)

---

### [Issue #7: 과학 함수 - 로그 및 지수 구현 (TDD)](https://github.com/Bsagom/Calculator-Demo/issues/7)
**상태:** 🟡 OPEN  
**생성일:** 2025-12-23

#### 작업 배경
공학용 계산기의 고급 기능인 로그, 지수, 제곱근 등을 TDD 방식으로 구현합니다. 예외 처리(음수 로그, 0으로 나누기 등)를 철저히 합니다.

#### 작업 내용

**PowerOperation.js (거듭제곱)**
- [ ] 테스트: 2^3 = 8
- [ ] 테스트: 2^0 = 1
- [ ] 테스트: 2^(-1) = 0.5
- [ ] 구현 및 리팩토링

**SqrtOperation.js (제곱근)**
- [ ] 테스트: √4 = 2
- [ ] 테스트: √0 = 0
- [ ] 테스트: √(-1) 예외 처리
- [ ] 구현 및 리팩토링

**LogOperation.js (로그)**
- [ ] 테스트: log(10) = 1
- [ ] 테스트: log(1) = 0
- [ ] 테스트: log(0) 및 log(-1) 예외 처리
- [ ] 구현 및 리팩토링

**LnOperation.js (자연로그)**
- [ ] 테스트: ln(e) = 1
- [ ] 테스트: ln(1) = 0
- [ ] 테스트: ln(0) 및 ln(-1) 예외 처리
- [ ] 구현 및 리팩토링

**ReciprocalOperation.js (역수)**
- [ ] 테스트: 1/2 = 0.5
- [ ] 테스트: 1/0 예외 처리
- [ ] 구현 및 리팩토링

**PercentOperation.js (백분율)**
- [ ] 테스트: 50% = 0.5
- [ ] 테스트: 100% = 1
- [ ] 구현 및 리팩토링

#### 인수 조건
- [ ] 모든 테스트가 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] 음수 로그, 음수 제곱근 등 예외 처리
- [ ] 0으로 나누기 예외 처리
- [ ] Operation 인터페이스 상속
- [ ] ESLint 검사 통과

**예상 시간:** 1.5일  
**관련 문서:** [docs/TASKS.md](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md) - Phase 2.3

---

## 📊 진행 현황 요약

### Phase 1: 프로젝트 초기 설정
| Issue | 제목 | 상태 | 예상 시간 |
|-------|------|------|-----------|
| #1 | 개발 환경 설정 | 🟡 OPEN | 1일 |
| #2 | 프로젝트 구조 생성 | 🟡 OPEN | 0.5일 |
| #3 | 기본 HTML 구조 작성 | 🟡 OPEN | 0.5일 |
| **합계** | **3개 이슈** | **진행 중** | **2일** |

### Phase 2: 핵심 기능 구현 (TDD)
| Issue | 제목 | 상태 | 예상 시간 |
|-------|------|------|-----------|
| #4 | 유틸리티 함수 구현 (TDD) | 🟡 OPEN | 2일 |
| #5 | 기본 연산 구현 (TDD) | 🟡 OPEN | 2일 |
| #6 | 과학 함수 - 삼각함수 구현 (TDD) | 🟡 OPEN | 1.5일 |
| #7 | 과학 함수 - 로그 및 지수 구현 (TDD) | 🟡 OPEN | 1.5일 |
| **합계** | **4개 이슈** | **진행 중** | **7일** |

### 전체 요약
- **총 이슈 수:** 7개
- **완료:** 0개 (0%)
- **진행 중:** 7개 (100%)
- **총 예상 시간:** 9일

---

## 🔗 관련 문서

- [PRD (Product Requirements Document)](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/PRD.md)
- [기술 명세서 (TechSpec)](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TechSpec.md)
- [작업 계획 (TASKS)](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/TASKS.md)
- [배포 가이드 (Deployment)](file:///c:/Users/배성환/Desktop/캡스톤/workspace/Calculator-Demo-2/docs/Deployment.md)

---

## 📝 업데이트 이력

- **2025-12-24:** 초기 이슈 현황 문서 생성 (7개 이슈)
