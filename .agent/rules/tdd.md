---
description: Test-Driven Development (TDD) 규칙
---

# TDD (Test-Driven Development) 규칙

## 개요
이 프로젝트의 **코어 로직(UI 제외)**은 반드시 **TDD(Test-Driven Development)** 방식으로 구현해야 합니다.

---

## TDD 프로세스

### Red-Green-Refactor 사이클

```
1. 🔴 RED: 실패하는 테스트 작성
   ↓
2. 🟢 GREEN: 테스트를 통과하는 최소한의 코드 작성
   ↓
3. 🔵 REFACTOR: 코드 개선 및 리팩토링
   ↓
   (반복)
```

### 구체적인 단계

#### 1. RED - 실패하는 테스트 작성
```javascript
// tests/calculator.test.js
describe('Calculator', () => {
    test('should add two numbers', () => {
        const calc = new Calculator();
        expect(calc.add(2, 3)).toBe(5);
    });
});

// 실행 결과: ❌ FAIL (Calculator 클래스가 아직 없음)
```

#### 2. GREEN - 테스트 통과하는 최소 코드
```javascript
// js/calculator.js
class Calculator {
    add(a, b) {
        return a + b;
    }
}

// 실행 결과: ✅ PASS
```

#### 3. REFACTOR - 코드 개선
```javascript
// 필요시 코드 개선, 중복 제거, 최적화
// 테스트는 계속 통과해야 함
```

---

## TDD 적용 범위

### ✅ TDD 필수 적용 영역 (코어 로직)

1. **계산 엔진** (`js/calculator.js`)
   - 사칙연산
   - 삼각함수
   - 로그 및 지수 함수
   - 수학 상수

2. **수식 파서** (`js/parser.js`)
   - 토큰화
   - 구문 분석
   - 연산자 우선순위 처리

3. **상태 관리** (`js/stateManager.js`)
   - 상태 업데이트
   - 리스너 관리
   - 상태 조회

4. **히스토리 관리** (`js/historyManager.js`)
   - 히스토리 추가/삭제
   - 로컬 스토리지 저장/로드

5. **유틸리티 함수** (`js/utils.js`)
   - 숫자 포맷팅
   - 각도 변환
   - 입력 검증

### ❌ TDD 제외 영역 (UI 레이어)

1. **UI 렌더링** (`js/ui.js`)
   - DOM 조작
   - 화면 업데이트
   - 애니메이션

2. **이벤트 핸들러** (`js/eventHandlers.js`)
   - 버튼 클릭 이벤트
   - 키보드 입력 이벤트

3. **테마 관리** (`js/themeManager.js`)
   - 다크/라이트 모드 전환
   - CSS 클래스 조작

> **참고**: UI 레이어는 **수동 테스트**로 검증합니다. 자동화된 UI 테스트는 작성하지 않습니다.

---

## 테스트 작성 규칙

### 1. 테스트 파일 명명 규칙
```
소스 파일: js/calculator.js
테스트 파일: tests/calculator.test.js

소스 파일: js/parser.js
테스트 파일: tests/parser.test.js
```

### 2. 테스트 구조
```javascript
describe('클래스 또는 모듈 이름', () => {
    // 각 테스트 전에 실행
    beforeEach(() => {
        // 초기화 코드
    });

    // 각 테스트 후에 실행
    afterEach(() => {
        // 정리 코드
    });

    describe('메서드 이름', () => {
        test('should [예상 동작]', () => {
            // Arrange (준비)
            const input = ...;
            
            // Act (실행)
            const result = ...;
            
            // Assert (검증)
            expect(result).toBe(...);
        });
    });
});
```

### 3. 테스트 케이스 작성 원칙

#### AAA 패턴 (Arrange-Act-Assert)
```javascript
test('should calculate sine of 30 degrees', () => {
    // Arrange: 테스트 준비
    const calc = new Calculator();
    calc.setAngleMode('deg');
    
    // Act: 실행
    const result = calc.sin(30);
    
    // Assert: 검증
    expect(result).toBeCloseTo(0.5, 5);
});
```

#### 경계값 테스트
```javascript
describe('divide', () => {
    test('should divide two positive numbers', () => {
        expect(calc.divide(10, 2)).toBe(5);
    });
    
    test('should divide negative numbers', () => {
        expect(calc.divide(-10, 2)).toBe(-5);
    });
    
    test('should throw error when dividing by zero', () => {
        expect(() => calc.divide(10, 0)).toThrow('Division by zero');
    });
    
    test('should handle very small numbers', () => {
        expect(calc.divide(0.0001, 0.0001)).toBeCloseTo(1, 5);
    });
});
```

