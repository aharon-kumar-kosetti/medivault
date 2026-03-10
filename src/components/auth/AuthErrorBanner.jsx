export default function AuthErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return <p className="auth-error-banner">{message}</p>;
}
