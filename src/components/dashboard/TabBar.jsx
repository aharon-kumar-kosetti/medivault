export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="dashboard-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`dashboard-tab${activeTab === tab.key ? ' is-active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
