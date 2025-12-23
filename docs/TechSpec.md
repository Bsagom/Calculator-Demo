# 공학용 전자계산기 웹앱 기술 명세서 (Tech Spec)

## 문서 정보
- **프로젝트명**: Scientific Calculator Web App
- **버전**: 1.0
- **작성일**: 2025-12-23
- **관련 문서**: [PRD.md](./PRD.md)

---

## 목차
1. [기술 스택 개요](#1-기술-스택-개요)
2. [아키텍처 설계](#2-아키텍처-설계)
3. [프론트엔드 구현](#3-프론트엔드-구현)
4. [계산 엔진 설계](#4-계산-엔진-설계)
5. [상태 관리](#5-상태-관리)
6. [데이터 구조](#6-데이터-구조)
7. [API 및 인터페이스](#7-api-및-인터페이스)
8. [성능 최적화](#8-성능-최적화)
9. [보안 고려사항](#9-보안-고려사항)
10. [테스트 전략](#10-테스트-전략)
11. [배포 전략](#11-배포-전략)
12. [개발 환경 설정](#12-개발-환경-설정)

---

## 1. 기술 스택 개요

### 1.1 코어 기술

#### 프론트엔드
- **HTML5**: 시맨틱 마크업 및 구조
- **CSS3**: 스타일링 및 레이아웃
- **JavaScript (ES6+)**: 비즈니스 로직 및 UI 인터랙션

#### CSS 프레임워크
- **Tailwind CSS v3.x**: 유틸리티 퍼스트 CSS 프레임워크
  - CDN 방식 사용 (빠른 프로토타이핑)
  - 다크 모드 지원 (`darkMode: 'class'`)
  - 커스텀 테마 설정

#### 폰트 및 아이콘
- **Google Fonts**:
  - Space Grotesk (디스플레이 폰트)
  - Noto Sans (본문 폰트)
- **Material Symbols Outlined**: 아이콘 세트

### 1.2 계산 라이브러리

#### Math.js (선택 사항)
- **버전**: 12.x 이상
- **용도**: 복잡한 수식 파싱 및 계산
- **장점**:
  - 안전한 수식 평가
  - 다양한 수학 함수 지원
  - 단위 변환 지원
  - 복소수 계산 지원
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.0.0/math.min.js`

#### 대안: 자체 구현 계산 엔진
- 가벼운 파서 및 평가기 구현
- 필요한 함수만 선택적으로 구현
- 번들 크기 최소화

### 1.3 개발 도구

#### 버전 관리
- **Git**: 소스 코드 버전 관리
- **GitHub**: 원격 저장소 및 협업

#### 코드 에디터
- **VS Code**: 권장 에디터
  - 확장: Prettier, ESLint, Tailwind CSS IntelliSense

#### 브라우저 개발 도구
- Chrome DevTools
- Firefox Developer Tools

---

## 2. 아키텍처 설계

### 2.1 전체 구조

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (HTML + Tailwind CSS + UI Logic)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Application Layer            │
│  (Event Handlers + State Manager)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Business Logic              │
│    (Calculator Engine + Parser)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Data Layer                 │
│  (LocalStorage + History Manager)   │
└─────────────────────────────────────┘
```

### 2.2 모듈 구조

```
calculator-app/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css          # 커스텀 CSS (필요 시)
├── js/
│   ├── main.js             # 앱 초기화 및 진입점
│   ├── calculator.js       # 계산 엔진 코어
│   ├── parser.js           # 수식 파싱 로직
│   ├── ui.js               # UI 업데이트 및 렌더링
│   ├── eventHandlers.js    # 이벤트 핸들러
│   ├── stateManager.js     # 상태 관리
│   ├── historyManager.js   # 계산 히스토리 관리
│   ├── themeManager.js     # 다크/라이트 모드 관리
│   └── utils.js            # 유틸리티 함수
├── assets/
│   └── icons/              # 커스텀 아이콘 (필요 시)
└── tests/
    ├── calculator.test.js  # 계산 엔진 테스트
    └── parser.test.js      # 파서 테스트
```

### 2.3 컴포넌트 분리

#### UI 컴포넌트
1. **Header Component**: 메뉴, 제목, 히스토리 버튼
2. **Display Component**: 입력 수식 및 결과 표시
3. **Keypad Component**: 버튼 그리드
4. **Modal Components**: 히스토리, 설정, 도움말

---

## 3. 프론트엔드 구현

### 3.1 HTML 구조

```html
<!DOCTYPE html>
<html class="dark" lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scientific Calculator</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    
    <!-- Tailwind Config -->
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'primary': '#135bec',
                        'background-light': '#f6f6f8',
                        'background-dark': '#101622',
                    },
                    fontFamily: {
                        'display': ['Space Grotesk', 'sans-serif'],
                        'body': ['Noto Sans', 'sans-serif'],
                    },
                },
            },
        }
    </script>
</head>
<body>
    <!-- App Structure -->
    <div id="app"></div>
    
    <!-- Scripts -->
    <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 3.2 CSS 설계

#### Tailwind CSS 커스텀 설정
```javascript
// tailwind.config.js (인라인)
{
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#135bec',
                'primary-light': '#6fa3ff',
                'background-light': '#f6f6f8',
                'background-dark': '#101622',
                'surface-light': '#ffffff',
                'surface-dark': '#192233',
                'border-light': '#e2e8f0',
                'border-dark': '#324467',
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
            },
        },
    },
}
```

#### 커스텀 CSS (필요 시)
```css
/* styles.css */
:root {
    --transition-speed: 150ms;
}

body {
    min-height: max(884px, 100dvh);
}

/* 버튼 애니메이션 */
.btn-scale {
    transition: transform var(--transition-speed) ease;
}

.btn-scale:active {
    transform: scale(0.95);
}

/* 스크롤바 커스터마이징 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.5);
}
```

### 3.3 반응형 디자인

#### 브레이크포인트
- **Mobile**: < 640px (기본)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

#### 반응형 전략
```html
<!-- 모바일 우선 접근 -->
<div class="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
    <!-- 버튼 크기 조정 -->
    <button class="h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg">
        7
    </button>
</div>

<!-- 최대 너비 제한 (데스크톱) -->
<div class="max-w-md mx-auto">
    <!-- 계산기 컨텐츠 -->
</div>
```

---

## 4. 계산 엔진 설계

### 4.1 계산 엔진 아키텍처

```javascript
// calculator.js
class Calculator {
    constructor() {
        this.currentInput = '';
        this.previousResult = 0;
        this.angleMode = 'deg'; // 'deg', 'rad', 'grad'
        this.secondFunction = false;
        this.memory = 0;
    }

    // 주요 메서드
    evaluate(expression) { }
    addInput(value) { }
    clear() { }
    backspace() { }
    toggleAngleMode() { }
    toggleSecondFunction() { }
}
```

### 4.2 수식 파싱 전략

#### Option 1: Math.js 사용
```javascript
import math from 'mathjs';

function evaluateExpression(expr, angleMode = 'deg') {
    const parser = math.parser();
    
    // 각도 모드 설정
    if (angleMode === 'deg') {
        parser.evaluate('config({angleUnit: "deg"})');
    }
    
    try {
        const result = parser.evaluate(expr);
        return result;
    } catch (error) {
        throw new Error('Invalid expression');
    }
}
```

#### Option 2: 자체 파서 구현
```javascript
// parser.js
class ExpressionParser {
    constructor() {
        this.tokens = [];
        this.position = 0;
    }

    // 토큰화
    tokenize(expression) {
        const regex = /(\d+\.?\d*|[+\-*/()^√]|sin|cos|tan|ln|lg|π|e)/g;
        return expression.match(regex) || [];
    }

    // 파싱 (재귀 하강 파서)
    parse(expression) {
        this.tokens = this.tokenize(expression);
        this.position = 0;
        return this.parseExpression();
    }

    // 표현식 평가
    parseExpression() {
        let result = this.parseTerm();
        
        while (this.position < this.tokens.length) {
            const token = this.tokens[this.position];
            if (token === '+') {
                this.position++;
                result += this.parseTerm();
            } else if (token === '-') {
                this.position++;
                result -= this.parseTerm();
            } else {
                break;
            }
        }
        
        return result;
    }

    parseTerm() {
        let result = this.parseFactor();
        
        while (this.position < this.tokens.length) {
            const token = this.tokens[this.position];
            if (token === '*' || token === '×') {
                this.position++;
                result *= this.parseFactor();
            } else if (token === '/' || token === '÷') {
                this.position++;
                result /= this.parseFactor();
            } else {
                break;
            }
        }
        
        return result;
    }

    parseFactor() {
        const token = this.tokens[this.position];
        
        // 숫자
        if (!isNaN(token)) {
            this.position++;
            return parseFloat(token);
        }
        
        // 괄호
        if (token === '(') {
            this.position++;
            const result = this.parseExpression();
            this.position++; // ')'
            return result;
        }
        
        // 함수
        if (['sin', 'cos', 'tan', 'ln', 'lg', '√'].includes(token)) {
            return this.parseFunction(token);
        }
        
        // 상수
        if (token === 'π') {
            this.position++;
            return Math.PI;
        }
        if (token === 'e') {
            this.position++;
            return Math.E;
        }
        
        throw new Error('Unexpected token: ' + token);
    }

    parseFunction(funcName) {
        this.position++;
        const arg = this.parseFactor();
        
        switch (funcName) {
            case 'sin':
                return Math.sin(this.toRadians(arg));
            case 'cos':
                return Math.cos(this.toRadians(arg));
            case 'tan':
                return Math.tan(this.toRadians(arg));
            case 'ln':
                return Math.log(arg);
            case 'lg':
                return Math.log10(arg);
            case '√':
                return Math.sqrt(arg);
            default:
                throw new Error('Unknown function: ' + funcName);
        }
    }

    toRadians(degrees) {
        // angleMode에 따라 변환
        return degrees * (Math.PI / 180);
    }
}
```

### 4.3 지원 함수 목록

#### 기본 연산
- `+`, `-`, `*` (×), `/` (÷)
- `^` (거듭제곱)
- `%` (백분율)

#### 삼각함수
```javascript
const trigFunctions = {
    sin: (x, mode) => Math.sin(convertAngle(x, mode)),
    cos: (x, mode) => Math.cos(convertAngle(x, mode)),
    tan: (x, mode) => Math.tan(convertAngle(x, mode)),
    asin: (x, mode) => convertFromRadians(Math.asin(x), mode),
    acos: (x, mode) => convertFromRadians(Math.acos(x), mode),
    atan: (x, mode) => convertFromRadians(Math.atan(x), mode),
};

function convertAngle(value, mode) {
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
```

#### 로그 및 지수
```javascript
const logExpFunctions = {
    ln: (x) => Math.log(x),
    lg: (x) => Math.log10(x),
    log: (x, base) => Math.log(x) / Math.log(base),
    exp: (x) => Math.exp(x),
    pow: (x, y) => Math.pow(x, y),
    sqrt: (x) => Math.sqrt(x),
    cbrt: (x) => Math.cbrt(x),
};
```

#### 기타 함수
```javascript
const utilityFunctions = {
    abs: (x) => Math.abs(x),
    factorial: (n) => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    },
    reciprocal: (x) => 1 / x,
    percent: (x) => x / 100,
};
```

### 4.4 오류 처리

```javascript
class CalculatorError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type; // 'SYNTAX_ERROR', 'MATH_ERROR', 'OVERFLOW_ERROR'
    }
}

function safeEvaluate(expression) {
    try {
        const result = evaluate(expression);
        
        // 무한대 체크
        if (!isFinite(result)) {
            throw new CalculatorError('Result is infinite', 'OVERFLOW_ERROR');
        }
        
        // NaN 체크
        if (isNaN(result)) {
            throw new CalculatorError('Invalid calculation', 'MATH_ERROR');
        }
        
        return result;
    } catch (error) {
        if (error instanceof CalculatorError) {
            throw error;
        }
        throw new CalculatorError('Syntax error', 'SYNTAX_ERROR');
    }
}
```

---

## 5. 상태 관리

### 5.1 상태 구조

```javascript
// stateManager.js
class StateManager {
    constructor() {
        this.state = {
            // 디스플레이 상태
            currentExpression: '',
            currentResult: '0',
            previousExpression: '',
            
            // 계산기 모드
            angleMode: 'deg', // 'deg', 'rad', 'grad'
            secondFunction: false,
            
            // 히스토리
            history: [],
            
            // UI 상태
            theme: 'dark', // 'light', 'dark'
            showHistory: false,
            showMenu: false,
            
            // 메모리
            memory: 0,
            lastAnswer: 0,
        };
        
        this.listeners = [];
    }

    // 상태 업데이트
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    // 상태 조회
    getState() {
        return { ...this.state };
    }

    // 리스너 등록
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // 리스너 알림
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// 싱글톤 인스턴스
const stateManager = new StateManager();
export default stateManager;
```

### 5.2 상태 흐름

```
User Input (Button Click)
    ↓
Event Handler
    ↓
State Update (StateManager)
    ↓
Notify Listeners
    ↓
UI Update (Re-render)
```

---

## 6. 데이터 구조

### 6.1 히스토리 데이터

```javascript
// historyManager.js
class HistoryEntry {
    constructor(expression, result, timestamp) {
        this.id = Date.now() + Math.random();
        this.expression = expression;
        this.result = result;
        this.timestamp = timestamp || new Date().toISOString();
    }
}

class HistoryManager {
    constructor(maxEntries = 100) {
        this.maxEntries = maxEntries;
        this.loadHistory();
    }

    // 히스토리 추가
    addEntry(expression, result) {
        const entry = new HistoryEntry(expression, result);
        let history = this.getHistory();
        
        history.unshift(entry); // 최신 항목을 앞에 추가
        
        // 최대 개수 제한
        if (history.length > this.maxEntries) {
            history = history.slice(0, this.maxEntries);
        }
        
        this.saveHistory(history);
        return entry;
    }

    // 히스토리 조회
    getHistory() {
        const stored = localStorage.getItem('calculator_history');
        return stored ? JSON.parse(stored) : [];
    }

    // 히스토리 저장
    saveHistory(history) {
        localStorage.setItem('calculator_history', JSON.stringify(history));
    }

    // 히스토리 삭제
    clearHistory() {
        localStorage.removeItem('calculator_history');
    }

    // 특정 항목 삭제
    deleteEntry(id) {
        let history = this.getHistory();
        history = history.filter(entry => entry.id !== id);
        this.saveHistory(history);
    }

    // 히스토리 로드
    loadHistory() {
        return this.getHistory();
    }
}

export default new HistoryManager();
```

### 6.2 로컬 스토리지 스키마

```javascript
// LocalStorage Keys
const STORAGE_KEYS = {
    HISTORY: 'calculator_history',
    THEME: 'calculator_theme',
    ANGLE_MODE: 'calculator_angle_mode',
    MEMORY: 'calculator_memory',
};

// 저장 예시
localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([
    {
        id: 1234567890,
        expression: '250 × sin(45)',
        result: '176.776',
        timestamp: '2025-12-23T16:58:48+09:00'
    }
]));

localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
localStorage.setItem(STORAGE_KEYS.ANGLE_MODE, 'deg');
```

---

## 7. API 및 인터페이스

### 7.1 Calculator API

```javascript
// calculator.js - Public API
class Calculator {
    // 입력 추가
    addInput(value) {
        // 숫자, 연산자, 함수 등 추가
    }

    // 계산 실행
    calculate() {
        // 현재 수식 평가
    }

    // 전체 초기화
    clear() {
        // AC 기능
    }

    // 마지막 문자 삭제
    backspace() {
        // Backspace 기능
    }

    // 각도 모드 전환
    toggleAngleMode() {
        // deg → rad → grad → deg
    }

    // 2nd 기능 토글
    toggleSecondFunction() {
        // 역함수 모드 전환
    }

    // 메모리 저장
    memoryStore(value) { }

    // 메모리 불러오기
    memoryRecall() { }

    // 메모리 초기화
    memoryClear() { }

    // ANS (마지막 답) 불러오기
    getLastAnswer() { }
}
```

### 7.2 UI 업데이트 인터페이스

```javascript
// ui.js
class UIManager {
    constructor() {
        this.displayExpression = document.getElementById('expression');
        this.displayResult = document.getElementById('result');
    }

    // 수식 표시 업데이트
    updateExpression(expression) {
        this.displayExpression.textContent = expression || '';
    }

    // 결과 표시 업데이트
    updateResult(result) {
        this.displayResult.textContent = this.formatNumber(result);
    }

    // 숫자 포맷팅
    formatNumber(num) {
        if (typeof num !== 'number') return num;
        
        // 소수점 자리수 제한
        const maxDecimals = 10;
        const rounded = Math.round(num * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
        
        // 지수 표기법 (큰 숫자)
        if (Math.abs(rounded) > 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            return rounded.toExponential(6);
        }
        
        return rounded.toString();
    }

    // 오류 표시
    showError(message) {
        this.displayResult.textContent = 'Error';
        this.displayExpression.textContent = message;
    }

    // 버튼 상태 업데이트
    updateButtonState(buttonId, state) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.toggle('active', state);
        }
    }
}
```

---

## 8. 성능 최적화

### 8.1 렌더링 최적화

#### 가상 DOM 개념 적용 (간단한 버전)
```javascript
// 불필요한 DOM 업데이트 방지
class SmartRenderer {
    constructor() {
        this.cache = new Map();
    }

    render(elementId, content) {
        const cached = this.cache.get(elementId);
        
        // 내용이 변경되지 않았으면 업데이트 스킵
        if (cached === content) {
            return;
        }
        
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
            this.cache.set(elementId, content);
        }
    }
}
```

#### 디바운싱 (Debouncing)
```javascript
// 키보드 입력 시 과도한 계산 방지
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 사용 예시
const debouncedCalculate = debounce(() => {
    calculator.calculate();
}, 300);
```

### 8.2 메모리 최적화

#### 히스토리 제한
```javascript
const MAX_HISTORY_ENTRIES = 100;

// 오래된 항목 자동 삭제
function pruneHistory(history) {
    if (history.length > MAX_HISTORY_ENTRIES) {
        return history.slice(0, MAX_HISTORY_ENTRIES);
    }
    return history;
}
```

#### 이벤트 리스너 정리
```javascript
class EventManager {
    constructor() {
        this.listeners = [];
    }

    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    }

    removeAllListeners() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
    }
}
```

### 8.3 번들 크기 최적화

#### 조건부 로딩
```javascript
// Math.js를 필요할 때만 로드
async function loadMathJS() {
    if (!window.math) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.0.0/math.min.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => resolve(window.math);
        });
    }
    return window.math;
}
```

---

## 9. 보안 고려사항

### 9.1 입력 검증

```javascript
// 안전한 입력 검증
function sanitizeInput(input) {
    // 허용된 문자만 통과
    const allowedChars = /^[0-9+\-*/().×÷^√πe\s]+$/;
    
    if (!allowedChars.test(input)) {
        throw new Error('Invalid characters in expression');
    }
    
    return input;
}
```

### 9.2 XSS 방지

```javascript
// textContent 사용 (innerHTML 사용 금지)
function safeUpdateDOM(element, content) {
    // ❌ 위험: element.innerHTML = content;
    // ✅ 안전: 
    element.textContent = content;
}
```

### 9.3 eval() 사용 금지

```javascript
// ❌ 절대 사용 금지
// const result = eval(expression);

