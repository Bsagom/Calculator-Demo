---
description: SOLID 원칙 준수 규칙
---

# SOLID 원칙

## 개요
이 프로젝트의 모든 코드는 **SOLID 원칙**을 준수하여 구현해야 합니다. SOLID는 객체지향 설계의 5가지 핵심 원칙으로, 유지보수성과 확장성을 높이는 데 필수적입니다.

---

## SOLID 원칙 개요

```
S - Single Responsibility Principle (단일 책임 원칙)
O - Open/Closed Principle (개방-폐쇄 원칙)
L - Liskov Substitution Principle (리스코프 치환 원칙)
I - Interface Segregation Principle (인터페이스 분리 원칙)
D - Dependency Inversion Principle (의존성 역전 원칙)
```

---

## 1. Single Responsibility Principle (SRP)
### 단일 책임 원칙

> 하나의 클래스는 하나의 책임만 가져야 한다.

### 원칙 설명
- 클래스는 단 하나의 변경 이유만 가져야 함
- 하나의 클래스가 여러 기능을 담당하면 안 됨
- 각 클래스는 명확한 단일 목적을 가져야 함

### ❌ 나쁜 예
```javascript
// Calculator 클래스가 너무 많은 책임을 가짐
class Calculator {
    constructor() {
        this.history = [];
    }
    
    // 계산 책임
    add(a, b) {
        return a + b;
    }
    
    // 히스토리 관리 책임 (SRP 위반!)
    saveToHistory(expression, result) {
        this.history.push({ expression, result });
        localStorage.setItem('history', JSON.stringify(this.history));
    }
    
    // UI 업데이트 책임 (SRP 위반!)
    updateDisplay(value) {
        document.getElementById('display').textContent = value;
    }
}
```

### ✅ 좋은 예
```javascript
// 계산 책임만 담당
class Calculator {
    add(a, b) {
        return a + b;
    }
    
    subtract(a, b) {
        return a - b;
    }
    
    multiply(a, b) {
        return a * b;
    }
    
    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}

// 히스토리 관리 책임만 담당
class HistoryManager {
    constructor() {
        this.history = [];
    }
    
    addEntry(expression, result) {
        this.history.push({ expression, result, timestamp: Date.now() });
    }
    
    getHistory() {
        return [...this.history];
    }
    
    saveToStorage() {
        localStorage.setItem('history', JSON.stringify(this.history));
    }
    
    loadFromStorage() {
        const data = localStorage.getItem('history');
        this.history = data ? JSON.parse(data) : [];
    }
}

// UI 업데이트 책임만 담당
class DisplayManager {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }
    
    update(value) {
        this.displayElement.textContent = value;
    }
    
    clear() {
        this.displayElement.textContent = '0';
    }
}
```

---

## 2. Open/Closed Principle (OCP)
### 개방-폐쇄 원칙

> 소프트웨어 엔티티는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다.

### 원칙 설명
- 새로운 기능 추가 시 기존 코드를 수정하지 않아야 함
- 추상화와 다형성을 활용하여 확장 가능하게 설계
- 새로운 기능은 새로운 코드로 추가

### ❌ 나쁜 예
```javascript
// 새로운 함수 추가 시 기존 코드 수정 필요 (OCP 위반!)
class Calculator {
    calculate(operation, a, b) {
        if (operation === 'add') {
            return a + b;
        } else if (operation === 'subtract') {
            return a - b;
        } else if (operation === 'multiply') {
            return a * b;
        } else if (operation === 'divide') {
            return a / b;
        }
        // 새로운 연산 추가 시 이 메서드를 수정해야 함!
    }
}
```

