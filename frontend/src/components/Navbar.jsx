import { useEffect, useState } from "react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    clearAuth,
    getSavedUser,
    getToken,
    request,
} from "../api";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(getSavedUser());
    const [cartCount, setCartCount] = useState(0);
    const [keyword, setKeyword] = useState("");

    const fetchCartCount = async () => {
        if (!getToken()) {
            setCartCount(0);
            return;
        }

        try {
            const data = await request("/cart");

            const count = data.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartCount(count);
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        setUser(getSavedUser());
        fetchCartCount();
    }, [location.pathname]);

    useEffect(() => {
        const updateCart = () => {
            setUser(getSavedUser());
            fetchCartCount();
        };

        window.addEventListener("cartUpdated", updateCart);
        window.addEventListener("storage", updateCart);

        return () => {
            window.removeEventListener("cartUpdated", updateCart);
            window.removeEventListener("storage", updateCart);
        };
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        const query = keyword.trim();

        if (query) {
            navigate(`/products?q=${encodeURIComponent(query)}`);
        } else {
            navigate("/products");
        }
    };

    const handleLogout = () => {
        clearAuth();
        setUser(null);
        setCartCount(0);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/login");
    };

    return (
        <header className="site-header">
            <nav className="modern-navbar">
                <NavLink to="/" className="brand">
                    <span className="brand-icon">🛒</span>
                    <span>EasyBuy</span>
                </NavLink>

                <form className="nav-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />

                    <button type="submit">Search</button>
                </form>

                <div className="nav-links">
                    <NavLink to="/products">Products</NavLink>

                    <NavLink to="/cart" className="cart-link">
                        Cart
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </NavLink>

                    {user?.role === "admin" && (
                        <NavLink to="/admin">Admin</NavLink>
                    )}

                    {user ? (
                        <div className="nav-user">
                            <span className="user-pill">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>

                            <span className="user-name">{user.name}</span>

                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="login-link">
                            Login
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;