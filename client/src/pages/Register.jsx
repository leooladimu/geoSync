import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS } from "../theme/theme";
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthButton,
  AuthError,
  AuthLink,
} from "../components/auth/Shared";

const BackLink = styled(AuthLink)`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.textMuted};

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <BackLink as={Link} to="/welcome">
          ← Back
        </BackLink>

        <AuthHeader>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            {SYMBOLS.earth}
          </div>
          <AuthTitle>Create Account</AuthTitle>
          <AuthSubtitle>
            Start your compatibility journey with geoSync
          </AuthSubtitle>
        </AuthHeader>

        <form onSubmit={handleSubmit}>
          <AuthField>
            <AuthLabel>Name</AuthLabel>
            <AuthInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </AuthField>

          <AuthField>
            <AuthLabel>Email</AuthLabel>
            <AuthInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </AuthField>

          <AuthField>
            <AuthLabel>Password</AuthLabel>
            <AuthInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </AuthField>

          <AuthField>
            <AuthLabel>Confirm Password</AuthLabel>
            <AuthInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </AuthField>

          {error && <AuthError>{error}</AuthError>}

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </AuthButton>
        </form>

        <AuthSubtitle>
          Already have an account?{" "}
          <AuthLink as={Link} to="/login">
            Sign in
          </AuthLink>
        </AuthSubtitle>
      </AuthCard>
    </AuthContainer>
  );
}
