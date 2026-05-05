import ThemeToggle from "./ThemeToggle";

function AppHeader({ title, subtitle, action, secondaryAction }) {
  return (
    <header className="topbar glass-panel">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          AI
        </div>
        <div className="brand-copy">
          <h1 className="brand-title">{title}</h1>
          <p className="brand-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        {secondaryAction}
        <ThemeToggle />
        {action}
      </div>
    </header>
  );
}

export default AppHeader;
