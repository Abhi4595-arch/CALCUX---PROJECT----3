import { NavLink } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">CALCUX / ABOUT</p>

          <h1>Built around a C++ engine.</h1>

          <p className="page-description">
            CalcUX combines a modern React interface with a dedicated
            C++ calculation backend.
          </p>
        </div>

        <div className="backend-status">
          <span className="status-dot"></span>
          Backend Online
        </div>
      </header>

      <main className="about-content">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-content">
            <div className="cpp-badge">C++</div>

            <p className="eyebrow">THE CALCUX ENGINE</p>

            <h2>
              A calculator where
              <span> C++ does the work.</span>
            </h2>

            <p>
              CalcUX provides a clean interface for performing basic,
              expression-based, and advanced calculations while keeping
              the existing C++ calculation engine at the core.
            </p>

            <div className="about-hero-actions">
              <NavLink
                to="/calculator"
                className="about-primary-button"
              >
                Open Calculator
                <span>→</span>
              </NavLink>

              <NavLink
                to="/advanced"
                className="about-secondary-button"
              >
                Explore Advanced
              </NavLink>
            </div>
          </div>

          <div className="about-engine-visual">
            <div className="engine-orbit orbit-one"></div>
            <div className="engine-orbit orbit-two"></div>

            <div className="engine-core">
              <span>C++</span>
              <small>ENGINE</small>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="about-section">
          <div className="section-heading">
            <p className="eyebrow">ARCHITECTURE</p>
            <h2>How CalcUX works</h2>
          </div>

          <div className="architecture-flow">
            <div className="architecture-card">
              <div className="architecture-number">01</div>
              <div className="architecture-icon">UI</div>

              <h3>React Frontend</h3>

              <p>
                Provides the calculator interface, navigation,
                controls, and visual presentation.
              </p>

              <span>Presentation Layer</span>
            </div>

            <div className="architecture-arrow">→</div>

            <div className="architecture-card">
              <div className="architecture-number">02</div>
              <div className="architecture-icon">API</div>

              <h3>API Layer</h3>

              <p>
                Sends calculation requests from the interface
                to the existing backend.
              </p>

              <span>Communication Layer</span>
            </div>

            <div className="architecture-arrow">→</div>

            <div className="architecture-card architecture-card-main">
              <div className="architecture-number">03</div>
              <div className="architecture-icon cpp-icon">C++</div>

              <h3>C++ Engine</h3>

              <p>
                Performs the actual calculations and returns
                the result to the frontend.
              </p>

              <span>Core Calculation Layer</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="about-section">
          <div className="section-heading">
            <p className="eyebrow">CAPABILITIES</p>
            <h2>Everything in one calculator</h2>
          </div>

          <div className="about-feature-grid">
            <div className="about-feature-card">
              <div className="feature-icon">01</div>
              <h3>Basic Calculations</h3>
              <p>
                Addition, subtraction, multiplication, division,
                and modulus operations.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="feature-icon">02</div>
              <h3>Expression Calculator</h3>
              <p>
                Enter mathematical expressions and let the C++
                engine evaluate them.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="feature-icon">03</div>
              <h3>Advanced Operations</h3>
              <p>
                Power, percentage, GCD, LCM, square root,
                factorial, prime, and even/odd checks.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="feature-icon">04</div>
              <h3>Calculation History</h3>
              <p>
                View calculations stored by the existing
                backend history system.
              </p>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="about-section">
          <div className="section-heading">
            <p className="eyebrow">TECHNOLOGY</p>
            <h2>Technology stack</h2>
          </div>

          <div className="technology-grid">
            <div className="technology-card technology-cpp">
              <div className="technology-top">
                <span className="technology-logo">C++</span>
                <span className="technology-role">CORE</span>
              </div>

              <h3>C++</h3>

              <p>
                Core calculation engine responsible for processing
                calculator operations.
              </p>
            </div>

            <div className="technology-card">
              <div className="technology-top">
                <span className="technology-logo">R</span>
                <span className="technology-role">UI</span>
              </div>

              <h3>React</h3>

              <p>
                Component-based frontend used to build the
                calculator interface.
              </p>
            </div>

            <div className="technology-card">
              <div className="technology-top">
                <span className="technology-logo">JS</span>
                <span className="technology-role">LOGIC</span>
              </div>

              <h3>JavaScript</h3>

              <p>
                Connects the frontend interface with the
                existing API layer.
              </p>
            </div>

            <div className="technology-card">
              <div className="technology-top">
                <span className="technology-logo">API</span>
                <span className="technology-role">BRIDGE</span>
              </div>

              <h3>REST API</h3>

              <p>
                Provides communication between the React
                interface and C++ backend.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPLE */}
        <section className="about-principle">
          <div>
            <p className="eyebrow">PROJECT PRINCIPLE</p>

            <h2>
              Modern interface.
              <br />
              Existing C++ core.
            </h2>
          </div>

          <p>
            The frontend is designed to improve usability and
            presentation without replacing or modifying the
            underlying C++ calculation logic.
          </p>
        </section>

        {/* NAVIGATION */}
        <section className="about-navigation">
          <NavLink to="/calculator">
            <span>01</span>
            Basic Calculator
            <b>→</b>
          </NavLink>

          <NavLink to="/expression">
            <span>02</span>
            Expression Calculator
            <b>→</b>
          </NavLink>

          <NavLink to="/advanced">
            <span>03</span>
            Advanced Operations
            <b>→</b>
          </NavLink>

          <NavLink to="/history">
            <span>04</span>
            Calculation History
            <b>→</b>
          </NavLink>
        </section>

      </main>
    </div>
  );
}

export default About;