### ✅ 좋은 예
```javascript
// 연산 인터페이스 (추상화)
class Operation {
    execute(a, b) {
        throw new Error('execute method must be implemented');
    }
}

// 구체적인 연산 클래스들
class AddOperation extends Operation {
    execute(a, b) {
        return a + b;
    }
}

class SubtractOperation extends Operation {
    execute(a, b) {
        return a - b;
    }
}

class MultiplyOperation extends Operation {
    execute(a, b) {
        return a * b;
    }
}

class DivideOperation extends Operation {
    execute(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}

// 새로운 연산 추가 시 기존 코드 수정 없이 확장 가능
class PowerOperation extends Operation {
    execute(a, b) {
        return Math.pow(a, b);
    }
}

// Calculator는 수정 없이 확장 가능
class Calculator {
    constructor() {
        this.operations = new Map();
    }
    
    registerOperation(name, operation) {
        this.operations.set(name, operation);
    }
    
    calculate(operationName, a, b) {
        const operation = this.operations.get(operationName);
        if (!operation) {
            throw new Error(`Unknown operation: ${operationName}`);
        }
        return operation.execute(a, b);
    }
}

// 사용 예시
const calc = new Calculator();
calc.registerOperation('add', new AddOperation());
calc.registerOperation('subtract', new SubtractOperation());
calc.registerOperation('multiply', new MultiplyOperation());
calc.registerOperation('divide', new DivideOperation());
calc.registerOperation('power', new PowerOperation()); // 확장!

console.log(calc.calculate('add', 5, 3)); // 8
console.log(calc.calculate('power', 2, 3)); // 8
```

---

## 3. Liskov Substitution Principle (LSP)
### 리스코프 치환 원칙

> 서브타입은 언제나 기반 타입으로 교체할 수 있어야 한다.

### 원칙 설명
- 자식 클래스는 부모 클래스의 기능을 완전히 대체할 수 있어야 함
- 부모 클래스의 계약(contract)을 자식 클래스가 위반하면 안 됨
- 다형성의 기반이 되는 원칙

### ❌ 나쁜 예
```javascript
class Calculator {
    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}

// LSP 위반: 부모 클래스의 계약을 위반
class SafeCalculator extends Calculator {
    divide(a, b) {
        // 예외를 던지지 않고 0을 반환 (계약 위반!)
        if (b === 0) return 0;
        return a / b;
    }
}

// 문제 발생
function performDivision(calculator, a, b) {
    try {
        return calculator.divide(a, b);
    } catch (error) {
        console.error('Division error:', error.message);
        return null;
    }
}

const calc1 = new Calculator();
const calc2 = new SafeCalculator();

performDivision(calc1, 10, 0); // 예외 처리됨
performDivision(calc2, 10, 0); // 0 반환 (예상과 다른 동작!)
```

### ✅ 좋은 예
```javascript
class Calculator {
    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}

// LSP 준수: 부모 클래스의 계약을 유지
class ScientificCalculator extends Calculator {
    divide(a, b) {
        // 동일한 계약 유지 (0으로 나누면 예외 발생)
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
    
    // 추가 기능은 새로운 메서드로
    safeDivide(a, b, defaultValue = 0) {
        try {
            return this.divide(a, b);
        } catch (error) {
            return defaultValue;
        }
    }
}
```

---

## 4. Interface Segregation Principle (ISP)
### 인터페이스 분리 원칙

> 클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 한다.

### 원칙 설명
- 큰 인터페이스를 작은 인터페이스로 분리
- 클라이언트가 필요한 메서드만 제공
- JavaScript는 명시적 인터페이스가 없지만, 덕 타이핑으로 구현

### ❌ 나쁜 예
```javascript
// 너무 많은 책임을 가진 인터페이스 (ISP 위반!)
class CalculatorInterface {
    // 기본 연산
    add(a, b) {}
    subtract(a, b) {}
    multiply(a, b) {}
    divide(a, b) {}
    
    // 과학 함수
    sin(x) {}
    cos(x) {}
    tan(x) {}
    
    // 통계 함수
    mean(numbers) {}
    median(numbers) {}
    standardDeviation(numbers) {}
    
    // 행렬 연산
    matrixMultiply(m1, m2) {}
    matrixInverse(matrix) {}
}

// 기본 계산기는 과학/통계/행렬 함수가 필요 없음!
class BasicCalculator extends CalculatorInterface {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) { return a / b; }
    
    // 사용하지 않는 메서드들을 구현해야 함 (ISP 위반!)
    sin(x) { throw new Error('Not supported'); }
    cos(x) { throw new Error('Not supported'); }
    // ... 나머지도 마찬가지
}
```

