import { useState } from "react";
import styled from "styled-components";
import { SYMBOLS } from "../../theme";
import {
  AuthInput,
  AuthLabel,
  AuthField,
  AuthButton,
  AuthError,
} from "../auth/Shared";
import api from "../../utils/api";

const CONNECTION_TYPES = ["romantic", "family", "platonic", "professional"];
const EMPTY = { type: "", name: "", dob: "", city: "", state: "", country: "" };

export default function AddConnectionModal({ token, onAdded, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  function handle(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function isValid() {
    return form.type && form.name && form.dob && form.city && form.country;
  }
  async function handleSubmit() {
    if (!isValid()) return setError("Please fill in all required fields");
    setLoading(true);
    setError(null);
    try {
      const result = await api.post(
        "/connections",
        {
          type: form.type,
          manualProfile: {
            name: form.name,
            dob: form.dob,
            birthLocation: {
              city: form.city,
              state: form.state,
              country: form.country,
            },
          },
        },
        token,
      );
      onAdded(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{SYMBOLS.star} Add a Connection</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close">
            ✕
          </CloseButton>
        </ModalHeader>
        <AuthField>
          <AuthLabel>Relationship type</AuthLabel>
          <TypeGrid>
            {CONNECTION_TYPES.map((t) => (
              <TypeButton
                key={t}
                $selected={form.type === t}
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                type="button"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </TypeButton>
            ))}
          </TypeGrid>
        </AuthField>
        <AuthField>
          <AuthLabel>Their name</AuthLabel>
          <AuthInput
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handle}
          />
        </AuthField>
        <AuthField>
          <AuthLabel>Their date of birth</AuthLabel>
          <AuthInput
            name="dob"
            type="date"
            value={form.dob}
            onChange={handle}
          />
        </AuthField>
        <AuthField>
          <AuthLabel>Their birth location</AuthLabel>
          <LocationRow>
            <AuthInput
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handle}
              style={{ flex: 2 }}
            />
            <AuthInput
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handle}
              style={{ flex: 1 }}
            />
          </LocationRow>
          <AuthInput
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handle}
            style={{ marginTop: "0.5rem" }}
          />
        </AuthField>
        {error && <AuthError>{error}</AuthError>}
        <AuthButton onClick={handleSubmit} disabled={loading || !isValid()}>
          {loading
            ? "Generating report..."
            : `Generate Compatibility Report ${SYMBOLS.earth}`}
        </AuthButton>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.xl};
  @media (max-width: 480px) {
    padding: 0;
    align-items: flex-end;
  }
`;
const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 480px) {
    max-height: 92vh;
    border-radius: ${({ theme }) =>
      `${theme.radius.xl} ${theme.radius.xl} 0 0`};
    padding: ${({ theme }) => theme.spacing.xl}
      ${({ theme }) => theme.spacing.lg};
  }
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.md};
  min-height: unset;
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;
const TypeButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentDim : theme.colors.bgElevated};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentLight : theme.colors.textSecondary};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: capitalize;
  min-height: unset;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
const LocationRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
