import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  checkHealth,
  getHistory,
} from "../api/calculatorApi";

function Dashboard() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);

  const [loadingStatus, setLoadingStatus] = useState(true);

  /*
   * ============================================================
   * BACKEND STATUS
   * ============================================================
   *
   * Dashboard does not assume that the backend is online.
   *
   * It asks the actual C++ API:
   *
   * React → GET /health → C++ server
   */

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingStatus(true);

      try {
        /*
         * ------------------------------------------------------
         * HEALTH
         * ------------------------------------------------------
         */

        const healthResponse = await checkHealth();

        const isBackendRunning =
          healthResponse?.success === true &&
          healthResponse?.status === "running";

        setBackendOnline(isBackendRunning);


        /*
         * ------------------------------------------------------
         * HISTORY
         * ------------------------------------------------------
         *
         * The count and entries come directly from C++.
         */

        if (isBackendRunning) {
          const historyResponse =
            await getHistory();

          if (historyResponse?.success === true) {
            const backendHistory =
              Array.isArray(historyResponse.history)
                ? historyResponse.history
                : [];

            setHistoryCount(
              Number.isFinite(historyResponse.count)
                ? historyResponse.count
                : backendHistory.length
            );

            /*
             * Display the latest entries returned
             * by the C++ backend.
             */
            setRecentHistory(
              backendHistory.slice(-3).reverse()
            );
          } else {
            setHistoryCount(0);
            setRecentHistory([]);
          }
        } else {
          setHistoryCount(0);
          setRecentHistory([]);
        }

      } catch {
        /*
         * If the C++ backend cannot be reached,
         * Dashboard does NOT assume it is online.
         */
        setBackendOnline(false);
        setHistoryCount(0);
        setRecentHistory([]);
      } finally {
        setLoadingStatus(false);
      }
    };

    loadDashboardData();
  }, []);


  /*
   * Backend exposes:
   *
   * Basic:
   * add
   * subtract
   * multiply
   * divide
   * modulus
   *
   * Advanced:
   * power
   * percentage
   * gcd
   * lcm
   * squareRoot
   * factorial
   * primeCheck
   * evenOddCheck
   *
   * Total = 13 operation endpoints.
   *
   * Expression evaluation is exposed separately through
   * /expression.
   */
  const supportedOperations = 13;


  return (
    <main
  className="main-content"
  style={{ fontFamily: "Inter, sans-serif" }}
>

      {/* =====================================================
          TOPBAR
      ===================================================== */}

      <header className="topbar">

        <div>

          <p className="eyebrow">
            CALCUX / OVERVIEW
          </p>

          <h1>
            Dashboard
          </h1>

        </div>


        

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">

        <div>

          <span className="hero-label">
            C++ POWERED CALCULATOR
          </span>

          <h2>
            Calculate with
            <br />
            <span>precision.</span>
          </h2>

          <p>
            A modern interface powered by your C++
            calculation engine. Fast, reliable and
            built for every calculation.
          </p>

          <NavLink
            to="/calculator"
            className="primary-button"
          >
            Open Calculator
            <span>→</span>
          </NavLink>

        </div>


        <div className="hero-visual">

          <div className="hero-symbol">
            ∑
          </div>

          <div className="hero-glow"></div>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            +
          </div>

          <span>
            OPERATIONS
          </span>

          <strong>
            {supportedOperations}
          </strong>

          <p>
            C++ calculation operations
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            C++
          </div>

          <span>
            ENGINE
          </span>

          <strong>
            C++
          </strong>

          <p>
            Core calculation engine
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            ↔
          </div>

          <span>
            API
          </span>

          <strong>
            {loadingStatus
              ? "..."
              : backendOnline
                ? "ONLINE"
                : "OFFLINE"}
          </strong>

          <p>
            C++ backend communication
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            ◷
          </div>

          <span>
            HISTORY
          </span>

          <strong>
            {loadingStatus
              ? "..."
              : historyCount}
          </strong>

          <p>
            Stored calculations
          </p>

        </div>

      </section>


      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}

      <section className="section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              TOOLS
            </p>

            <h2>
              Quick Access
            </h2>

          </div>

          <span>
            Explore CALCUX
          </span>

        </div>


        <div className="tool-grid">

          {/* BASIC */}

          <div className="tool-card">

            <div className="tool-card-top">

              <div className="tool-icon">
                +
              </div>

              <span>
                01
              </span>

            </div>

            <h3>
              Basic Calculator
            </h3>

            <p>
              Perform everyday arithmetic calculations
              through the C++ engine.
            </p>

            <NavLink to="/calculator">
              <button type="button">
                Open calculator →
              </button>
            </NavLink>

          </div>


          {/* ADVANCED */}

          <div className="tool-card">

            <div className="tool-card-top">

              <div className="tool-icon">
                ✦
              </div>

              <span>
                02
              </span>

            </div>

            <h3>
              Advanced Operations
            </h3>

            <p>
              Power, factorial, GCD, LCM and more
              through C++.
            </p>

            <NavLink to="/advanced">
              <button type="button">
                Explore operations →
              </button>
            </NavLink>

          </div>


          {/* EXPRESSION */}

          <div className="tool-card">

            <div className="tool-card-top">

              <div className="tool-icon">
                ƒx
              </div>

              <span>
                03
              </span>

            </div>

            <h3>
              Expression Calculator
            </h3>

            <p>
              Evaluate complete mathematical expressions
              using the C++ expression engine.
            </p>

            <NavLink to="/expression">
              <button type="button">
                Open expressions →
              </button>
            </NavLink>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <section className="bottom-grid">


        {/* ARCHITECTURE */}

        <div className="info-card">

          <div className="card-header">

            <div>

              <p className="eyebrow">
                ARCHITECTURE
              </p>

              <h3>
                C++ at the core
              </h3>

            </div>

            <span className="architecture-icon">
              C++
            </span>

          </div>


          <p>
            CALCUX uses the existing C++ backend to
            handle calculations, expression evaluation,
            advanced operations and history.
          </p>


          <div className="architecture-flow">

            <span>
              React
            </span>

            <b>
              →
            </b>

            <span>
              REST API
            </span>

            <b>
              →
            </b>

            <strong>
              C++
            </strong>

          </div>

        </div>


        {/* SYSTEM HEALTH */}

        <div className="info-card">

          <div className="card-header">

            <div>

              <p className="eyebrow">
                STATUS
              </p>

              <h3>
                System Health
              </h3>

            </div>

            <span
              className="health-dot"
              style={{
                opacity: backendOnline ? 1 : 0.35,
              }}
            ></span>

          </div>


          <div className="health-row">

            <span>
              HTTP API
            </span>

            <strong>
              {loadingStatus
                ? "Checking..."
                : backendOnline
                  ? "Online"
                  : "Offline"}
            </strong>

          </div>


          <div className="health-row">

            <span>
              Calculator Engine
            </span>

            <strong>
              {loadingStatus
                ? "Checking..."
                : backendOnline
                  ? "Ready"
                  : "Unavailable"}
            </strong>

          </div>


          <div className="health-row">

            <span>
              History Service
            </span>

            <strong>
              {loadingStatus
                ? "Checking..."
                : backendOnline
                  ? `${historyCount} entries`
                  : "Unavailable"}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          RECENT BACKEND HISTORY
      ===================================================== */}

      {recentHistory.length > 0 && (

        <section className="section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                C++ BACKEND
              </p>

              <h2>
                Recent Calculations
              </h2>

            </div>

            <NavLink to="/history">
              View history →
            </NavLink>

          </div>


          <div className="history-list">

            {recentHistory.map(
              (entry, index) => (

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

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </main>
  );
}

export default Dashboard;