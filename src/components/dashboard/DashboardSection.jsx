export default function DashboardSection({ id, title, subtitle, actions, children }) {
  return (
    <section id={id} className="dashboard-section">
      <div className="dashboard-section-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="dashboard-section-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
