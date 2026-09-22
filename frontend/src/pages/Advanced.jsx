import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  calculate as calculateBinary,
  calculateUnary,
} from "../api/calculatorApi";

const operations = [
  {
    id: "power",
    title: "Power",
    symbol: "xʸ",
    description: "Raise one number to another power",
    type: "binary",
    fields: ["Base", "Exponent"],
  },
  {
    id: "percentage",
    title: "Percentage",
    symbol: "%",
    description: "Calculate percentage values",
    type: "binary",
    fields: ["Value", "Percentage"],
  },
  {
    id: "gcd",
    title: "GCD",
    symbol: "GCD",
    description: "Greatest common divisor",
    type: "binary",
    fields: ["Number A", "Number B"],
  },
  {
    id: "lcm",
    title: "LCM",
    symbol: "LCM",
    description: "Least common multiple",
    type: "binary",
    fields: ["Number A", "Number B"],
  },
  {
    id: "squareRoot",
    title: "Square Root",
    symbol: "√x",
    description: "Calculate the square root",
    type: "unary",
    fields: ["Value"],
  },
  {
    id: "factorial",
    title: "Factorial",
    symbol: "n!",
    description: "Calculate factorial of an integer",
    type: "unary",
    fields: ["Value"],
  },
  {
    id: "primeCheck",
    title: "Prime Check",
    symbol: "P",
    description: "Check whether a number is prime",
    type: "unary",
    fields: ["Value"],
  },
  {
    id: "evenOddCheck",
    title: "Even / Odd",
    symbol: "±",
    description: "Determine whether a number is even or odd",
    type: "unary",
    fields: ["Value"],
  },
];

