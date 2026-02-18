import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS } from "../theme";
import api from "../utils/api";
import {
  AuthPage,
  AuthCard,
  AuthLogo,
  AuthTitle,
  AuthSubtitle,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthButton,
  AuthError,
  AuthFooter,
  Divider,
} from "../components/auth/Shared";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (form.password.length < 8)
      return "Password must be at least 8 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    return null;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(token, user);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthPage>
      <AuthCard>
        <AuthLogo>{SYMBOLS.earth} geoSync</AuthLogo>
        <AuthTitle>Create your account</AuthTitle>
        <AuthSubtitle>Your biophysical profile awaits.</AuthSubtitle>
        <form onSubmit={handleSubmit} noValidate>
          <AuthField>
            <AuthLabel htmlFor="name">Name</AuthLabel>
            <AuthInput
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />
          </AuthField>
          <AuthField>
            <AuthLabel htmlFor="email">Email</AuthLabel>
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </AuthField>
          <AuthField>
            <AuthLabel htmlFor="password">Password</AuthLabel>
            <AuthInput
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
            />
          </AuthField>
          <AuthField>
            <AuthLabel htmlFor="confirm">Confirm password</AuthLabel>
            <AuthInput
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
            />
          </AuthField>
          {error && <AuthError>{error}</AuthError>}
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Creating account..." : `Create Account ${SYMBOLS.star}`}
          </AuthButton>
        </form>
        <Divider>{SYMBOLS.star}</Divider>
        <AuthFooter>
          Already have an account? <Link to="/login">Sign in</Link>
        </AuthFooter>
      </AuthCard>
    </AuthPage>
  );
}
