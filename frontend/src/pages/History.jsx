import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getHistory,
  clearHistory as clearHistoryApi,
} from "../api/calculatorApi";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistory();

      if (response?.success) {
        setHistory(
          Array.isArray(response.history)
            ? response.history
            : []
        );
      } else {
        setError(
          response?.message ||
            "Unable to load calculation history."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the C++ backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter((entry) =>
      String(entry)
        .toLowerCase()
        .includes(query)
    );
  }, [history, search]);

  const handleClearHistory = async () => {
    if (history.length === 0 || clearing) {
      return;
    }

    setClearing(true);
    setError("");

    try {
      const response = await clearHistoryApi();

      if (response?.success) {
        setHistory([]);
        setSearch("");
      } else {
        setError(
          response?.message ||
            "Unable to clear history."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the C++ backend."
      );
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="history-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            CALCUX / HISTORY
          </p>

          <h1>Calculation History</h1>

          <p className="page-description">
            View calculations stored by the C++
            calculation engine.
          </p>
        </div>

        <div className="backend-status">
          <span className="status-dot"></span>
          Backend Online
        </div>
      </header>

      <div className="history-layout">

        {/* MAIN HISTORY */}
        <section className="history-card">

          <div className="history-toolbar">

            <div className="history-search">
              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search calculations..."
              />

              {search && (
                <button
                  className="search-clear"
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="history-actions">
              <button
                className="clear-history-button"
                type="button"
                onClick={handleClearHistory}
                disabled={
                  history.length === 0 ||
                  clearing
                }
              >
                {clearing
                  ? "Clearing..."
                  : "Clear History"}
              </button>
            </div>
          </div>

          <div className="history-section-heading">
            <div>
              <p className="eyebrow">
                RECENT CALCULATIONS
              </p>

              <h2>Your activity</h2>
            </div>

            <span>
              {filteredHistory.length}{" "}
              {filteredHistory.length === 1
                ? "calculation"
                : "calculations"}
            </span>
          </div>

          {error && (
            <div className="advanced-error">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="history-list">

            {loading ? (
              <div className="history-empty">
                <div className="history-empty-icon">
                  ƒx
                </div>

                <h3>
                  Loading history...
                </h3>

                <p>
                  Retrieving calculations from
                  the C++ backend.
                </p>
              </div>
            ) : filteredHistory.length > 0 ? (

              filteredHistory.map((entry, index) => (
                <div
                  className="history-item"
                  key={`${entry}-${index}`}
                >
                  <div className="history-item-left">

                    <div className="history-icon">
                      ƒx
                    </div>

                    <div className="history-expression">
                      <strong>
                        {entry}
                      </strong>

                      <div className="history-meta">
                        <span>
                          C++ Backend
                        </span>

                        <b>·</b>

                        <span>
                          History #{index + 1}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="history-item-right">
                    <div className="history-result">
                      <span>ENTRY</span>
                      <strong>
                        {index + 1}
                      </strong>
                    </div>
                  </div>
                </div>
              ))

            ) : (
              <div className="history-empty">

                <div className="history-empty-icon">
                  ƒx
                </div>

                <h3>
                  No calculations found
                </h3>

                <p>
                  {history.length === 0
                    ? "Your C++ calculation history is empty."
                    : "Try a different search."}
                </p>

                {history.length === 0 && (
                  <NavLink
                    to="/expression"
                    className="history-empty-button"
                  >
                    Calculate something
                    <span>→</span>
                  </NavLink>
                )}

              </div>
            )}

          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="history-sidebar">

          <div className="history-stats-panel">

            <div className="panel-heading">
              <p className="eyebrow">
                OVERVIEW
              </p>

              <h2>
                History Summary
              </h2>
            </div>

            <div className="history-stat">
              <div className="history-stat-icon">
                #
              </div>

              <div>
                <span>
                  TOTAL CALCULATIONS
                </span>

                <strong>
                  {history.length}
                </strong>
              </div>
            </div>

            <div className="history-stat">
              <div className="history-stat-icon">
                ↻
              </div>

              <div>
                <span>
                  FILTERED RESULTS
                </span>

                <strong>
                  {filteredHistory.length}
                </strong>
              </div>
            </div>

            <div className="history-stat">
              <div className="history-stat-icon">
                ✓
              </div>

              <div>
                <span>
                  BACKEND
                </span>

                <strong className="online-text">
                  Online
                </strong>
              </div>
            </div>

          </div>

          <div className="cpp-panel">

            <div className="cpp-panel-icon">
              C++
            </div>

            <h3>
              Powered by C++
            </h3>

            <p>
              History is retrieved directly from
              the existing C++ backend.
            </p>

            <div className="cpp-flow">
              <span>React</span>
              <b>→</b>
              <span>API</span>
              <b>→</b>
              <strong>C++</strong>
            </div>

          </div>

          <div className="calculator-navigation">

            <NavLink to="/calculator">
              Basic Calculator
              <span>→</span>
            </NavLink>

            <NavLink to="/expression">
              Expression Calculator
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

export default History;