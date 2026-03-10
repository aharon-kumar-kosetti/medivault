export default function AuthSubmitButton({ loading, label }) {
  return (
    <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
      {loading ? 'Please wait...' : label}
    </button>
  );
}
