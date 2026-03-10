export default function AuthSelect({ id, label, value, onChange, options, error }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={error ? 'has-error' : ''}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="auth-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
