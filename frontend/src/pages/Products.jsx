import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import "../App.css";

import { request } from "../api";

function Products() {
  const [searchParams] =
    useSearchParams();

  const adminUserId =
    searchParams.get("adminUser");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [addedId, setAddedId] =
    useState(null);

  const [productView, setProductView] =
    useState("comfortable");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await request(
        "/products"
      );

      setProducts(data);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      products.map((p) => p.category)
    ),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (
        product.name || ""
      )
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
  ]);

  const addToCart = async (product) => {
    try {
      await request("/cart", {
        method: "POST",

        body: JSON.stringify({
          productId: product._id,

          adminUserId:
            adminUserId || null,
        }),
      });

      setAddedId(product._id);

      setTimeout(() => {
        setAddedId(null);
      }, 700);
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setErrorMessage(error.message);
    }
  };

  const productGridClass =
    productView === "compact"
      ? "products-grid compact-grid"
      : "products-grid";

  return (
    <div className="page">
      <section className="products-section">
        <div className="section-top">
          <div>
            <h2>Products</h2>

            <p className="section-note">
              {adminUserId
                ? "Adding products for selected user."
                : "Browse products and add them to your cart."}
            </p>
          </div>

          <div
            className="view-toggle"
            aria-label="Product view selector"
          >
            <button
              type="button"
              className={
                productView ===
                "comfortable"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setProductView(
                  "comfortable"
                )
              }
            >
              Comfort
            </button>

            <button
              type="button"
              className={
                productView ===
                "compact"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setProductView("compact")
              }
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
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
          >
            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        {errorMessage && (
          <div className="notice-box">
            <p>{errorMessage}</p>
          </div>
        )}

        {loading ? (
          <div className={productGridClass}>
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="card skeleton-card"
              >
                <div className="skeleton skeleton-image"></div>

                <div className="skeleton skeleton-tag"></div>

                <div className="skeleton skeleton-title"></div>

                <div className="skeleton skeleton-price"></div>

                <div className="skeleton skeleton-button"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <p className="empty-products">
            No products match your
            search.
          </p>
        ) : (
          <div className={productGridClass}>
            {filteredProducts.map(
              (product) => (
                <div
                  key={product._id}
                  className="card"
                >
                  <div className="product-image">
                    {product.image}
                  </div>

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  <p className="price">
                    ${product.price}
                  </p>

                  <button
                    className={`add-button ${
                      addedId ===
                      product._id
                        ? "pop"
                        : ""
                    }`}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    {addedId ===
                    product._id
                      ? "Added!"
                      : "Add to Cart"}
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;