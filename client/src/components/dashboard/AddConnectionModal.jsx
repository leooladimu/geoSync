import React, { useState } from "react";
import styled from "styled-components";
import { SYMBOLS, bp } from "../../theme/theme";
import {
  AuthInput,
  AuthLabel,
  AuthField,
  AuthButton,
  AuthError,
} from "../auth/Shared";
import { api } from "../../utils/api";

const CONNECTION_TYPES = ["romantic", "family", "platonic", "professional"];

const EMPTY = {
  type: "",
  name: "",
  dob: "",
  city: "",
  state: "",
  country: "",
};

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
          <CloseButton onClick={onClose}>✕</CloseButton>
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.xl};
  }
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background-color: ${(props) => props.theme.colors.bgCard};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.lg};
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  max-height: 90vh;
  overflow-y: auto;

  @media (min-width: ${bp.md}) {
    border-radius: ${(props) => props.theme.radius.xl};
    padding: ${(props) => props.theme.spacing["2xl"]};
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.textPrimary};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.xl};
  }
`;

const CloseButton = styled.button`
  color: ${(props) => props.theme.colors.textMuted};
  font-size: ${(props) => props.theme.fontSizes.md};
  &:hover {
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(props) => props.theme.spacing.xs};

  @media (min-width: ${bp.sm}) {
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const TypeButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) =>
    props.$selected
      ? props.theme.colors.accentDim
      : props.theme.colors.bgElevated};
  color: ${(props) =>
    props.$selected
      ? props.theme.colors.accentLight
      : props.theme.colors.textSecondary};
  border: 1px solid
    ${(props) =>
      props.$selected ? props.theme.colors.accent : props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.xs};
  transition: all ${(props) => props.theme.transitions.fast};
  text-transform: capitalize;

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const LocationRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
  }
`;
