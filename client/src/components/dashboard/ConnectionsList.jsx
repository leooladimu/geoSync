import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../utils/api";
import { bp } from "../../theme/theme";

const ConnectionsGrid = styled.div`
  display: grid;
  gap: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const ConnectionCard = styled.div`
  background-color: ${(props) => props.theme.colors.bgCard};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.lg};
  padding: ${(props) => props.theme.spacing.md};
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    border-radius: ${(props) => props.theme.radius.xl};
    padding: ${(props) => props.theme.spacing.lg};
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const ConnectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

const ConnectionInfo = styled.div`
  flex: 1;
`;

const ConnectionName = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.xs};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.lg};
  }
`;

const ConnectionType = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  color: ${(props) => props.theme.colors.textMuted};
  text-transform: capitalize;

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.sm}) {
    flex-direction: row;
    gap: ${(props) => props.theme.spacing.md};
    margin-top: ${(props) => props.theme.spacing.md};
  }
`;

const ViewButton = styled(Link)`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: transparent;
  color: ${(props) => props.theme.colors.accent};
  border: 1px solid ${(props) => props.theme.colors.accent};
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.xs};
  text-decoration: none;
  text-align: center;
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.accentDim};
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const DeleteButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: transparent;
  color: ${(props) => props.theme.colors.danger};
  border: 1px solid ${(props) => props.theme.colors.danger};
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.danger}22;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textSecondary};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing["2xl"]};
  }
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  opacity: 0.5;

  @media (min-width: ${bp.md}) {
    font-size: 3rem;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

export default function ConnectionsList({ token }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConnections() {
      try {
        const data = await api.get("/connections", token);
        setConnections(data);
      } catch (err) {
        console.error("Failed to load connections:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConnections();
  }, [token]);

  const handleDeleteConnection = async (connectionId) => {
    if (!window.confirm("Are you sure you want to delete this connection?")) return;

    try {
      await api.delete(`/connections/${connectionId}`, token);
      setConnections((prev) =>
        prev.filter((conn) => conn._id !== connectionId),
      );
    } catch (err) {
      console.error("Failed to delete connection:", err);
    }
  };

  if (loading) return null;

  return (
    <>
      <ConnectionsGrid>
        {connections.length === 0 ? (
          <EmptyState>
            <EmptyIcon />
            <div>No connections yet</div>
            <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Add your first connection to see your compatibility analysis
            </div>
          </EmptyState>
        ) : (
          connections.map((connection) => (
            <ConnectionCard key={connection._id}>
              <ConnectionHeader>
                <ConnectionInfo>
                  <ConnectionName>
                    {connection.manualProfile?.name || "Unknown Connection"}
                  </ConnectionName>
                  <ConnectionType>{connection.type}</ConnectionType>
                </ConnectionInfo>
              </ConnectionHeader>

              <Actions>
                <ViewButton to={`/compatibility/${connection._id}`}>
                  View Full Report
                </ViewButton>
                <DeleteButton
                  onClick={() => handleDeleteConnection(connection._id)}
                >
                  Delete
                </DeleteButton>
              </Actions>
            </ConnectionCard>
          ))
        )}
      </ConnectionsGrid>

    </>
  );
}
