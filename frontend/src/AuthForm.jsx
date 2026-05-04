import { useState } from "react";
import { request, saveAuth } from "./api";

function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const path = isRegister ? "/auth/register" : "/auth/login";

      const body = isRegister
        ? { name, email, password, role }
        : { email, password };

      const data = await request(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      saveAuth(data.token, data.user);
      onAuthSuccess(data.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const useCustomerDemo = () => {
    setMode("login");
    setEmail("customer@test.com");
    setPassword("123456");
  };

  const useAdminDemo = () => {
    setMode("login");
    setEmail("admin@test.com");
    setPassword("123456");
  };

  return (
    <section className="auth-card">
      <div>
        <p className="eyebrow">Account Access</p>
        <h2>{isRegister ? "Create an account" : "Login to continue"}</h2>
        <p className="muted">
          Login enables personal cart management. Admin users can review all users' carts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Role
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </>
        )}

        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="At least 6 characters"
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-button">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <div className="auth-actions">
        <button type="button" onClick={() => setMode(isRegister ? "login" : "register")}>
          {isRegister ? "Already have an account? Login" : "Need an account? Register"}
        </button>

        <button type="button" onClick={useCustomerDemo}>
          Use Customer Demo
        </button>

        <button type="button" onClick={useAdminDemo}>
          Use Admin Demo
        </button>
      </div>
    </section>
  );
}

export default AuthForm;