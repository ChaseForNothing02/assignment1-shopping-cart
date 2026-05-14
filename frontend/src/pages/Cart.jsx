import { useEffect, useState } from "react";
import "../App.css";

import { request } from "../api";

function Cart() {
  const [cart, setCart] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await request("/cart");
      setCart(data);
    } catch (error) {
      console.error("Refresh cart error:", error);
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

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="page">
      <aside className="cart-section">
        <div className="cart-header">
          <h2>Cart</h2>

          {cart.length > 0 && (
            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-summary">
          <p className="summary-label">Total Items</p>

          <p className="summary-value">{totalItems}</p>
        </div>

        {errorMessage && (
          <div className="notice-box">
            <p>{errorMessage}</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="empty-cart-box">
            <div className="empty-cart-icon">🛍️</div>

            <p className="empty-cart-title">
              Your cart is empty
            </p>

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
                    <div className="cart-item-icon">
                      {item.image}
                    </div>

                    <div>
                      <h4 className="cart-item-name">
                        {item.name}
                      </h4>

                      <p className="cart-item-text">
                        ${item.price} each
                      </p>

                      <p className="cart-item-text">
                        Subtotal: $
                        {item.price * item.quantity}
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

                    <span className="quantity">
                      {item.quantity}
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
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="checkout-box">
              <h3 className="total">
                Total: ${totalPrice}
              </h3>

              <button className="checkout-button">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default Cart;