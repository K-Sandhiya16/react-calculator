import { useState } from "react";
import "./calculator.css";

const Calculator = () => {
  const [currentExpression, setCurrentExpression] = useState("");
  const [result, setResult] = useState("0");
  const [awaitingNewInput, setAwaitingNewInput] = useState(false);

  const isOperator = (char) => ["+", "-", "*", "/", "%"].includes(char);

  const updateDisplay = (expression, resultValue) => {
    setCurrentExpression(expression);
    setResult(resultValue);
  };

  const appendToExpression = (value) => {
    let newExpression = currentExpression;
    let newResult = result;
    let newAwaitingInput = awaitingNewInput;

    if (awaitingNewInput) {
      if (/[0-9.]/.test(value)) {
        newExpression = value;
        newResult = value;
      } else {
        newExpression = result + value;
      }
      newAwaitingInput = false;
    } else {
      const lastChar = newExpression.slice(-1);

      if (isOperator(lastChar) && isOperator(value)) {
        if (value !== "-") {
          newExpression = newExpression.slice(0, -1) + value;
        }
      } else if (value === "." && newExpression.endsWith(".")) {
        return;
      } else {
        newExpression += value;
      }
    }

    try {
      let safeExpression = newExpression.replace(/%/g, "/100*");

      if (isOperator(safeExpression.slice(-1))) {
        safeExpression = safeExpression.slice(0, -1);
      }

      const currentPreview = eval(safeExpression);
      if (currentPreview !== undefined && !isNaN(currentPreview)) {
        newResult = parseFloat(currentPreview.toFixed(10)).toString();
      }
    } catch (e) {
      // Keep current result if expression is invalid
    }

    setCurrentExpression(newExpression);
    setResult(newResult);
    setAwaitingNewInput(newAwaitingInput);
  };

  const handleClear = () => {
    setCurrentExpression("");
    setResult("0");
    setAwaitingNewInput(false);
  };

  const handleDelete = () => {
    if (awaitingNewInput) {
      handleClear();
      return;
    }

    const newExpression = currentExpression.slice(0, -1);
    let newResult = "0";

    if (newExpression.length > 0) {
      try {
        let safeExpression = newExpression.replace(/%/g, "/100*");

        if (isOperator(safeExpression.slice(-1))) {
          safeExpression = safeExpression.slice(0, -1);
        }

        const currentPreview = eval(safeExpression);
        if (currentPreview !== undefined && !isNaN(currentPreview)) {
          newResult = parseFloat(currentPreview.toFixed(10)).toString();
        }
      } catch (e) {
        newResult = "0";
      }
    }

    setCurrentExpression(newExpression);
    setResult(newResult);
  };

  const handleEquals = () => {
    if (currentExpression === "" || awaitingNewInput) return;

    try {
      let finalExpression = currentExpression.replace(/%/g, "/100*");
      let finalResult = eval(finalExpression);

      if (
        finalResult === Infinity ||
        finalResult === -Infinity ||
        isNaN(finalResult)
      ) {
        setResult("Error");
        setCurrentExpression("");
      } else {
        setResult(parseFloat(finalResult.toFixed(10)).toString());
        setCurrentExpression(currentExpression + " =");
      }

      setAwaitingNewInput(true);
    } catch (e) {
      setResult("Error");
      setCurrentExpression("");
      setAwaitingNewInput(true);
    }
  };

  const handleButtonClick = (value) => {
    switch (value) {
      case "AC":
        handleClear();
        break;
      case "DEL":
        handleDelete();
        break;
      case "=":
        handleEquals();
        break;
      default:
        appendToExpression(value);
        break;
    }
  };

  return (
    <div id="calculator">
      <h1>Calculator</h1>

      <div className="display-area">
        <div id="display-input">{currentExpression || "0"}</div>
        <div id="display-result">{result}</div>
      </div>

      <div id="buttons">
        <button
          className="calc-button clear-button"
          onClick={() => handleButtonClick("AC")}
        >
          AC
        </button>
        <button
          className="calc-button delete-button"
          onClick={() => handleButtonClick("DEL")}
        >
          DEL
        </button>
        <button
          className="calc-button op-button"
          onClick={() => handleButtonClick("%")}
        >
          %
        </button>
        <button
          className="calc-button op-button"
          onClick={() => handleButtonClick("/")}
        >
          ÷
        </button>

        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("7")}
        >
          7
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("8")}
        >
          8
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("9")}
        >
          9
        </button>
        <button
          className="calc-button op-button"
          onClick={() => handleButtonClick("*")}
        >
          ×
        </button>

        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("4")}
        >
          4
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("5")}
        >
          5
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("6")}
        >
          6
        </button>
        <button
          className="calc-button op-button"
          onClick={() => handleButtonClick("-")}
        >
          −
        </button>

        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("1")}
        >
          1
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("2")}
        >
          2
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick("3")}
        >
          3
        </button>
        <button
          className="calc-button op-button"
          onClick={() => handleButtonClick("+")}
        >
          +
        </button>

        <button
          className="calc-button num-button span-2"
          onClick={() => handleButtonClick("0")}
        >
          0
        </button>
        <button
          className="calc-button num-button"
          onClick={() => handleButtonClick(".")}
        >
          .
        </button>
        <button
          className="calc-button equals-button"
          onClick={() => handleButtonClick("=")}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