### ✅ 좋은 예
```javascript
// 인터페이스를 작은 단위로 분리
class BasicArithmetic {
    add(a, b) { throw new Error('Must implement'); }
    subtract(a, b) { throw new Error('Must implement'); }
    multiply(a, b) { throw new Error('Must implement'); }
    divide(a, b) { throw new Error('Must implement'); }
}

class TrigonometricFunctions {
    sin(x) { throw new Error('Must implement'); }
    cos(x) { throw new Error('Must implement'); }
    tan(x) { throw new Error('Must implement'); }
}

class StatisticalFunctions {
    mean(numbers) { throw new Error('Must implement'); }
    median(numbers) { throw new Error('Must implement'); }
    standardDeviation(numbers) { throw new Error('Must implement'); }
}

// 기본 계산기는 필요한 인터페이스만 구현
class BasicCalculator extends BasicArithmetic {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
}

// 과학 계산기는 필요한 인터페이스들을 조합
class ScientificCalculator extends BasicCalculator {
    constructor() {
        super();
        this.trigFunctions = new TrigonometricCalculator();
    }
    
    sin(x) { return this.trigFunctions.sin(x); }
    cos(x) { return this.trigFunctions.cos(x); }
    tan(x) { return this.trigFunctions.tan(x); }
}

class TrigonometricCalculator extends TrigonometricFunctions {
    sin(x) { return Math.sin(x); }
    cos(x) { return Math.cos(x); }
    tan(x) { return Math.tan(x); }
}
```

---

## 5. Dependency Inversion Principle (DIP)
### 의존성 역전 원칙

> 고수준 모듈은 저수준 모듈에 의존해서는 안 된다. 둘 다 추상화에 의존해야 한다.

### 원칙 설명
- 구체적인 구현이 아닌 추상화에 의존
- 의존성 주입(Dependency Injection) 활용
- 결합도를 낮추고 테스트 용이성 향상

### ❌ 나쁜 예
```javascript
// 고수준 모듈이 저수준 모듈에 직접 의존 (DIP 위반!)
class CalculatorApp {
    constructor() {
        // 구체적인 클래스에 직접 의존
        this.storage = new LocalStorageManager();
        this.calculator = new Calculator();
        this.display = new DisplayManager();
    }
    
    saveResult(result) {
        // LocalStorageManager에 강하게 결합됨
        this.storage.save('lastResult', result);
    }
}

class LocalStorageManager {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}
```

### ✅ 좋은 예
```javascript
// 추상화 (인터페이스)
class StorageInterface {
    save(key, value) {
        throw new Error('save method must be implemented');
    }
    
    load(key) {
        throw new Error('load method must be implemented');
    }
}

// 구체적인 구현들
class LocalStorageManager extends StorageInterface {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

class SessionStorageManager extends StorageInterface {
    save(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    
    load(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

class MemoryStorageManager extends StorageInterface {
    constructor() {
        super();
        this.storage = new Map();
    }
    
    save(key, value) {
        this.storage.set(key, value);
    }
    
    load(key) {
        return this.storage.get(key) || null;
    }
}

// 고수준 모듈은 추상화에 의존 (의존성 주입)
class CalculatorApp {
    constructor(storage, calculator, display) {
        // 추상화(인터페이스)에 의존
        this.storage = storage;
        this.calculator = calculator;
        this.display = display;
    }
    
    saveResult(result) {
        // 어떤 스토리지 구현체든 사용 가능
        this.storage.save('lastResult', result);
    }
    
    loadLastResult() {
        return this.storage.load('lastResult');
    }
}

// 사용 예시 - 의존성 주입
const localStorage = new LocalStorageManager();
const calculator = new Calculator();
const display = new DisplayManager();

const app = new CalculatorApp(localStorage, calculator, display);

// 테스트 시에는 메모리 스토리지 사용 가능
const memoryStorage = new MemoryStorageManager();
const testApp = new CalculatorApp(memoryStorage, calculator, display);
```

---

## 프로젝트 적용 예시

### 계산기 아키텍처 (SOLID 적용)

