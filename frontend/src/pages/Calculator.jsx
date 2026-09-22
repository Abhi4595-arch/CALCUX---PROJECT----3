import { useState } from "react";
import { calculate } from "../api/calculatorApi";
import { NavLink } from "react-router-dom";

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [operation, setOperation] = useState("add");

  const operations = [
    { value: "add", label: "Addition", symbol: "+" },
    { value: "subtract", label: "Subtraction", symbol: "−" },
    { value: "multiply", label: "Multiplication", symbol: "×" },
    { value: "divide", label: "Division", symbol: "÷" },
    { value: "modulus", label: "Modulus", symbol: "%" },
  ];

  /*
   * ============================================================
   * CALCULATION
   * ============================================================
   *
   * React does NOT calculate anything.
   *
   * It only:
   * 1. Collects input
   * 2. Sends the operation and values to the C++ backend
   * 3. Receives the CalculationResult through the API
   * 4. Displays the backend response
   *
   * All mathematical calculations and calculation-specific
   * validation are handled by the C++ backend.
   */

  const handleCalculate = async () => {
    setError("");
    setResult("");

    /*
     * These checks only prevent an incomplete HTTP request.
     * They do NOT perform mathematical validation.
     */
    if (firstNumber === "" || secondNumber === "") {
      setError("Enter both numbers.");
      return;
    }

    const a = Number(firstNumber);
    const b = Number(secondNumber);

    /*
     * Convert the HTML input strings into numbers for the API.
     * No calculation is performed here.
     */
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setError("Please enter valid numbers.");
      return;
    }

    setLoading(true);

    try {
      /*
       * The C++ backend is the ONLY calculation engine.
       */
      const data = await calculate(
        operation,
        a,
        b
      );

      /*
       * Trust the C++ CalculationResult.
       */
      if (data?.success === true) {
        setResult(String(data.value));

        const selectedOperation = operations.find(
          (item) => item.value === operation
        );

        /*
         * This is display text only.
         * It does not calculate the result.
         */
        setExpression(
          `${a} ${selectedOperation?.symbol ?? ""} ${b}`
        );

        setError("");
      } else {
        /*
         * Backend rejected the calculation.
         * Display the exact message returned by C++.
         */
        setError(
          data?.message ||
            "Calculation failed."
        );

        setResult("");
      }
    } catch (err) {
      /*
       * Network/API failure.
       * No fallback calculation is performed.
       */
      setError(
        err.message ||
          "Unable to connect to the C++ backend."
      );

      setResult("");
    } finally {
      setLoading(false);
    }
  };

  const clearCalculator = () => {
    setFirstNumber("");
    setSecondNumber("");
    setExpression("");
    setResult("");
    setError("");
  };

  return (
    <div className="calculator-page">

      {/* Header */}
      <header className="page-header">

        <div>
          <p className="eyebrow">
            CALCUX / CALCULATOR
          </p>

          <h1>Basic Calculator</h1>

          <p className="page-description">
            Perform simple arithmetic operations through
            the C++ engine.
          </p>
        </div>

        <div className="backend-status">
          <span className="status-dot"></span>
          Backend Online
        </div>

      </header>


      {/* Main calculator layout */}
      <div className="calculator-layout">

        {/* Calculator */}
        <section className="calculator-card">

          <div className="calculator-card-header">

            <div>
              <p className="eyebrow">
                CALCULATION
              </p>

              <h2>Enter your numbers</h2>
            </div>

            <span className="cpp-label">
              C++
            </span>

          </div>


          {/* Display */}
          <div className="calculator-display">

            <span className="display-expression">
              {expression || "Ready for calculation"}
            </span>

            <strong>
              {result !== "" ? result : "0"}
            </strong>

          </div>


          {/* Inputs */}
          <div className="number-inputs">

            <div className="input-group">

              <label>
                First number
              </label>

              <input
                type="number"
                value={firstNumber}
                onChange={(e) =>
                  setFirstNumber(e.target.value)
                }
                placeholder="Enter number"
              />

            </div>


            <div className="input-group">

              <label>
                Second number
              </label>

              <input
                type="number"
                value={secondNumber}
                onChange={(e) =>
                  setSecondNumber(e.target.value)
                }
                placeholder="Enter number"
              />

            </div>

          </div>


          {/* Operation */}
          <div className="operation-section">

            <label>
              Operation
            </label>

            <div className="operation-grid">

              {operations.map((item) => (

                <button
                  key={item.value}
                  type="button"
                  className={
                    operation === item.value
                      ? "operation-button selected"
                      : "operation-button"
                  }
                  onClick={() =>
                    setOperation(item.value)
                  }
                >

                  <span>
                    {item.symbol}
                  </span>

                  {item.label}

                </button>

              ))}

            </div>

          </div>


          {/* Backend Error */}
          {error && (
            <div className="calculator-error">
              {error}
            </div>
          )}


          {/* Actions */}
          <div className="calculator-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={clearCalculator}
            >
              Clear
            </button>

            <button
              type="button"
              className="calculate-button"
              onClick={handleCalculate}
              disabled={loading}
            >

              {loading
                ? "Calculating..."
                : "Calculate"}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </div>

        </section>


        {/* Right panel */}
        <aside className="calculator-sidebar">

          <div className="operations-panel">

            <div className="panel-heading">

              <div>

                <p className="eyebrow">
                  AVAILABLE
                </p>

                <h2>
                  Operations
                </h2>

              </div>

            </div>


            {operations.map((item) => (

              <button
                key={item.value}
                type="button"
                className="operation-row"
                onClick={() =>
                  setOperation(item.value)
                }
              >

                <span className="operation-symbol">
                  {item.symbol}
                </span>

                <div>

                  <strong>
                    {item.label}
                  </strong>

                  <small>

                    {item.value === "add" &&
                      "a + b"}

                    {item.value === "subtract" &&
                      "a − b"}

                    {item.value === "multiply" &&
                      "a × b"}

                    {item.value === "divide" &&
                      "a ÷ b"}

                    {item.value === "modulus" &&
                      "a % b"}

                  </small>

                </div>

              </button>

            ))}

          </div>


          {/* C++ information */}
          <div className="cpp-panel">

            <div className="cpp-panel-icon">
              C++
            </div>

            <h3>
              Powered by C++
            </h3>

            <p>
              All calculations are processed by the
              existing CALCUX C++ backend.
            </p>

            <div className="cpp-flow">

              <span>
                React
              </span>

              <b>
                →
              </b>

              <span>
                API
              </span>

              <b>
                →
              </b>

              <strong>
                C++
              </strong>

            </div>

          </div>


          {/* Navigation */}
          <div className="calculator-navigation">

            <NavLink to="/advanced">

              Advanced Operations

              <span>
                →
              </span>

            </NavLink>

            <NavLink to="/expression">

              Expression Calculator

              <span>
                →
              </span>

            </NavLink>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Calculator;