// ✅ 안전한 대안: 파서 사용
const result = parser.parse(expression);
```

### 9.4 CSP (Content Security Policy)

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com 'unsafe-inline'; 
               style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; 
               font-src 'self' https://fonts.gstatic.com;">
```

---

## 10. 테스트 전략

### 10.1 단위 테스트

#### 계산 엔진 테스트
```javascript
// tests/calculator.test.js
describe('Calculator', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    test('기본 사칙연산', () => {
        expect(calc.evaluate('2 + 2')).toBe(4);
        expect(calc.evaluate('10 - 5')).toBe(5);
        expect(calc.evaluate('3 * 4')).toBe(12);
        expect(calc.evaluate('15 / 3')).toBe(5);
    });

    test('삼각함수 (도 모드)', () => {
        calc.angleMode = 'deg';
        expect(calc.evaluate('sin(30)')).toBeCloseTo(0.5, 5);
        expect(calc.evaluate('cos(60)')).toBeCloseTo(0.5, 5);
        expect(calc.evaluate('tan(45)')).toBeCloseTo(1, 5);
    });

    test('복잡한 수식', () => {
        expect(calc.evaluate('(2 + 3) * 4')).toBe(20);
        expect(calc.evaluate('2^3')).toBe(8);
        expect(calc.evaluate('√16')).toBe(4);
    });

    test('오류 처리', () => {
        expect(() => calc.evaluate('1 / 0')).toThrow();
        expect(() => calc.evaluate('√-1')).toThrow();
    });
});
```