function Advanced() {
  const [selectedOperation, setSelectedOperation] = useState(
    operations[0]
  );

  const [values, setValues] = useState(["", ""]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectOperation = (operation) => {
    setSelectedOperation(operation);
    setValues(["", ""]);
    setResult("");
    setError("");
  };

  const handleValueChange = (index, value) => {
    setValues((current) => {
      const updated = [...current];
      updated[index] = value;
      return updated;
    });

    setResult("");
    setError("");
  };

  /*
   * ============================================================
   * STRICT C++ BACKEND CALCULATION
   * ============================================================
   *
   * React does not perform mathematical calculations.
   *
   * React only:
   * 1. Collects input
   * 2. Sends the operation to the C++ backend
   * 3. Receives the C++ response
   * 4. Displays that response
   *
   * Calculation, mathematical validation and classification
   * are handled by the C++ backend.
   */

  const handleCalculate = async () => {
    setError("");
    setResult("");

    /*
     * These checks only prevent incomplete requests.
     * They do not perform calculations.
     */
    if (values[0] === "") {
      setError("Please enter a value.");
      return;
    }

    if (
      selectedOperation.type === "binary" &&
      values[1] === ""
    ) {
      setError("Please enter both values.");
      return;
    }

    /*
     * Convert HTML input strings to numbers for the API request.
     * No result is calculated here.
     */
    const firstValue = Number(values[0]);

    const secondValue =
      selectedOperation.type === "binary"
        ? Number(values[1])
        : null;

    if (!Number.isFinite(firstValue)) {
      setError("Please enter a valid value.");
      return;
    }

    if (
      selectedOperation.type === "binary" &&
      !Number.isFinite(secondValue)
    ) {
      setError("Please enter a valid value.");
      return;
    }

    setLoading(true);

    try {
      let response;

      /*
       * Binary operation:
       * React → API → C++ CalculatorService
       */
      if (selectedOperation.type === "binary") {
        response = await calculateBinary(
          selectedOperation.id,
          firstValue,
          secondValue
        );
      }

      /*
       * Unary operation:
       * React → API → C++ CalculatorService
       */
      else {
        response = await calculateUnary(
          selectedOperation.id,
          firstValue
        );
      }

      /*
       * ========================================================
       * C++ RESPONSE IS THE SOURCE OF TRUTH
       * ========================================================
       */

      if (response?.success === true) {

        /*
         * Prime Check and Even/Odd return their meaningful
         * result through the C++ message field:
         *
         * Prime:
         *   value   = 1 or 0
         *   message = "Prime Number" / "Not a Prime Number"
         *
         * Even/Odd:
         *   value   = 1 or 0
         *   message = "Even Number" / "Odd Number"
         *
         * React does NOT determine these results.
         * It only displays the message returned by C++.
         */
        if (
          selectedOperation.id === "primeCheck" ||
          selectedOperation.id === "evenOddCheck"
        ) {
          setResult(
            response.message || "No result message returned."
          );
        }

        /*
         * All other operations display the numerical value
         * returned by the C++ backend.
         */
        else {
          setResult(String(response.value));
        }

        setError("");
      }

      /*
       * C++ rejected the calculation.
       * Display the exact backend error message.
       */
      else {
        setResult("");

        setError(
          response?.message ||
            "Calculation failed."
        );
      }

    } catch (err) {

      /*
       * Backend/API unavailable.
       * No local calculation or fallback is performed.
       */
      setResult("");

      setError(
        err.message ||
          "Unable to connect to the C++ backend."
      );

    } finally {
      setLoading(false);
    }
  };

  const selectedFields = selectedOperation.fields;

  return (
    <div className="advanced-page">

      <header className="page-header">

        <div>

          <p className="eyebrow">
            CALCUX / ADVANCED
          </p>

          <h1>
            Advanced Operations
          </h1>

          <p className="page-description">
            Perform advanced calculations through the C++
            calculation engine.
          </p>

        </div>

        <div className="backend-status">

          <span className="status-dot"></span>

          Backend Online

        </div>

      </header>


      <div className="advanced-layout">

        <section className="advanced-main">

          {/* CALCULATOR */}

          <div className="advanced-card calculator-panel">

            <div className="calculator-panel-heading">

              <div>

                <p className="eyebrow">
                  CALCULATION
                </p>

                <h2>
                  {selectedOperation.title}
                </h2>

              </div>

              <div className="selected-operation-symbol">
                {selectedOperation.symbol}
              </div>

            </div>


            <div
              className={`advanced-input-grid ${
                selectedOperation.type === "unary"
                  ? "advanced-input-single"
                  : ""
              }`}
            >

              {selectedFields.map((label, index) => (

                <div
                  className="advanced-input-group"
                  key={label}
                >

                  <label>
                    {label}
                  </label>

                  <input
                    type="number"
                    value={values[index]}
                    onChange={(event) =>
                      handleValueChange(
                        index,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleCalculate();
                      }
                    }}
                    placeholder="Enter value"
                  />

                </div>

              ))}

            </div>


            <button
              type="button"
              className="advanced-calculate-button"
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


            {error && (
              <div className="advanced-error">

                <span>!</span>

                {error}

              </div>
            )}


            <div className="advanced-result">

              <div>

                <span>
                  RESULT
                </span>

                <p>
                  {result !== ""
                    ? result
                    : "—"}
                </p>

              </div>


              <div className="result-engine">

                <span>
                  ENGINE
                </span>

                <strong>
                  C++
                </strong>

              </div>

            </div>

          </div>


          {/* C++ OPERATIONS */}

          <div className="advanced-card">

            <div className="advanced-card-heading">

              <div>

                <p className="eyebrow">
                  C++ OPERATIONS
                </p>

                <h2>
                  Select an operation
                </h2>

              </div>

              <span className="operation-count">
                {operations.length} operations
              </span>

            </div>


            <div className="operation-grid">

              {operations.map((operation) => (

                <button
                  key={operation.id}
                  type="button"
                  className={`operation-card ${
                    selectedOperation.id === operation.id
                      ? "operation-card-active"
                      : ""
                  }`}
                  onClick={() =>
                    selectOperation(operation)
                  }
                >

                  <div className="operation-symbol">
                    {operation.symbol}
                  </div>

                  <div className="operation-content">

                    <strong>
                      {operation.title}
                    </strong>

                    <span>
                      {operation.description}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </section>


        {/* SIDEBAR */}

        <aside className="advanced-sidebar">

          {/* ENGINE STATUS */}

          <div className="advanced-info-panel">

            <p className="eyebrow">
              ENGINE STATUS
            </p>

            <h2>
              C++ Calculation Engine
            </h2>

            <div className="engine-status">

              <span className="status-dot"></span>

              <strong>
                Connected
              </strong>

            </div>

            <p>
              Advanced calculations are processed by
              the existing C++ backend. React is used
              only as the interface layer.
            </p>

            <div className="engine-flow">

              <span>
                React
              </span>

              <b>→</b>

              <span>
                API
              </span>

              <b>→</b>

              <strong>
                C++
              </strong>

            </div>

          </div>


          {/* SUPPORTED OPERATIONS */}

          <div className="supported-panel">

            <p className="eyebrow">
              SUPPORTED
            </p>

            <h3>
              Operations
            </h3>

            <div className="supported-list">

              {operations.map((operation) => (

                <div key={operation.id}>

                  <span>
                    {operation.symbol}
                  </span>

                  <strong>
                    {operation.title}
                  </strong>

                </div>

              ))}

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="calculator-navigation">

            <NavLink to="/calculator">
              Basic Calculator
              <span>→</span>
            </NavLink>

            <NavLink to="/expression">
              Expression Calculator
              <span>→</span>
            </NavLink>

            <NavLink to="/history">
              Calculation History
              <span>→</span>
            </NavLink>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Advanced;