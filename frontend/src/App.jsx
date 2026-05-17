import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
    return (
        <>
            <Navbar />

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/admin"
                        element={<Admin />}
                    />
                </Routes>
            </main>
        </>
    );
}

export default App;