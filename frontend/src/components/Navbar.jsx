import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link> |{" "}
      <Link to="/products">Products</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;