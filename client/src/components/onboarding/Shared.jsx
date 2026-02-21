import styled from "styled-components";
import { bp } from "../../theme/theme";

export const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${({ theme }) => theme.fontSizes["2xl"]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;
export const StepSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;

  @media (min-width: ${bp.md}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  }
`;
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${bp.md}) {
    gap: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  }
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;
export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
export const ScienceCallout = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border-left: 2px solid ${({ theme }) => theme.colors.accentDim};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md} 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
  }
`;
export const ButtonRow = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
export const NextButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  width: 100%;

  @media (min-width: ${bp.sm}) {
    width: auto;
    margin-left: auto;
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentLight};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
export const BackButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  width: 100%;

  @media (min-width: ${bp.sm}) {
    width: auto;
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;
