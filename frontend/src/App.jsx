import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const allProducts = [
    { id: 1, name: "Wireless Mouse", price: 25, image: "🖱️", category: "Accessories" },
    { id: 2, name: "Mechanical Keyboard", price: 80, image: "⌨️", category: "Accessories" },
    { id: 3, name: "USB-C Hub", price: 45, image: "🔌", category: "Accessories" },
    { id: 4, name: "Laptop Stand", price: 35, image: "💻", category: "Office" },
    { id: 5, name: "Notebook", price: 12, image: "📓", category: "Office" },
    { id: 6, name: "Desk Lamp", price: 55, image: "💡", category: "Office" },
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(allProducts);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const categories = ["All", ...new Set(allProducts.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 700);
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const uniqueItems = cart.length;

  const isInCart = (id) => cart.some((item) => item.id === id);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">React Shopping Demo</p>
          <h1 className="title">Shopping Cart</h1>
          <p className="subtitle">
            A polished single-page shopping cart interface with filtering,
            quantity control, and responsive layout.
          </p>
        </div>

        <div className="cart-badge">
          <span className="cart-badge-icon">🛒</span>
          <div>
            <p className="cart-badge-label">Items in Cart</p>
            <p className="cart-badge-count">{totalItems}</p>
          </div>
        </div>
      </header>

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
            <div className="products-grid">
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
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card">
                  <div className="product-image">{product.image}</div>
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="price">${product.price}</p>

                  <button
                    className={`add-button ${isInCart(product.id) ? "added" : ""} ${
                      addedId === product.id ? "pop" : ""
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    {addedId === product.id
                      ? "Added!"
                      : isInCart(product.id)
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

          {cart.length === 0 ? (
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
                  <div key={item.id} className="cart-item">
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
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="small-button"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="checkout-box">
                <h3 className="total">Total: ${totalPrice}</h3>
                <button className="checkout-button">Proceed to Checkout</button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;