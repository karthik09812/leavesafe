import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <h3 className="mb-3">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="form-control mb-2" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="form-control mb-3" type="password" placeholder="Password (min 6 characters)" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary w-100">Create account</button>
        </form>
        <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
