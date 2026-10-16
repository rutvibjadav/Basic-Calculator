const keypad = document.querySelector("#keypad");
const expressionDisplay = document.querySelector("#expression");
const currentValueDisplay = document.querySelector("#current-value");

// Keep the editable input separate from the pending operation so key presses stay predictable.
let currentInput = "0";
let previousNumber = null;
let selectedOperator = null;
let awaitingOperand = false;
let justCalculated = false;
let hasError = false;
let lastExpression = "";

const operatorSymbols = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷"
};

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return String(Number(value.toPrecision(12)));
}

function render() {
  expressionDisplay.textContent = lastExpression || "\u00a0";
  currentValueDisplay.textContent = currentInput;
  currentValueDisplay.classList.toggle("is-error", hasError);
  currentValueDisplay.setAttribute("aria-label", hasError ? "Calculator error" : "Current value");
}

function resetForNewEntry() {
  if (justCalculated) {
    currentInput = "0";
    previousNumber = null;
    selectedOperator = null;
    justCalculated = false;
    lastExpression = "";
  }
}

function clearCalculator() {
  currentInput = "0";
  previousNumber = null;
  selectedOperator = null;
  awaitingOperand = false;
  justCalculated = false;
  hasError = false;
  lastExpression = "";
  render();
}

function enterDigit(digit) {
  if (hasError) {
    clearCalculator();
  }

  resetForNewEntry();

  if (awaitingOperand) {
    currentInput = digit;
    awaitingOperand = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput === "-0") {
    currentInput = `-${digit}`;
  } else {
    currentInput += digit;
  }

  render();
}

function enterDecimal() {
  if (hasError) {
    clearCalculator();
  }

  resetForNewEntry();

  if (awaitingOperand) {
    currentInput = "0.";
    awaitingOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput = currentInput === "" ? "0." : `${currentInput}.`;
  }

  render();
}

function toggleSign() {
  if (hasError) {
    return;
  }

  if (justCalculated) {
    justCalculated = false;
    lastExpression = "";
  }

  if (awaitingOperand) {
    currentInput = "-0";
    awaitingOperand = false;
  } else if (currentInput.startsWith("-")) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = `-${currentInput}`;
  }

  render();
}

function performOperation(firstNumber, secondNumber, operator) {
  switch (operator) {
    case "+":
      return firstNumber + secondNumber;
    case "-":
      return firstNumber - secondNumber;
    case "*":
      return firstNumber * secondNumber;
    case "/":
      return secondNumber === 0 ? null : firstNumber / secondNumber;
    default:
      return null;
  }
}

function showError(message, expression = "") {
  currentInput = message;
  lastExpression = expression;
  previousNumber = null;
  selectedOperator = null;
  awaitingOperand = false;
  justCalculated = false;
  hasError = true;
  render();
}

function chooseOperator(operator) {
  if (hasError || currentInput === "-0" || currentInput === "-") {
    return;
  }

  if (awaitingOperand) {
    return;
  }

  const inputNumber = Number(currentInput);
  if (!Number.isFinite(inputNumber)) {
    showError("Invalid number");
    return;
  }

  // Resolve a pending operation before storing the newly selected operator.
  if (selectedOperator && previousNumber !== null) {
    const result = performOperation(previousNumber, inputNumber, selectedOperator);
    const formattedResult = result === null ? null : formatNumber(result);

    if (formattedResult === null) {
      showError(selectedOperator === "/" && inputNumber === 0 ? "Cannot divide by zero" : "Invalid calculation");
      return;
    }

    previousNumber = Number(formattedResult);
    currentInput = formattedResult;
  } else {
    previousNumber = inputNumber;
  }

  selectedOperator = operator;
  awaitingOperand = true;
  justCalculated = false;
  lastExpression = `${formatNumber(previousNumber)} ${operatorSymbols[operator]}`;
  render();
}

function calculateResult() {
  if (hasError || !selectedOperator || previousNumber === null || awaitingOperand) {
    return;
  }

  const inputNumber = Number(currentInput);
  if (!Number.isFinite(inputNumber)) {
    showError("Invalid number");
    return;
  }

  const expression = `${formatNumber(previousNumber)} ${operatorSymbols[selectedOperator]} ${formatNumber(inputNumber)} =`;
  const result = performOperation(previousNumber, inputNumber, selectedOperator);
  const formattedResult = result === null ? null : formatNumber(result);

  if (formattedResult === null) {
    showError(selectedOperator === "/" && inputNumber === 0 ? "Cannot divide by zero" : "Invalid calculation", expression);
    return;
  }

  currentInput = formattedResult;
  previousNumber = null;
  selectedOperator = null;
  awaitingOperand = false;
  justCalculated = true;
  lastExpression = expression;
  render();
}

function deleteLastDigit() {
  if (hasError) {
    clearCalculator();
    return;
  }

  if (awaitingOperand) {
    return;
  }

  justCalculated = false;
  lastExpression = "";
  const shortenedInput = currentInput.slice(0, -1);
  currentInput = shortenedInput === "" || shortenedInput === "-" ? "0" : shortenedInput;
  render();
}

function handleAction(action) {
  switch (action) {
    case "clear":
      clearCalculator();
      break;
    case "sign":
      toggleSign();
      break;
    case "decimal":
      enterDecimal();
      break;
    case "backspace":
      deleteLastDigit();
      break;
    case "equals":
      calculateResult();
      break;
    default:
      break;
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.digit !== undefined) {
    enterDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    handleAction(button.dataset.action);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (/^[0-9]$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === ".") {
    enterDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculateResult();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    deleteLastDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

render();