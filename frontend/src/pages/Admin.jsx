import { useEffect, useState } from "react";

import "../App.css";

import { getSavedUser, request } from "../api";

function Admin() {
  const [adminCarts, setAdminCarts] = useState([]);

  const [loadingAdmin, setLoadingAdmin] =
    useState(false);

  const [adminError, setAdminError] =
    useState("");

  const user = getSavedUser();

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
  }, []);

  if (!user) {
    return (
      <div className="page">
        <div className="empty-cart-box">
          <div className="empty-cart-icon">
            🔐
          </div>

          <p className="empty-cart-title">
            Login required
          </p>

          <p className="empty-cart-desc">
            Please login as admin to access
            this page.
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="page">
        <div className="empty-cart-box">
          <div className="empty-cart-icon">
            ⛔
          </div>

          <p className="empty-cart-title">
            Access denied
          </p>

          <p className="empty-cart-desc">
            This page is only available for
            admin users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <p className="section-note">
              Admin Dashboard
            </p>

            <h2>
              All Users' Shopping Carts
            </h2>
          </div>

          <button
            className="clear-cart-button"
            onClick={fetchAdminCarts}
          >
            Refresh
          </button>
        </div>

        {loadingAdmin ? (
          <p className="section-note">
            Loading admin cart data...
          </p>
        ) : adminError ? (
          <p className="error-message">
            {adminError}
          </p>
        ) : adminCarts.length === 0 ? (
          <div className="empty-cart-box">
            <div className="empty-cart-icon">
              📦
            </div>

            <p className="empty-cart-title">
              No user carts found
            </p>

            <p className="empty-cart-desc">
              Customer cart activity will
              appear here.
            </p>
          </div>
        ) : (
          <div className="admin-cart-list">
            {adminCarts.map(
              (cartGroup, index) => (
                <div
                  key={
                    cartGroup.user?._id ||
                    index
                  }
                  className="admin-cart-card"
                >
                  <div className="admin-user-row">
                    <div>
                      <h3>
                        {cartGroup.user?.name ||
                          "Unknown User"}
                      </h3>

                      <p className="section-note">
                        {cartGroup.user
                          ?.email ||
                          "No email available"}
                      </p>
                    </div>

                    <div className="admin-total-box">
                      <strong>
                        $
                        {
                          cartGroup.totalPrice
                        }
                      </strong>

                      <span>
                        {
                          cartGroup.totalItems
                        }{" "}
                        items
                      </span>
                    </div>
                  </div>

                  <div className="admin-items">
                    {cartGroup.items.map(
                      (item) => (
                        <div
                          key={item._id}
                          className="admin-item-row"
                        >
                          <span>
                            {item.image}
                          </span>

                          <span>
                            {item.name}
                          </span>

                          <span>
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </span>

                          <span>
                            $
                            {item.price *
                              item.quantity}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;