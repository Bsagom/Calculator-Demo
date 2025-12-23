/**
 * 계산기 애플리케이션
 */
class CalculatorApp {
    constructor() {
        this.currentInput = '0';
        this.previousResult = '';
        this.angleMode = 'deg'; // 'deg', 'rad', 'grad'
        this.lastAnswer = 0;
        this.history = this.loadHistory();

        this.currentInputDisplay = document.getElementById('currentInput');
        this.previousResultDisplay = document.getElementById('previousResult');
        this.angleModeBtn = document.getElementById('angleModeBtn');
        this.historyModal = document.getElementById('historyModal');
        this.historyList = document.getElementById('historyList');

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

        // 히스토리 버튼
        document.getElementById('historyBtn').addEventListener('click', () => this.openHistory());
        document.getElementById('closeHistoryBtn').addEventListener('click', () => this.closeHistory());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearAllHistory());

        // 모달 오버레이 클릭 시 닫기
        this.historyModal.addEventListener('click', (e) => {
            if (e.target === this.historyModal) {
                this.closeHistory();
            }
        });

        // 키보드 지원
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleNumber(num) {
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            this.currentInput = num;
        } else {
            this.currentInput += num;
        }
        this.updateDisplay();
    }

    handleOperator(op) {
        if (this.currentInput === 'Error') {
            this.currentInput = '0';
        }

        if (this.currentInput === '0' && op === '-') {
            this.currentInput = '-';
        } else if (this.currentInput !== '') {
            this.currentInput += op;
        }
        this.updateDisplay();
    }

    handleFunction(func) {
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            this.currentInput = func + '(';
        } else {
            this.currentInput += func + '(';
        }
        this.updateDisplay();
    }

    handleConstant(constant) {
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            if (constant === 'π') {
                this.currentInput = 'PI';
            } else if (constant === 'e') {
                this.currentInput = 'E';
            }
        } else {
            if (constant === 'π') {
                this.currentInput += 'PI';
            } else if (constant === 'e') {
                this.currentInput += 'E';
            }
        }
        this.updateDisplay();
    }

    handleInput(input) {
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            this.currentInput = input;
        } else {
            this.currentInput += input;
        }
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.currentInput = '0';
                this.previousResult = '';
                break;
            case 'backspace':
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                break;
            case 'equals':
                this.calculate();
                break;
            case 'angleMode':
                this.toggleAngleMode();
                break;
            case 'ans':
                if (this.currentInput === '0' || this.currentInput === 'Error') {
                    this.currentInput = this.lastAnswer.toString();
                } else {
                    this.currentInput += this.lastAnswer.toString();
                }
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
            const expression = this.currentInput;
            let expr = expression;

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

            // 계산 실행
            const result = Function('"use strict"; return (' + expr + ')')();
            const formattedResult = this.formatNumber(result);

            // 히스토리에 추가
            this.addToHistory(expression, formattedResult);

            // 디스플레이 업데이트
            this.previousResult = expression + ' =';
            this.currentInput = formattedResult;
            this.lastAnswer = result;

        } catch (error) {
            this.currentInput = 'Error';
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
        this.currentInputDisplay.textContent = this.currentInput;
        this.previousResultDisplay.textContent = this.previousResult;
    }

    // 히스토리 관리
    addToHistory(expression, result) {
        const entry = {
            id: Date.now(),
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleString('ko-KR')
        };

        this.history.unshift(entry);

        // 최대 100개까지만 저장
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }

        this.saveHistory();
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem('calculator_history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('calculator_history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    openHistory() {
        this.renderHistory();
        this.historyModal.classList.remove('hidden');
        this.historyModal.classList.add('flex');
    }

    closeHistory() {
        this.historyModal.classList.add('hidden');
        this.historyModal.classList.remove('flex');
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="text-center py-12 text-slate-500 dark:text-slate-400">
                    <span class="material-symbols-outlined text-6xl mb-4 opacity-30">history</span>
                    <p class="text-lg">계산 기록이 없습니다</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.history.map(entry => `
            <div class="mb-3 p-4 bg-slate-50 dark:bg-[#1e293b] rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#2c3b55] transition-colors" data-expression="${entry.expression}">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm text-slate-500 dark:text-slate-400">${entry.timestamp}</span>
                    <button class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" data-delete="${entry.id}">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
                <div class="text-slate-700 dark:text-slate-300 text-base mb-1">${entry.expression}</div>
                <div class="text-slate-900 dark:text-white text-xl font-bold">= ${entry.result}</div>
            </div>
        `).join('');

        // 항목 클릭 이벤트
        this.historyList.querySelectorAll('[data-expression]').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('[data-delete]')) {
                    this.currentInput = item.dataset.expression;
                    this.updateDisplay();
                    this.closeHistory();
                }
            });
        });

        // 삭제 버튼 이벤트
        this.historyList.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.delete);
                this.deleteHistoryEntry(id);
            });
        });
    }

    deleteHistoryEntry(id) {
        this.history = this.history.filter(entry => entry.id !== id);
        this.saveHistory();
        this.renderHistory();
    }

    clearAllHistory() {
        if (confirm('모든 계산 기록을 삭제하시겠습니까?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
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
            if (this.historyModal.classList.contains('flex')) {
                this.closeHistory();
            } else {
                this.handleAction('clear');
            }
        } else if (e.key === '(' || e.key === ')') {
            this.handleInput(e.key);
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CalculatorApp();
});