#### 파서 테스트
```javascript
// tests/parser.test.js
describe('ExpressionParser', () => {
    let parser;

    beforeEach(() => {
        parser = new ExpressionParser();
    });

    test('토큰화', () => {
        const tokens = parser.tokenize('2 + 3 * 4');
        expect(tokens).toEqual(['2', '+', '3', '*', '4']);
    });

    test('연산자 우선순위', () => {
        expect(parser.parse('2 + 3 * 4')).toBe(14);
        expect(parser.parse('(2 + 3) * 4')).toBe(20);
    });
});
```

### 10.2 통합 테스트 (코어 로직만)

```javascript
// tests/integration.test.js
describe('Calculator Integration', () => {
    test('전체 계산 플로우', () => {
        const calc = new Calculator();
        
        calc.addInput('2');
        calc.addInput('5');
        calc.addInput('0');
        calc.addInput('×');
        calc.addInput('sin');
        calc.addInput('(');
        calc.addInput('4');
        calc.addInput('5');
        calc.addInput(')');
        
        const result = calc.calculate();
        expect(result).toBeCloseTo(176.776, 2);
    });
});
```

### 10.3 UI 테스트 (수동 테스트만)

> **중요**: UI 레이어는 **자동화된 테스트를 작성하지 않습니다**. 모든 UI 테스트는 수동으로 수행합니다.

