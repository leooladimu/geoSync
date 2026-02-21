import styled from "styled-components";
import { bp } from "../../theme/theme";

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.bg};
  padding: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.lg};
  }
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${(props) => props.theme.colors.bgCard};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    border-radius: ${(props) => props.theme.radius.xl};
    padding: ${(props) => props.theme.spacing["2xl"]};
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

export const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

export const AuthTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes["2xl"]};
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }
`;

export const AuthSubtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

export const AuthField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

export const AuthLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const AuthInput = styled.input`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.bgElevated};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSizes.md};
  transition: border-color ${(props) => props.theme.transitions.fast};

  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }
`;

export const AuthButton = styled.button`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.textPrimary};
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: 600;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.accentLight};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AuthError = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.danger}22;
  border: 1px solid ${(props) => props.theme.colors.danger}44;
  border-radius: ${(props) => props.theme.radius.md};
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

export const AuthLink = styled.a`
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSizes.sm};
  transition: color ${(props) => props.theme.transitions.fast};

  &:hover {
    color: ${(props) => props.theme.colors.accentLight};
  }
`;
