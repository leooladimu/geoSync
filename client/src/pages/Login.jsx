import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS, bp } from "../theme/theme";

const Container = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.xl};
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.bgCard};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  max-width: 400px;
  width: 100%;

  @media (min-width: ${bp.md}) {
    border-radius: ${(props) => props.theme.radius.xl};
    padding: ${(props) => props.theme.spacing.xl};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-family: ${(props) => props.theme.fonts.display};
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.xl};
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const Title = styled.h1`
  font-family: ${(props) => props.theme.fonts.display};
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: 600;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes["2xl"]};
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }
`;

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.md};
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Input = styled.input`
  background-color: #e8f0fe;
  border: none;
  border-radius: ${(props) => props.theme.radius.md};
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.bg};

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accent};
  }
`;

const Error = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.fontSizes.sm};
  text-align: center;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.bg};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: 600;
  padding: ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: ${(props) => props.theme.radius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.accentLight};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.span`
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

const Footer = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textMuted};
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const FooterLink = styled(Link)`
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo to="/welcome">
          <span>{SYMBOLS.earth}</span>
          <span>geoSync</span>
        </Logo>

        <Title>Welcome back</Title>
        <Subtitle>Sign in to your account.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@gmail.com"
              required
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ButtonIcon>{SYMBOLS.star}</ButtonIcon>}
          </Button>
        </Form>

        <Footer>
          Don't have an account?{" "}
          <FooterLink to="/register">Create one</FooterLink>
        </Footer>
      </Card>
    </Container>
  );
}
