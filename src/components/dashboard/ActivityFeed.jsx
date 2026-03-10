export default function ActivityFeed({ items, emptyMessage = 'No activity yet.' }) {
  if (!items.length) {
    return <p className="dashboard-empty-state">{emptyMessage}</p>;
  }

  return (
    <ul className="dashboard-activity-feed">
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
          <span>{item.time}</span>
        </li>
      ))}
    </ul>
  );
}