#### 에지 케이스 테스트
```javascript
describe('Parser edge cases', () => {
    test('should handle empty expression', () => {
        expect(() => parser.parse('')).toThrow();
    });
    
    test('should handle unmatched parentheses', () => {
        expect(() => parser.parse('(2 + 3')).toThrow();
    });
    
    test('should handle invalid characters', () => {
        expect(() => parser.parse('2 + @')).toThrow();
    });
});
```

### 4. 테스트 명명 규칙

#### ✅ 좋은 예
```javascript
test('should add two positive numbers', () => { });
test('should throw error when input is negative', () => { });
test('should return cached result for same input', () => { });
```

#### ❌ 나쁜 예
```javascript
test('test1', () => { });
test('add function', () => { });
test('it works', () => { });
```

---

## 테스트 도구

### Jest (권장)

#### 설치
```bash
npm install --save-dev jest
```

#### 설정
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 주요 Matcher

```javascript
// 동등성
expect(value).toBe(expected);           // ===
expect(value).toEqual(expected);        // 깊은 비교

// 숫자
expect(value).toBeCloseTo(expected, precision);
expect(value).toBeGreaterThan(number);
expect(value).toBeLessThan(number);

// 불린
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// 배열/객체
expect(array).toContain(item);
expect(array).toHaveLength(number);

// 예외
expect(() => func()).toThrow();
expect(() => func()).toThrow(Error);
expect(() => func()).toThrow('error message');

// 비동기
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## 코드 커버리지 목표

### 최소 커버리지 기준
- **라인 커버리지**: 80% 이상
- **함수 커버리지**: 80% 이상
- **브랜치 커버리지**: 80% 이상
- **구문 커버리지**: 80% 이상

### 커버리지 확인
```bash
npm run test:coverage
```

### 커버리지 리포트
```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
calculator.js       |     100 |      100 |     100 |     100 |
parser.js           |    95.5 |     90.5 |     100 |    95.5 |
stateManager.js     |      85 |       80 |      90 |      85 |
--------------------|---------|----------|---------|---------|
```

---

## TDD 워크플로우 예시

### 예시: 삼각함수 구현

#### Step 1: 테스트 작성 (RED)
```javascript
// tests/calculator.test.js
describe('Trigonometric functions', () => {
    let calc;
    
    beforeEach(() => {
        calc = new Calculator();
    });
    
    describe('sin', () => {
        test('should calculate sin(0) = 0', () => {
            calc.setAngleMode('deg');
            expect(calc.sin(0)).toBe(0);
        });
        
        test('should calculate sin(30) = 0.5', () => {
            calc.setAngleMode('deg');
            expect(calc.sin(30)).toBeCloseTo(0.5, 5);
        });
        
        test('should calculate sin(90) = 1', () => {
            calc.setAngleMode('deg');
            expect(calc.sin(90)).toBeCloseTo(1, 5);
        });
    });
});
```

#### Step 2: 구현 (GREEN)
```javascript
// js/calculator.js
class Calculator {
    constructor() {
        this.angleMode = 'deg';
    }
    
    setAngleMode(mode) {
        this.angleMode = mode;
    }
    
    sin(value) {
        const radians = this.toRadians(value);
        return Math.sin(radians);
    }
    
    toRadians(value) {
        if (this.angleMode === 'deg') {
            return value * (Math.PI / 180);
        }
        return value;
    }
}
```

#### Step 3: 리팩토링 (REFACTOR)
```javascript
// 각도 변환 로직을 별도 유틸리티로 분리
// utils.js
export function convertAngle(value, mode) {
    switch (mode) {
        case 'deg':
            return value * (Math.PI / 180);
        case 'rad':
            return value;
        case 'grad':
            return value * (Math.PI / 200);
        default:
            return value;
    }
}

// calculator.js
import { convertAngle } from './utils.js';

class Calculator {
    sin(value) {
        const radians = convertAngle(value, this.angleMode);
        return Math.sin(radians);
    }
}
```

---

## 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### Watch 모드 (개발 중)
```bash
npm run test:watch
```

### 특정 파일만 테스트
```bash
npm test calculator.test.js
```

### 커버리지와 함께 실행
```bash
npm run test:coverage
```

---

## CI/CD 통합

### GitHub Actions에서 테스트 실행
```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## 체크리스트

새로운 기능 추가 시:

- [ ] 테스트 먼저 작성 (RED)
- [ ] 테스트가 실패하는지 확인
- [ ] 최소한의 코드로 테스트 통과 (GREEN)
- [ ] 코드 리팩토링 (REFACTOR)
- [ ] 모든 테스트가 여전히 통과하는지 확인
- [ ] 커버리지 80% 이상 유지
- [ ] 에지 케이스 테스트 추가
- [ ] 코드 리뷰 전 테스트 실행

---

## 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [TDD by Example - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**규칙 버전**: 1.0  
**최종 수정일**: 2025-12-23
