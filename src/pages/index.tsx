import { useState } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse } from '@mui/material';
import { LockReset, Help, SmartToy, Security, ExpandMore, ExpandLess } from '@mui/icons-material';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';

// Royal iTech brand colors
const BRAND_COLORS = {
  primary: '#002366', // Royal blue
  secondary: '#7851a9', // Purple
  accent: '#f2c52e', // Gold
  text: {
    primary: '#2a3535',
    secondary: '#64748B'
  },
  background: {
    light: '#f8f9fa',
    white: '#ffffff'
  }
};

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('password-reset');
  const [showInfo, setShowInfo] = useState(true);

  const samplePrompts = [
    {
      text: "My Azure AD password is about to expire. Can you help with resetting it?",
      highlighted: "about to expire"
    },
    {
      text: "I'm locked out of my Azure account. How can I regain access?",
      highlighted: "locked out"
    },
    {
      text: "Need to enable Multi-Factor Authentication for my Azure AD account",
      highlighted: "Multi-Factor Authentication"
    },
    {
      text: "How do I update my Azure AD security questions?",
      highlighted: "security questions"
    },
    {
      text: "Can't sign in to Microsoft 365 with my Azure AD credentials",
      highlighted: "can't sign in"
    },
    {
      text: "Need to sync my on-premise password with Azure AD",
      highlighted: "sync"
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BRAND_COLORS.background.light }}>
      <Sidebar selectedWorkflow={selectedWorkflow} setSelectedWorkflow={setSelectedWorkflow} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, pt: 2 }}>
            <SmartToy sx={{ fontSize: 40, color: BRAND_COLORS.primary }} />
            <Typography variant="h4" sx={{ fontWeight: 600, background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Agentic Assistant
            </Typography>
          </Box>

          {/* Toggleable Info Card */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: BRAND_COLORS.text.primary, mr: 1 }}>
                Azure AD Assistant
              </Typography>
              <IconButton onClick={() => setShowInfo((prev) => !prev)} size="small" sx={{ ml: 0.5 }}>
                {showInfo ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <Typography variant="body2" sx={{ color: BRAND_COLORS.text.secondary, ml: 1, cursor: 'pointer' }} onClick={() => setShowInfo((prev) => !prev)}>
                {showInfo ? 'Hide details' : 'Show details'}
              </Typography>
            </Box>
            <Collapse in={showInfo} timeout="auto" unmountOnExit>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: `1px solid ${BRAND_COLORS.primary}15`, mb: 2 }}>
                <Typography variant="body1" paragraph sx={{ color: BRAND_COLORS.text.secondary, mb: 3 }}>
                  Having issues with your Azure Active Directory account? I'm here to help you with password management, security settings, and account access.
                </Typography>
                <List sx={{ '& .MuiListItem-root': { px: 2, py: 1.5 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <LockReset sx={{ color: BRAND_COLORS.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password Management"
                      secondary="Reset, update, or sync your Azure AD password"
                      primaryTypographyProps={{ fontWeight: 500, color: BRAND_COLORS.text.primary }}
                      secondaryTypographyProps={{ color: BRAND_COLORS.text.secondary }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Help sx={{ color: BRAND_COLORS.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Security"
                      secondary="MFA setup, security questions, and account recovery"
                      primaryTypographyProps={{ fontWeight: 500, color: BRAND_COLORS.text.primary }}
                      secondaryTypographyProps={{ color: BRAND_COLORS.text.secondary }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Collapse>
          </Box>

          {/* Chat area is always full width */}
          <Box>
            <ChatInterface samplePrompts={samplePrompts} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 