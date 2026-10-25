
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let previousInput = null;
let operation = null;
let waitingForSecondOperand = false;

const symbols = {
    somar: "+",
    subtrair: "−",
    multiplicar: "×",
    dividir: "÷"
};

function formatNumber(value) {
    return value.replace(".", ",");
}

function updateDisplay() {
    resultDisplay.textContent = formatNumber(currentInput);
}

function clearCalculator() {
    currentInput = "0";
    previousInput = null;
    operation = null;
    waitingForSecondOperand = false;

    expressionDisplay.textContent = "Pronto para calcular";
    updateDisplay();
}

function inputNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        currentInput = "0.";
        waitingForSecondOperand = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperation(selectedOperation) {
    if (operation && !waitingForSecondOperand) {
        calculate();
    }

    previousInput = currentInput;
    operation = selectedOperation;
    waitingForSecondOperand = true;

    expressionDisplay.textContent =
        `${formatNumber(previousInput)} ${symbols[operation]}`;
}

async function calculate() {
    if (operation === null || previousInput === null ||
        waitingForSecondOperand) {
        return;
    }

    const firstNumber = previousInput;
    const secondNumber = currentInput;
    const selectedOperation = operation;

    expressionDisplay.textContent =
        `${formatNumber(firstNumber)} ${symbols[selectedOperation]} ${formatNumber(secondNumber)} =`;

    try {
        const url =
            `/api/calculadora/${selectedOperation}` +
            `?a=${encodeURIComponent(firstNumber)}` +
            `&b=${encodeURIComponent(secondNumber)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : "Não foi possível realizar o cálculo."
            );
        }

        if (!Number.isFinite(data)) {
            throw new Error("O resultado não é um número válido.");
        }

        currentInput = String(data);
        previousInput = null;
        operation = null;
        waitingForSecondOperand = true;

        updateDisplay();
    } catch (error) {
        expressionDisplay.textContent = error.message;
        currentInput = "0";
        previousInput = null;
        operation = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }
}

function handleAction(action) {
    if (action === "clear") {
        clearCalculator();
    }

    if (action === "decimal") {
        inputDecimal();
    }

    if (action === "equals") {
        calculate();
    }

    if (action === "sign") {
        if (currentInput !== "0") {
            currentInput = String(-Number(currentInput));
            updateDisplay();
        }
    }

    if (action === "percent") {
        currentInput = String(Number(currentInput) / 100);
        updateDisplay();
    }

    if (action === "backspace" && !waitingForSecondOperand) {
        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";

        if (currentInput === "-") {
            currentInput = "0";
        }

        updateDisplay();
    }
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operation) {
        chooseOperation(button.dataset.operation);
        return;
    }

    if (button.dataset.action) {
        handleAction(button.dataset.action);
    }
});