#### 수동 테스트 체크리스트

**기본 기능**
- [ ] 숫자 버튼 클릭 시 디스플레이 업데이트
- [ ] 연산자 버튼 클릭 시 수식 표시
- [ ] = 버튼 클릭 시 결과 계산 및 표시
- [ ] AC 버튼으로 전체 초기화
- [ ] Backspace 버튼으로 마지막 문자 삭제

**과학 함수**
- [ ] sin, cos, tan 버튼 동작
- [ ] ln, lg 버튼 동작
- [ ] 거듭제곱, 제곱근 버튼 동작
- [ ] 각도 모드 전환 (deg/rad/grad)

**UI/UX**
- [ ] 다크 모드 / 라이트 모드 전환
- [ ] 히스토리 모달 열기/닫기
- [ ] 히스토리 항목 클릭 시 복원
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [ ] 버튼 호버 효과
- [ ] 버튼 클릭 애니메이션

**키보드 단축키**
- [ ] 숫자 키 (0-9)
- [ ] 연산자 키 (+, -, *, /)
- [ ] Enter (=)
- [ ] Backspace
- [ ] Escape (AC)
        calc.addInput('(');
        calc.addInput('4');
        calc.addInput('5');
        calc.addInput(')');
        
        const result = calc.calculate();
        expect(result).toBeCloseTo(176.776, 2);
    });
});
```

### 10.3 E2E 테스트 (수동)

#### 테스트 시나리오
1. **기본 계산**
   - 숫자 버튼 클릭
   - 연산자 선택
   - = 버튼으로 결과 확인

2. **과학 함수**
   - sin, cos, tan 함수 테스트
   - 각도 모드 전환 확인

3. **히스토리**
   - 계산 후 히스토리 저장 확인
   - 히스토리 조회 및 재사용

4. **테마 전환**
   - 다크/라이트 모드 전환
   - 색상 및 스타일 확인

---

## 11. 배포 전략

### 11.1 GitHub Actions + GitHub Pages

이 프로젝트는 **GitHub Actions**를 통해 자동으로 빌드되고, **GitHub Pages**에 배포됩니다.

#### 워크플로우 파일
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
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
          path: '.'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 배포 프로세스
```
코드 푸시 (main) → GitHub Actions 트리거 → 빌드 → 아티팩트 업로드 → GitHub Pages 배포
```

#### 초기 설정
1. GitHub 저장소 생성 및 코드 푸시
2. Settings > Pages > Source: **GitHub Actions** 선택
3. Settings > Actions > General > Workflow permissions: **Read and write** 설정
4. main 브랜치에 푸시하면 자동 배포

자세한 내용은 [Deployment.md](./Deployment.md) 참조

### 11.2 최적화 체크리스트

- [ ] HTML/CSS/JS 압축 (Minify)
- [ ] 이미지 최적화
- [ ] 캐싱 전략 설정
- [ ] HTTPS 적용 (GitHub Pages 자동 지원)
- [ ] PWA 변환 (선택 사항)
- [ ] SEO 메타 태그 추가

### 11.3 PWA 변환 (선택 사항)

#### manifest.json
```json
{
  "name": "Scientific Calculator",
  "short_name": "Calculator",
  "description": "A modern scientific calculator web app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#101622",
  "theme_color": "#135bec",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker
```javascript
// sw.js
const CACHE_NAME = 'calculator-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/calculator.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

## 12. 개발 환경 설정

### 12.1 필수 도구

#### Node.js (선택 사항)
- 버전: 18.x 이상
- 용도: 개발 서버, 테스트 실행

#### Git
- 버전 관리 및 협업

#### VS Code 확장
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ritwickdey.liveserver"
  ]
}
```

### 12.2 개발 서버

#### Live Server (VS Code 확장)
```json
// .vscode/settings.json
{
  "liveServer.settings.port": 5500,
  "liveServer.settings.root": "/",
  "liveServer.settings.CustomBrowser": "chrome"
}
```

#### Python 간단 서버
```bash
# Python 3
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

#### Node.js 서버
```javascript
// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';

  const extname = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
  }[extname] || 'text/plain';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### 12.3 코드 품질 도구

#### Prettier 설정
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

#### ESLint 설정
```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

---

## 13. 부록

### 13.1 브라우저 호환성 매트릭스

| 기능 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| ES6+ | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ | ✅ |

### 13.2 성능 벤치마크 목표

| 메트릭 | 목표 | 측정 방법 |
|--------|------|-----------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 2.5s | Lighthouse |
| Total Bundle Size | < 100KB | Network Tab |
| 계산 응답 시간 | < 100ms | Performance API |

### 13.3 참고 자료

#### 공식 문서
- [MDN Web Docs](https://developer.mozilla.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Math.js Docs](https://mathjs.org/docs/)

#### 튜토리얼
- [JavaScript Calculator Tutorial](https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/)
- [Expression Parser Implementation](https://en.wikipedia.org/wiki/Recursive_descent_parser)

#### 도구
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Can I Use](https://caniuse.com/)
- [BundlePhobia](https://bundlephobia.com/)

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-12-23  
**작성자**: AI Assistant  
**검토자**: (검토 대기 중)
