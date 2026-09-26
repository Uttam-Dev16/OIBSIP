const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";
let firstOperand = null;
let currentOperator = null;
let waitingForSecondOperand = false;
let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression || currentInput;
}

function getOperatorSymbol(operator) {
    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return "+";
}

function inputNumber(number) {
    if (justCalculated) {
        currentInput = number === "." ? "0." : number;
        expression = currentInput;
        firstOperand = null;
        currentOperator = null;
        waitingForSecondOperand = false;
        justCalculated = false;
        return;
    }

    if (waitingForSecondOperand) {
        currentInput = number === "." ? "0." : number;
        expression += ` ${currentInput}`;
        waitingForSecondOperand = false;
        return;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && number !== ".") {
        currentInput = number;

        if (expression === "") {
            expression = number;
        } else {
            expression = expression.slice(0, -1) + number;
        }
    } else {
        currentInput += number;
        expression += number;
    }
}

function deleteLast() {
    if (justCalculated || waitingForSecondOperand) {
        return;
    }

    if (currentInput.length === 1) {
        currentInput = "0";

        if (firstOperand === null) {
            expression = "0";
        } else {
            const lastSpace = expression.lastIndexOf(" ");
            expression = expression.substring(0, lastSpace + 1) + "0";
        }
    } else {
        currentInput = currentInput.slice(0, -1);
        expression = expression.slice(0, -1);
    }
}

function clearCalculator() {
    currentInput = "0";
    firstOperand = null;
    currentOperator = null;
    waitingForSecondOperand = false;
    expression = "";
    justCalculated = false;
}

function performCalculation(first, second, operator) {
    if (operator === "+") {
        return first + second;
    }

    if (operator === "-") {
        return first - second;
    }

    if (operator === "*") {
        return first * second;
    }

    if (operator === "/") {
        if (second === 0) {
            return null;
        }

        return first / second;
    }

    return second;
}

function handleOperator(nextOperator) {
    if (currentInput === "Cannot divide by 0") {
        return;
    }

    if (justCalculated) {
        firstOperand = parseFloat(currentInput);
        currentOperator = nextOperator;
        expression = `${currentInput} ${getOperatorSymbol(nextOperator)}`;
        waitingForSecondOperand = true;
        justCalculated = false;
        return;
    }

    const inputValue = parseFloat(currentInput);

    if (currentOperator && waitingForSecondOperand) {
        currentOperator = nextOperator;

        const parts = expression.trim().split(" ");

        if (parts.length >= 2) {
            parts[parts.length - 1] = getOperatorSymbol(nextOperator);
            expression = parts.join(" ");
        }

        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
        currentOperator = nextOperator;

        expression = `${currentInput} ${getOperatorSymbol(nextOperator)}`;
        waitingForSecondOperand = true;
        return;
    }

    if (currentOperator) {
        const result = performCalculation(
            firstOperand,
            inputValue,
            currentOperator
        );

        if (result === null) {
            currentInput = "Cannot divide by 0";
            expression = currentInput;
            firstOperand = null;
            currentOperator = null;
            waitingForSecondOperand = true;
            return;
        }

        currentInput = String(Number(result.toFixed(10)));
        firstOperand = Number(currentInput);

        currentOperator = nextOperator;
        expression += ` ${getOperatorSymbol(nextOperator)}`;
        waitingForSecondOperand = true;
    }
}

function calculateResult() {
    if (
        currentOperator === null ||
        firstOperand === null ||
        waitingForSecondOperand
    ) {
        return;
    }

    const secondOperand = parseFloat(currentInput);

    const result = performCalculation(
        firstOperand,
        secondOperand,
        currentOperator
    );

    if (result === null) {
        currentInput = "Cannot divide by 0";
        expression = currentInput;
    } else {
        const formattedResult = String(Number(result.toFixed(10)));

        expression += ` = ${formattedResult}`;
        currentInput = formattedResult;
    }

    firstOperand = null;
    currentOperator = null;
    waitingForSecondOperand = false;
    justCalculated = true;
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;

        if (number !== undefined) {
            inputNumber(number);
        }

        if (operator !== undefined) {
            handleOperator(operator);
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "backspace") {
            deleteLast();
        }

        if (action === "calculate") {
            calculateResult();
        }

        updateDisplay();
    });
});

updateDisplay();