```javascript
// ===== 추상화 레이어 =====

// 연산 인터페이스 (OCP, DIP)
class Operation {
    execute(...args) {
        throw new Error('execute must be implemented');
    }
}

// 스토리지 인터페이스 (DIP)
class Storage {
    save(key, value) {
        throw new Error('save must be implemented');
    }
    load(key) {
        throw new Error('load must be implemented');
    }
}

// ===== 구체적인 구현 =====

// 기본 연산들 (SRP, OCP)
class AddOperation extends Operation {
    execute(a, b) {
        return a + b;
    }
}

class SinOperation extends Operation {
    constructor(angleConverter) {
        super();
        this.angleConverter = angleConverter; // DIP
    }
    
    execute(value) {
        const radians = this.angleConverter.toRadians(value);
        return Math.sin(radians);
    }
}

// 각도 변환기 (SRP)
class AngleConverter {
    constructor(mode = 'deg') {
        this.mode = mode;
    }
    
    setMode(mode) {
        this.mode = mode;
    }
    
    toRadians(value) {
        switch (this.mode) {
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
}

// 계산기 엔진 (SRP, OCP, DIP)
class CalculatorEngine {
    constructor() {
        this.operations = new Map();
    }
    
    registerOperation(name, operation) {
        this.operations.set(name, operation);
    }
    
    calculate(operationName, ...args) {
        const operation = this.operations.get(operationName);
        if (!operation) {
            throw new Error(`Unknown operation: ${operationName}`);
        }
        return operation.execute(...args);
    }
}

// 히스토리 관리자 (SRP, DIP)
class HistoryManager {
    constructor(storage) {
        this.storage = storage; // DIP
        this.history = [];
    }
    
    addEntry(expression, result) {
        const entry = {
            expression,
            result,
            timestamp: Date.now()
        };
        this.history.push(entry);
        this.save();
    }
    
    getHistory() {
        return [...this.history];
    }
    
    save() {
        this.storage.save('calculator_history', this.history);
    }
    
    load() {
        this.history = this.storage.load('calculator_history') || [];
    }
}

// LocalStorage 구현 (DIP)
class LocalStorageImpl extends Storage {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

// ===== 조립 (Composition Root) =====

function createCalculatorApp() {
    // 의존성 생성
    const storage = new LocalStorageImpl();
    const angleConverter = new AngleConverter('deg');
    
    // 계산기 엔진 생성 및 연산 등록
    const engine = new CalculatorEngine();
    engine.registerOperation('add', new AddOperation());
    engine.registerOperation('sin', new SinOperation(angleConverter));
    
    // 히스토리 관리자 생성
    const historyManager = new HistoryManager(storage);
    historyManager.load();
    
    return {
        engine,
        historyManager,
        angleConverter
    };
}

// 사용
const app = createCalculatorApp();
const result = app.engine.calculate('add', 5, 3);
app.historyManager.addEntry('5 + 3', result);
```

---

## SOLID 체크리스트

코드 작성 시 확인사항:

### Single Responsibility Principle
- [ ] 각 클래스는 하나의 명확한 책임만 가지는가?
- [ ] 클래스 이름이 그 책임을 명확히 나타내는가?
- [ ] 변경 이유가 하나만 존재하는가?

### Open/Closed Principle
- [ ] 새로운 기능 추가 시 기존 코드를 수정하지 않아도 되는가?
- [ ] 추상화를 통해 확장 가능한 구조인가?
- [ ] 전략 패턴, 팩토리 패턴 등을 활용했는가?

### Liskov Substitution Principle
- [ ] 자식 클래스가 부모 클래스를 완전히 대체할 수 있는가?
- [ ] 부모 클래스의 계약(예외, 반환값 등)을 위반하지 않는가?
- [ ] 사전 조건을 강화하거나 사후 조건을 약화하지 않았는가?

### Interface Segregation Principle
- [ ] 클라이언트가 사용하지 않는 메서드에 의존하지 않는가?
- [ ] 인터페이스가 적절히 분리되어 있는가?
- [ ] 각 인터페이스가 응집력 있는 기능을 제공하는가?

### Dependency Inversion Principle
- [ ] 고수준 모듈이 저수준 모듈에 직접 의존하지 않는가?
- [ ] 추상화(인터페이스)에 의존하는가?
- [ ] 의존성 주입을 활용하는가?
- [ ] 테스트를 위해 구현체를 쉽게 교체할 수 있는가?

---

## 참고 자료

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [SOLID Principles - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
- [JavaScript Design Patterns](https://www.patterns.dev/)

---

**규칙 버전**: 1.0  
**최종 수정일**: 2025-12-23
