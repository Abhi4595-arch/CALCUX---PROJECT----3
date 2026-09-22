import { NavLink } from "react-router-dom";

const navigation = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "⌂",
  },
  {
    path: "/calculator",
    label: "Calculator",
    icon: "＋",
  },
  {
    path: "/expression",
    label: "Expression",
    icon: "ƒx",
  },
  {
    path: "/advanced",
    label: "Advanced",
    icon: "◈",
  },
  {
    path: "/history",
    label: "History",
    icon: "◷",
  },
];

function Sidebar() {
  return (
    <aside className="app-sidebar">

      <div className="sidebar-brand">
        <div className="brand-mark">C++</div>

        <div>
          <strong>CALCUX</strong>
          <span>C++ CALCULATOR</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">
          WORKSPACE
        </p>

        <nav className="sidebar-navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "sidebar-link-active"
                    : ""
                }`
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? "sidebar-link-active"
                : ""
            }`
          }
        >
          <span className="sidebar-icon">
            i
          </span>

          <span>About</span>
        </NavLink>

        <div className="sidebar-engine">
          <div className="sidebar-engine-top">
            <span className="sidebar-engine-dot"></span>

            <span>
              C++ ENGINE
            </span>
          </div>

          <strong>
            Core calculation layer
          </strong>

          <small>
            React UI · C++ Core
          </small>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;