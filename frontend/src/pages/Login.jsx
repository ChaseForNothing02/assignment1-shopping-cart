import { useEffect, useState } from "react";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { request, saveAuth } from "../api";

import "../App.css";

function Login() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("customer");

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const isRegister = mode === "register";

  useEffect(() => {
    const currentMode =
      searchParams.get("mode");

    if (currentMode === "register") {
      setMode("register");
    } else {
      setMode("login");
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setSuccessMessage("");

    try {
      const path =
        mode === "register"
          ? "/auth/register"
          : "/auth/login";

      const body =
        mode === "register"
          ? {
              name,
              email,
              password,
              role,
            }
          : {
              email,
              password,
            };

      const data = await request(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      saveAuth(data.token, data.user);

      setSuccessMessage(
        `${
          mode === "register"
            ? "Registered"
            : "Logged in"
        } successfully!`
      );

      setTimeout(() => {
  if (data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/cart");
  }
}, 1000);
    } catch (error) {
      console.error(error);

      setError(error.message);
    }
  };

  return (
    <div className="page">
      <section className="auth-card mobile-auth-card">
        <div className="auth-header">
          <p className="eyebrow">
            EASYBUY ACCOUNT
          </p>

          <h2>
            {isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>

          <p className="muted">
            {isRegister
              ? "Create your EasyBuy account to start shopping."
              : "Login to manage your shopping cart easily."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          {isRegister && (
            <>
              <label>
                Full Name

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                Account Type

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                >
                  <option value="customer">
                    Customer
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </label>
            </>
          )}

          <label>
            Email Address

            <input
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="email@example.com"
            />
          </label>

          <label>
            Password

            <input
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              type="password"
              placeholder="Enter password"
            />
          </label>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="success-message">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
          >
            {isRegister
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <div className="auth-actions">
          <button
            type="button"
            className="switch-auth-button"
            onClick={() =>
              navigate(
                isRegister
                  ? "/login"
                  : "/login?mode=register"
              )
            }
          >
            {isRegister
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Login;