import styled from "styled-components";
export const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
export const StepSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  line-height: 1.6;
`;
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;
export const Field = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};
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
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 0 ${({ theme }) => theme.radius.md}
    ${({ theme }) => theme.radius.md} 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
export const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;
export const NextButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  margin-left: auto;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentLight};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
export const BackButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;
