/**
 * 계산기 애플리케이션
 */
class CalculatorApp {
    constructor() {
        this.expression = '';
        this.result = '0';
        this.angleMode = 'deg'; // 'deg', 'rad', 'grad'
        this.lastAnswer = 0;
        
        this.expressionDisplay = document.getElementById('expression');
        this.resultDisplay = document.getElementById('result');
        this.angleModeBtn = document.getElementById('angleModeBtn');
        
        this.init();
    }
    
    init() {
        // 이벤트 리스너 등록
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.dataset.number));
        });
        
        document.querySelectorAll('[data-operator]').forEach(btn => {
            btn.addEventListener('click', () => this.handleOperator(btn.dataset.operator));
        });
        
        document.querySelectorAll('[data-function]').forEach(btn => {
            btn.addEventListener('click', () => this.handleFunction(btn.dataset.function));
        });
        
        document.querySelectorAll('[data-constant]').forEach(btn => {
            btn.addEventListener('click', () => this.handleConstant(btn.dataset.constant));
        });
        
        document.querySelectorAll('[data-input]').forEach(btn => {
            btn.addEventListener('click', () => this.handleInput(btn.dataset.input));
        });
        
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });
        
        // 키보드 지원
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleNumber(num) {
        this.expression += num;
        this.updateDisplay();
    }
    
    handleOperator(op) {
        if (this.expression === '' && op === '-') {
            this.expression = '-';
        } else if (this.expression !== '') {
            this.expression += op;
        }
        this.updateDisplay();
    }
    
    handleFunction(func) {
        this.expression += func + '(';
        this.updateDisplay();
    }
    
    handleConstant(constant) {
        if (constant === 'π') {
            this.expression += 'PI';
        } else if (constant === 'e') {
            this.expression += 'E';
        }
        this.updateDisplay();
    }
    
    handleInput(input) {
        this.expression += input;
        this.updateDisplay();
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.expression = '';
                this.result = '0';
                break;
            case 'backspace':
                this.expression = this.expression.slice(0, -1);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'angleMode':
                this.toggleAngleMode();
                break;
            case 'ans':
                this.expression += this.lastAnswer;
                break;
        }
        this.updateDisplay();
    }
    
    toggleAngleMode() {
        const modes = ['deg', 'rad', 'grad'];
        const currentIndex = modes.indexOf(this.angleMode);
        this.angleMode = modes[(currentIndex + 1) % modes.length];
        this.angleModeBtn.textContent = this.angleMode;
    }
    
    calculate() {
        try {
            let expr = this.expression;
            
            // 수학 상수 치환
            expr = expr.replace(/PI/g, Math.PI);
            expr = expr.replace(/E/g, Math.E);
            
            // 삼각함수 처리
            expr = this.processTrigFunctions(expr);
            
            // 기타 함수 처리
            expr = expr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
            expr = expr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
            expr = expr.replace(/lg\(([^)]+)\)/g, 'Math.log10($1)');
            expr = expr.replace(/reciprocal\(([^)]+)\)/g, '(1/($1))');
            
            // 연산자 치환
            expr = expr.replace(/×/g, '*');
            expr = expr.replace(/÷/g, '/');
            expr = expr.replace(/\^/g, '**');
            expr = expr.replace(/%/g, '/100');
            
            // 계산 실행 (안전한 방법으로)
            const result = Function('"use strict"; return (' + expr + ')')();
            
            this.result = this.formatNumber(result);
            this.lastAnswer = result;
            this.expression = '';
            
        } catch (error) {
            this.result = 'Error';
            console.error('Calculation error:', error);
        }
    }
    
    processTrigFunctions(expr) {
        const angleToRad = (angle) => {
            if (this.angleMode === 'deg') {
                return angle * (Math.PI / 180);
            } else if (this.angleMode === 'grad') {
                return angle * (Math.PI / 200);
            }
            return angle; // rad
        };
        
        // sin, cos, tan 처리
        expr = expr.replace(/sin\(([^)]+)\)/g, (match, angle) => {
            const evalAngle = Function('"use strict"; return (' + angle + ')')();
            return Math.sin(angleToRad(evalAngle));
        });
        
        expr = expr.replace(/cos\(([^)]+)\)/g, (match, angle) => {
            const evalAngle = Function('"use strict"; return (' + angle + ')')();
            return Math.cos(angleToRad(evalAngle));
        });
        
        expr = expr.replace(/tan\(([^)]+)\)/g, (match, angle) => {
            const evalAngle = Function('"use strict"; return (' + angle + ')')();
            return Math.tan(angleToRad(evalAngle));
        });
        
        return expr;
    }
    
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'Error';
        if (!isFinite(num)) return 'Infinity';
        
        // 소수점 10자리까지
        const rounded = Math.round(num * 1e10) / 1e10;
        
        // 지수 표기법 (매우 크거나 작은 숫자)
        if (Math.abs(rounded) > 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            return rounded.toExponential(6);
        }
        
        return rounded.toString();
    }
    
    updateDisplay() {
        this.expressionDisplay.textContent = this.expression || '';
        this.resultDisplay.textContent = this.result;
    }
    
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.handleNumber(e.key);
        } else if (e.key === '.') {
            this.handleInput('.');
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.handleOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.handleAction('equals');
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.handleAction('backspace');
        } else if (e.key === 'Escape') {
            this.handleAction('clear');
        } else if (e.key === '(' || e.key === ')') {
            this.handleInput(e.key);
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CalculatorApp();
});
