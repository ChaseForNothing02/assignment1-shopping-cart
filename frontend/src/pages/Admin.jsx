import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "../App.css";

import {
  getSavedUser,
  request,
} from "../api";

function Admin() {
  const [adminCarts, setAdminCarts] =
    useState([]);

  const [loadingAdmin, setLoadingAdmin] =
    useState(false);

  const [adminError, setAdminError] =
    useState("");

  const user = getSavedUser();

  const navigate = useNavigate();

  const fetchAdminCarts = async () => {
    setLoadingAdmin(true);

    setAdminError("");

    try {
      const data = await request(
        "/admin/carts"
      );

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

  const increaseQuantity = async (
    id,
    currentQuantity
  ) => {
    try {
      await request(`/admin/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity:
            currentQuantity + 1,
        }),
      });

      fetchAdminCarts();
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const decreaseQuantity = async (
    id,
    currentQuantity
  ) => {
    try {
      if (currentQuantity <= 1) {
        await removeItem(id);
      } else {
        await request(
          `/admin/cart/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              quantity:
                currentQuantity - 1,
            }),
          }
        );

        fetchAdminCarts();
      }
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      await request(`/admin/cart/${id}`, {
        method: "DELETE",
      });

      fetchAdminCarts();
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const goToProducts = (userId) => {
    navigate(
      `/products?adminUser=${userId}`
    );
  };

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
            Please login as admin.
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
            Admin access only.
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
              User Shopping Carts
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
            Loading...
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
              No carts found
            </p>

            <p className="empty-cart-desc">
              User carts will appear here.
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
                        {
                          cartGroup.user
                            ?.name
                        }
                      </h3>

                      <p className="section-note">
                        {
                          cartGroup.user
                            ?.email
                        }
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

                  <button
                    className="add-product-button"
                    onClick={() =>
                      goToProducts(
                        cartGroup.user._id
                      )
                    }
                  >
                    + Add Product
                  </button>

                  <div className="admin-items">
                    {cartGroup.items.map(
                      (item) => (
                        <div
                          key={item._id}
                          className="admin-item-card"
                        >
                          <div className="admin-item-top">
                            <div className="cart-item-icon">
                              {item.image}
                            </div>

                            <div>
                              <h4 className="admin-product-name">
                                {item.name}
                              </h4>

                              <p className="section-note">
                                $
                                {
                                  item.price
                                }{" "}
                                each
                              </p>
                            </div>
                          </div>

                          <div className="controls">
                            <button
                              className="small-button"
                              onClick={() =>
                                decreaseQuantity(
                                  item._id,
                                  item.quantity
                                )
                              }
                            >
                              -
                            </button>

                            <span className="admin-quantity">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              className="small-button"
                              onClick={() =>
                                increaseQuantity(
                                  item._id,
                                  item.quantity
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-button"
                            onClick={() =>
                              removeItem(
                                item._id
                              )
                            }
                          >
                            Remove
                          </button>
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