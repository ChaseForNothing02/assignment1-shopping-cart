import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AuthForm from "./AuthForm";
import { clearAuth, getSavedUser, request } from "./api";

function AdminDashboard({ user }) {
  const [adminCarts, setAdminCarts] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");

  const fetchAdminCarts = async () => {
    setLoadingAdmin(true);
    setAdminError("");

    try {
      const data = await request("/admin/carts");
      setAdminCarts(data);
    } catch (error) {
      setAdminError(error.message);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminCarts();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <p className="section-note">Admin Dashboard</p>
          <h2>All Users' Shopping Carts</h2>
        </div>

        <button className="clear-cart-button" onClick={fetchAdminCarts}>
          Refresh
        </button>
      </div>

      {loadingAdmin ? (
        <p className="section-note">Loading admin cart data...</p>
      ) : adminError ? (
        <p className="error-message">{adminError}</p>
      ) : adminCarts.length === 0 ? (
        <div className="empty-cart-box">
          <div className="empty-cart-icon">📦</div>
          <p className="empty-cart-title">No user carts found</p>
          <p className="empty-cart-desc">
            Customer cart activity will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-cart-list">
          {adminCarts.map((cartGroup, index) => (
            <div key={cartGroup.user?._id || index} className="admin-cart-card">
              <div className="admin-user-row">
                <div>
                  <h3>{cartGroup.user?.name || "Unknown User"}</h3>
                  <p className="section-note">
                    {cartGroup.user?.email || "No email available"}
                  </p>
                </div>

                <div className="admin-total-box">
                  <strong>${cartGroup.totalPrice}</strong>
                  <span>{cartGroup.totalItems} items</span>
                </div>
              </div>

              <div className="admin-items">
                {cartGroup.items.map((item) => (
                  <div key={item._id} className="admin-item-row">
                    <span>{item.image}</span>
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedId, setAddedId] = useState(null);
  const [productView, setProductView] = useState("comfortable");
  const [user, setUser] = useState(getSavedUser());
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await request("/products");
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const data = await request("/cart");
      setCart(data);
    } catch (error) {
      console.error("Refresh cart error:", error);
      setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setCart([]);
    setErrorMessage("");
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = async (product) => {
    if (!user) {
      setErrorMessage("Please login before adding products to your cart.");
      return;
    }

    try {
      setErrorMessage("");

      await request("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      await fetchCart();

      setAddedId(product._id);
      setTimeout(() => {
        setAddedId(null);
      }, 700);
    } catch (error) {
      console.error("Add to cart error:", error);
      setErrorMessage(error.message);
    }
  };

  const increaseQuantity = async (id, currentQuantity) => {
    try {
      await request(`/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: currentQuantity + 1,
        }),
      });

      await fetchCart();
    } catch (error) {
      console.error("Increase quantity error:", error);
      setErrorMessage(error.message);
    }
  };

  const decreaseQuantity = async (id, currentQuantity) => {
    try {
      if (currentQuantity === 1) {
        await request(`/cart/${id}`, {
          method: "DELETE",
        });
      } else {
        await request(`/cart/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            quantity: currentQuantity - 1,
          }),
        });
      }

      await fetchCart();
    } catch (error) {
      console.error("Decrease quantity error:", error);
      setErrorMessage(error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      await request(`/cart/${id}`, {
        method: "DELETE",
      });

      await fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);
      setErrorMessage(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await request("/cart", {
        method: "DELETE",
      });

      await fetchCart();
    } catch (error) {
      console.error("Clear cart error:", error);
      setErrorMessage(error.message);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const uniqueItems = cart.length;

  const isInCart = (productId) =>
    cart.some((item) => String(item.productId) === String(productId));

  const productGridClass =
    productView === "compact" ? "products-grid compact-grid" : "products-grid";

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-text">
          <h1 className="title">Shopping Cart</h1>
          <p className="subtitle">
            Browse products, login, and manage your shopping cart.
          </p>
        </div>

        <div className="account-box">
          {user ? (
            <>
              <p className="account-name">Hi, {user.name}</p>
              <p className="account-role">{user.role}</p>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <p className="section-note">Not logged in</p>
          )}
        </div>
      </header>

      {!user && <AuthForm onAuthSuccess={setUser} />}

      {errorMessage && (
        <div className="notice-box">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Products</p>
          <h3 className="stat-value">{loading ? "--" : filteredProducts.length}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Unique Cart Items</p>
          <h3 className="stat-value">{uniqueItems}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Current Total</p>
          <h3 className="stat-value">${totalPrice}</h3>
        </div>
      </section>

      <main className="main">
        <section className="products-section">
          <div className="section-top">
            <div>
              <h2>Products</h2>
              <p className="section-note">
                Browse products and add them to your cart.
              </p>
            </div>

            <div className="view-toggle" aria-label="Product view selector">
              <button
                type="button"
                className={productView === "comfortable" ? "active" : ""}
                onClick={() => setProductView("comfortable")}
              >
                Comfort
              </button>

              <button
                type="button"
                className={productView === "compact" ? "active" : ""}
                onClick={() => setProductView("compact")}
              >
                Compact
              </button>
            </div>
          </div>

          <div className="filters">
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className={productGridClass}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card skeleton-card">
                  <div className="skeleton skeleton-image"></div>
                  <div className="skeleton skeleton-tag"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-price"></div>
                  <div className="skeleton skeleton-button"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="empty-products">No products match your search.</p>
          ) : (
            <div className={productGridClass}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="card">
                  <div className="product-image">{product.image}</div>
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="price">${product.price}</p>

                  <button
                    className={`add-button ${
                      isInCart(product._id) ? "added" : ""
                    } ${addedId === product._id ? "pop" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    {!user
                      ? "Login to Add"
                      : addedId === product._id
                      ? "Added!"
                      : isInCart(product._id)
                      ? "Add More"
                      : "Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="cart-section">
          <div className="cart-header">
            <h2>Cart</h2>
            {cart.length > 0 && (
              <button className="clear-cart-button" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>

          <div className="cart-summary">
            <p className="summary-label">Total Items</p>
            <p className="summary-value">{totalItems}</p>
          </div>

          {!user ? (
            <div className="empty-cart-box">
              <div className="empty-cart-icon">🔐</div>
              <p className="empty-cart-title">Login required</p>
              <p className="empty-cart-desc">
                Please login to view and manage your personal cart.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="empty-cart-box">
              <div className="empty-cart-icon">🛍️</div>
              <p className="empty-cart-title">Your cart is empty</p>
              <p className="empty-cart-desc">
                Add a few items to see them appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-top">
                      <div className="cart-item-icon">{item.image}</div>
                      <div>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-text">${item.price} each</p>
                        <p className="cart-item-text">
                          Subtotal: ${item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="controls">
                      <button
                        className="small-button"
                        onClick={() =>
                          decreaseQuantity(item._id, item.quantity)
                        }
                      >
                        -
                      </button>

                      <span className="quantity">{item.quantity}</span>

                      <button
                        className="small-button"
                        onClick={() =>
                          increaseQuantity(item._id, item.quantity)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="checkout-box">
                <h3 className="total">Total: ${totalPrice}</h3>

                <button
                  className="checkout-button"
                  onClick={() => setShowModal(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      <AdminDashboard user={user} />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal simple-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Notice</h2>
            <p className="modal-note centered-note">
              Checkout is not available in this prototype.
            </p>

            <button
              className="modal-button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;