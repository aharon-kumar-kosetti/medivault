import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roleByKey } from '../utils/authRoles';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navRightRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, role, logout } = useAuth();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Keep body scroll locked when mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const scrollTo = (id) => (e) => {
        e.preventDefault();
        closeMenu();

        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
            return;
        }

        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const currentRole = roleByKey(role);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <nav className="navbar" id="navbar">
            <div className="nav-inner">
                {/* Logo */}
                <Link to="/" className="nav-logo" aria-label="MediVault Home" onClick={closeMenu}>
                    <img
                        src="/MEDIVAULT BG REMOVER.png"
                        alt="MediVault Logo"
                        className="nav-logo-img"
                    />
                    <span className="nav-logo-text">MediVault</span>
                </Link>

                {/* Hamburger */}
                <button
                    className={`nav-hamburger${menuOpen ? ' open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span /><span /><span />
                </button>

                {/* Right side */}
                <div className={`nav-right${menuOpen ? ' open' : ''}`} ref={navRightRef}>
                    <ul className="nav-links">
                        <li><a href="#features" onClick={scrollTo('features')}>Features</a></li>
                        <li><a href="#flow" onClick={scrollTo('flow')}>How It Works</a></li>
                        <li><a href="#cta" onClick={scrollTo('cta')}>About</a></li>
                    </ul>
                    <div className="nav-buttons">
                        {isAuthenticated ? (
                            <>
                                <Link to={currentRole?.dashboardPath || '/'} className="btn btn-outline" onClick={closeMenu}>
                                    Dashboard
                                </Link>
                                <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
