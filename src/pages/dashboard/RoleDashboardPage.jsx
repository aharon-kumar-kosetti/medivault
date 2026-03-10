import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';

export default function RoleDashboardPage({ roleLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <section className="auth-dashboard">
        <div className="auth-dashboard-card">
          <h1>{roleLabel} Dashboard</h1>
          <p>
            Welcome, {user?.email || 'user'}. This placeholder confirms role-based login and route protection are working.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-outline" to="/">
              Back to Home
            </Link>
            <button type="button" className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
