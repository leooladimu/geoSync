import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS } from "../theme";
import api from "../utils/api";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import ConnectionsList from "../components/dashboard/ConnectionsList";
import NudgesFeed from "../components/dashboard/NudgesFeed";
import AddConnectionModal from "../components/dashboard/AddConnectionModal";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const profileData = await api.get("/profile", token);
      const connectionsData = await api.get("/connections", token);
      setProfile(profileData);
      setConnections(connectionsData);
      if (connectionsData.length) {
        const results = await Promise.all(
          connectionsData.map((c) =>
            api
              .get(`/forecast/${c._id}`, token)
              .then((f) => ({ id: c._id, data: f })),
          ),
        );
        const map = {};
        results.forEach(({ id, data }) => {
          map[id] = data;
        });
        setForecasts(map);
      }
    } catch (err) {
      console.log('Dashboard error:', err.message);
      // If profile not found, redirect to onboarding
      if (err.message.includes("profile") || err.message.includes("404") || err.message.includes("No profile")) {
        setLoading(false);
        navigate("/onboarding", { replace: true });
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleConnectionAdded() {
    setModalOpen(false);
    await loadDashboard();
  }
  async function handleDeleteConnection(connectionId) {
    try {
      await api.delete(`/connections/${connectionId}`, token);
      setConnections((prev) => prev.filter((c) => c._id !== connectionId));
      setForecasts((prev) => {
        const next = { ...prev };
        delete next[connectionId];
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading)
    return <LoadingPage>{SYMBOLS.earth} Loading your profile...</LoadingPage>;
  if (error) return <LoadingPage>Something went wrong: {error}</LoadingPage>;

  return (
    <Page>
      <TopBar>
        <Logo to="/">{SYMBOLS.earth} geoSync</Logo>
        <TopBarRight>
          <ScienceLink to="/science">The Science</ScienceLink>
          <UserName>{user?.name}</UserName>
          <LogoutButton onClick={logout}>Sign out</LogoutButton>
        </TopBarRight>
      </TopBar>
      <Content>
        {profile && (
          <ProfileSummary
            profile={profile}
            token={token}
            onProfileUpdated={setProfile}
          />
        )}
        <NudgesFeed token={token} />
        <SectionHeader>
          <SectionTitle>Your Connections</SectionTitle>
          <AddButton onClick={() => setModalOpen(true)}>+ Add</AddButton>
        </SectionHeader>
        {connections.length === 0 ? (
          <EmptyState>
            <EmptyGlyph>{SYMBOLS.star}</EmptyGlyph>
            <EmptyText>No connections yet.</EmptyText>
            <EmptySubtext>
              Add someone to generate a compatibility report and seasonal
              forecast.
            </EmptySubtext>
            <AddButton onClick={() => setModalOpen(true)}>
              Add your first connection
            </AddButton>
          </EmptyState>
        ) : (
          <ConnectionsList
            connections={connections}
            forecasts={forecasts}
            onDelete={handleDeleteConnection}
            token={token}
          />
        )}
        <ScienceFooter>
          <Link to="/science">The science behind geoSync {SYMBOLS.star}</Link>
        </ScienceFooter>
      </Content>
      {modalOpen && (
        <AddConnectionModal
          token={token}
          onAdded={handleConnectionAdded}
          onClose={() => setModalOpen(false)}
        />
      )}
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing["2xl"]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`;
const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.accent};
  &:hover {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;
const ScienceLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.05em;
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;
const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  @media (max-width: 480px) {
    display: none;
  }
`;
const LogoutButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  min-height: unset;
  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xl"]};
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const AddButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accentDim};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing["2xl"]}
      ${({ theme }) => theme.spacing.lg};
  }
`;
const EmptyGlyph = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accentDim};
`;
const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const EmptySubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 300px;
`;
const LoadingPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;
const ScienceFooter = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  a {
    color: ${({ theme }) => theme.colors.textMuted};
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;
