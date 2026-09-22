import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Advanced from "./pages/Advanced";
import Expression from "./pages/Expression";
import History from "./pages/History";
import About from "./pages/About";

import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">

        <Sidebar />

        <main className="app-main">
          <Routes>

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/calculator"
              element={<Calculator />}
            />

            <Route
              path="/advanced"
              element={<Advanced />}
            />

            <Route
              path="/expression"
              element={<Expression />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/about"
              element={<About />}
            />

          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;