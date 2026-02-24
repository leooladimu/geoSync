import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { SYMBOLS, bp } from "../theme/theme";
import { api } from "../utils/api";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import ConnectionsList from "../components/dashboard/ConnectionsList";
import NudgesFeed from "../components/dashboard/NudgesFeed";
import AddConnectionModal from "../components/dashboard/AddConnectionModal";

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.bg};
  color: ${(props) => props.theme.colors.textPrimary};
`;

const Header = styled.header`
  background-color: ${(props) => props.theme.colors.bgCard};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.lg}
      ${(props) => props.theme.spacing["2xl"]};
  }
`;

const Logo = styled(Link)`
  font-family: ${(props) => props.theme.fonts.display};
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.accent};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.accentLight};
  }

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.xl};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const UserName = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSizes.xs};
  display: none;

  @media (min-width: ${bp.sm}) {
    display: inline;
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

const LogoutButton = styled.button`
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  background-color: transparent;
  color: ${(props) => props.theme.colors.textMuted};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.xs};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.sm}
      ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.danger};
    color: ${(props) => props.theme.colors.danger};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const NavLink = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSizes.xs};
  cursor: pointer;
  transition: color ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing["2xl"]};
    gap: ${(props) => props.theme.spacing["2xl"]};
  }
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const WelcomeTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.xl};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: ${(props) => props.theme.spacing.sm};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes["3xl"]};
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.textSecondary};

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.lg};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};

  @media (min-width: ${bp.md}) {
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) => props.theme.colors.textPrimary};
  margin: 0;

  @media (min-width: ${bp.md}) {
    font-size: ${(props) => props.theme.fontSizes.xl};
  }
`;

const AddButton = styled.button`
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.bg};
  border: none;
  border-radius: ${(props) => props.theme.radius.md};
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};

  @media (min-width: ${bp.md}) {
    padding: ${(props) => props.theme.spacing.sm}
      ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.accentLight};
  }
`;

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [connectionsKey, setConnectionsKey] = useState(0);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.get("/profile/me", token);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (err.status === 404) {
          navigate("/onboarding");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          {SYMBOLS.earth} Loading...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Logo to="/dashboard">{SYMBOLS.earth} geoSync</Logo>
        <Nav>
          <NavLink onClick={() => navigate("/science")}>The Science</NavLink>
          <UserSection>
            <UserName>Welcome, {user?.name}</UserName>
            <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
          </UserSection>
        </Nav>
      </Header>

      <Main>
        <WelcomeSection>
          <WelcomeTitle>Your Compatibility Dashboard</WelcomeTitle>
          <WelcomeSubtitle>
            Understand your patterns and navigate your relationships with
            biophysical insight
          </WelcomeSubtitle>
        </WelcomeSection>

        {profile && (
          <ProfileSummary
            profile={profile}
            token={token}
            onProfileUpdated={setProfile}
          />
        )}
        <NudgesFeed token={token} />

        <Section>
          <SectionHeader>
            <SectionTitle>Connections</SectionTitle>
            <AddButton onClick={() => setShowAddModal(true)}>
              {SYMBOLS.star} Add Connection
            </AddButton>
          </SectionHeader>
          <ConnectionsList key={connectionsKey} token={token} />
        </Section>

        {showAddModal && (
          <AddConnectionModal
            token={token}
            onAdded={() => {
              setConnectionsKey((k) => k + 1);
              setShowAddModal(false);
            }}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </Main>
    </DashboardContainer>
  );
}
