export default function AuthFileUpload({ id, label, onChange, error, helperText }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type="file"
        onChange={onChange}
        className={error ? 'has-error' : ''}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {helperText ? <p className="auth-field-hint">{helperText}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="auth-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
