import { useState } from "react";
import { calculateExpression } from "../api/calculatorApi";
import { NavLink } from "react-router-dom";

function Expression() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * ============================================================
   * EXPRESSION INPUT
   * ============================================================
   *
   * React only builds the expression string.
   *
   * It does NOT parse, calculate, validate, or evaluate
   * the mathematical expression.
   *
   * The complete expression is sent to the C++ expression
   * engine for evaluation.
   */

  const append = (value) => {
    setExpression((current) => current + value);
    setResult("");
    setError("");
  };

  const backspace = () => {
    setExpression((current) => current.slice(0, -1));
    setResult("");
    setError("");
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setError("");
  };

  /*
   * ============================================================
   * STRICT C++ BACKEND EVALUATION
   * ============================================================
   */

  const evaluate = async () => {
    if (!expression.trim()) {
      setError("Enter an expression first.");
      return;
    }

    setError("");
    setResult("");
    setLoading(true);

    try {
      /*
       * The complete expression is sent directly to C++.
       *
       * React does NOT calculate the expression.
       */
      const response =
        await calculateExpression(
          expression.trim()
        );

      /*
       * C++ CalculationResult is the source of truth.
       */
      if (response?.success === true) {
        setResult(String(response.value));
        setError("");
      } else {
        /*
         * C++ expression engine rejected the expression.
         * Display its exact error message.
         */
        setResult("");

        setError(
          response?.message ||
            "Expression evaluation failed."
        );
      }
    } catch (err) {
      /*
       * No local/fallback calculation.
       *
       * If the C++ backend is unavailable,
       * React does not attempt to evaluate anything.
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      evaluate();
    }

    if (event.key === "Escape") {
      clear();
    }
  };

  /*
   * These examples contain ONLY operators supported
   * by expression.cpp:
   *
   * +  -  *  /  ^  ( )
   */
  const examples = [
    "(12 + 8) * 3",
    "100 / 4 + 15",
    "2 ^ 5 + 10",
    "(50 - 20) / 5",
    "(10 + 5) * (3 + 2)",
  ];

  return (
    <div className="expression-page">

      {/* HEADER */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            CALCUX / EXPRESSION
          </p>

          <h1>
            Expression Calculator
          </h1>

          <p className="page-description">
            Evaluate complete mathematical expressions
            using the C++ engine.
          </p>

        </div>

        <div className="backend-status">

          <span className="status-dot"></span>

          Backend Online

        </div>

      </header>


      {/* MAIN LAYOUT */}

      <div className="expression-layout">

        {/* CALCULATOR */}

        <section className="expression-calculator-card">

          <div className="expression-card-header">

            <div>

              <p className="eyebrow">
                EXPRESSION ENGINE
              </p>

              <h2>
                Calculate anything
              </h2>

              <p className="calculator-hint">
                Type an expression or use the calculator
                buttons
              </p>

            </div>

            <span className="cpp-label">
              C++
            </span>

          </div>


          {/* DISPLAY */}

          <div className="calculator-display expression-display-new">

            <div className="expression-line">

              <input
                type="text"
                value={expression}
                onChange={(event) => {
                  setExpression(event.target.value);
                  setResult("");
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="0"
                spellCheck="false"
                autoComplete="off"
                aria-label="Mathematical expression"
              />

              <span className="character-count">
                {expression.length} chars
              </span>

            </div>


            <div className="display-result">

              <span>
                Result
              </span>

              <strong>

                {loading
                  ? "..."
                  : result !== ""
                    ? result
                    : "—"}

              </strong>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="calculator-error">
              {error}
            </div>
          )}


          {/* CALCULATOR KEYPAD */}

          <div className="expression-keypad">

            {/* TOP FUNCTION ROW */}

            <div className="keypad-top-row">

              <button
                type="button"
                className="key"
                onClick={() => append("(")}
              >
                (
              </button>

              <button
                type="button"
                className="key"
                onClick={() => append(")")}
              >
                )
              </button>

              <button
                type="button"
                className="key key-operator"
                onClick={() => append("^")}
              >
                ^
              </button>

              <button
                type="button"
                className="key key-clear"
                onClick={clear}
              >
                C
              </button>

              <button
                type="button"
                className="key key-delete"
                onClick={backspace}
              >
                ⌫
              </button>

            </div>


            {/* NUMBER + OPERATOR + EQUALS */}

            <div className="main-keypad">

              {/* NUMBER KEYPAD */}

              <div className="number-keypad">

                {/* 7 8 9 / */}

                <div className="keypad-row">

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("7")}
                  >
                    7
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("8")}
                  >
                    8
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("9")}
                  >
                    9
                  </button>

                  <button
                    type="button"
                    className="key key-operator"
                    onClick={() => append("/")}
                  >
                    ÷
                  </button>

                </div>


                {/* 4 5 6 * */}

                <div className="keypad-row">

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("4")}
                  >
                    4
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("5")}
                  >
                    5
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("6")}
                  >
                    6
                  </button>

                  <button
                    type="button"
                    className="key key-operator"
                    onClick={() => append("*")}
                  >
                    ×
                  </button>

                </div>


                {/* 1 2 3 - */}

                <div className="keypad-row">

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("1")}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("2")}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append("3")}
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="key key-operator"
                    onClick={() => append("-")}
                  >
                    −
                  </button>

                </div>


                {/* 0 . + */}

                <div className="keypad-row">

                  <button
                    type="button"
                    className="key key-zero"
                    onClick={() => append("0")}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    className="key"
                    onClick={() => append(".")}
                  >
                    .
                  </button>

                  <button
                    type="button"
                    className="key key-operator"
                    onClick={() => append("+")}
                  >
                    +
                  </button>

                </div>

              </div>


              {/* EQUALS BUTTON */}

              <button
                type="button"
                className="key key-equals"
                onClick={evaluate}
                disabled={loading}
              >
                {loading ? "..." : "="}
              </button>

            </div>

          </div>


          {/* EVALUATE BUTTON */}

          <button
            type="button"
            className="expression-evaluate-button"
            onClick={evaluate}
            disabled={loading}
          >

            {loading
              ? "Evaluating..."
              : "Evaluate Expression"}

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>

        </section>


        {/* RIGHT SIDEBAR */}

        <aside className="expression-sidebar">

          {/* EXAMPLES */}

          <div className="operations-panel">

            <div className="panel-heading">

              <p className="eyebrow">
                EXAMPLES
              </p>

              <h2>
                Try these expressions
              </h2>

            </div>


            <div className="expression-examples">

              {examples.map((example) => (

                <button
                  type="button"
                  key={example}
                  className="expression-example"
                  onClick={() => {
                    setExpression(example);
                    setResult("");
                    setError("");
                  }}
                >

                  <span>
                    {example}
                  </span>

                  <b>
                    →
                  </b>

                </button>

              ))}

            </div>

          </div>


          {/* C++ */}

          <div className="cpp-panel">

            <div className="cpp-panel-icon">
              C++
            </div>

            <h3>
              Powered by C++
            </h3>

            <p>
              Expressions are sent directly to the existing
              C++ expression engine for evaluation.
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


          {/* NAVIGATION */}

          <div className="calculator-navigation">

            <NavLink to="/calculator">
              Basic Calculator
              <span>→</span>
            </NavLink>

            <NavLink to="/advanced">
              Advanced Operations
              <span>→</span>
            </NavLink>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Expression;