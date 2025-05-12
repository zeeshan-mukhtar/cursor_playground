import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse } from '@mui/material';
import { LockReset, Help, SmartToy, Security, ExpandMore, ExpandLess } from '@mui/icons-material';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';
import UnlockAccount from '../components/UnlockAccount';
import RequestSoftware from '../components/RequestSoftware';
import GroupManagement from '../components/GroupManagement';
import UserProvisioning from '../components/UserProvisioning';
import AppRegistration from '../components/AppRegistration';
import AuditLogs from '../components/AuditLogs';
import GetHelp from '../components/GetHelp';

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

const workflowInfoCards: Record<string, JSX.Element> = {
  'password-reset': (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: `1px solid ${BRAND_COLORS.primary}15`, mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Reset Password
      </Typography>
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
  ),
  'account-unlock': <UnlockAccount />,
  'software-access': <RequestSoftware />,
  'group-management': <GroupManagement />,
  'user-provisioning': <UserProvisioning />,
  'app-registration': <AppRegistration />,
  'audit-logs': <AuditLogs />,
  'help-support': <GetHelp />,
};

// Define workflow-specific sample prompts and responses
const workflowPrompts: Record<string, { prompts: { text: string; highlighted: string }[]; responses: Record<string, string> }> = {
  'password-reset': {
    prompts: [
      { text: "How do I reset my Azure AD password?", highlighted: "reset my Azure AD password" },
      { text: "My password expired, what should I do?", highlighted: "password expired" },
      { text: "How do I change my password?", highlighted: "change my password" },
    ],
    responses: {
      "How do I reset my Azure AD password?": "To reset your Azure AD password, go to the password reset portal and follow the instructions. If you need a direct link, let me know!",
      "My password expired, what should I do?": "If your password expired, you can reset it using the self-service password reset portal. Would you like step-by-step instructions?",
      "How do I change my password?": "You can change your password from your account settings or by using the Ctrl+Alt+Del shortcut on a Windows machine.",
    }
  },
  'account-unlock': {
    prompts: [
      { text: "How do I unlock my Azure AD account?", highlighted: "unlock my Azure AD account" },
      { text: "I'm locked out, can you help?", highlighted: "locked out" },
    ],
    responses: {
      "How do I unlock my Azure AD account?": "To unlock your Azure AD account, visit the unlock portal or use the self-service option. Would you like a direct link?",
      "I'm locked out, can you help?": "If you're locked out, you can unlock your account using the self-service portal or by contacting your admin.",
    }
  },
  'software-access': {
    prompts: [
      { text: "How do I request access to Microsoft Teams?", highlighted: "request access to Microsoft Teams" },
      { text: "Can I get access to Power BI?", highlighted: "access to Power BI" },
    ],
    responses: {
      "How do I request access to Microsoft Teams?": "To request access to Microsoft Teams, please fill out the software request form or contact your IT admin.",
      "Can I get access to Power BI?": "You can request access to Power BI through the application catalog or by submitting a request to your IT department.",
    }
  },
  'group-management': {
    prompts: [
      { text: "How do I add a user to a group?", highlighted: "add a user to a group" },
      { text: "How can I see all members of a group?", highlighted: "see all members of a group" },
    ],
    responses: {
      "How do I add a user to a group?": "To add a user to a group, go to Azure AD Groups, select the group, and add the user under Members.",
      "How can I see all members of a group?": "You can view all group members by navigating to the group in Azure AD and selecting the Members tab.",
    }
  },
  'user-provisioning': {
    prompts: [
      { text: "How do I create a new user in Azure AD?", highlighted: "create a new user" },
      { text: "How do I assign a role to a user?", highlighted: "assign a role to a user" },
    ],
    responses: {
      "How do I create a new user in Azure AD?": "To create a new user, go to Azure AD > Users > New user, and fill in the required details.",
      "How do I assign a role to a user?": "Assign a role by selecting the user in Azure AD, then choosing Roles and adding the appropriate role.",
    }
  },
  'app-registration': {
    prompts: [
      { text: "How do I register a new app in Azure AD?", highlighted: "register a new app" },
      { text: "How do I configure permissions for an app?", highlighted: "configure permissions for an app" },
    ],
    responses: {
      "How do I register a new app in Azure AD?": "Go to Azure AD > App registrations > New registration, and follow the prompts to register your app.",
      "How do I configure permissions for an app?": "Configure app permissions by selecting the app registration and navigating to API permissions.",
    }
  },
  'audit-logs': {
    prompts: [
      { text: "How do I view Azure AD audit logs?", highlighted: "view Azure AD audit logs" },
      { text: "Can I export audit logs?", highlighted: "export audit logs" },
    ],
    responses: {
      "How do I view Azure AD audit logs?": "To view audit logs, go to Azure AD > Audit logs. You can filter and search logs as needed.",
      "Can I export audit logs?": "Yes, you can export audit logs to CSV from the Azure portal's Audit logs section.",
    }
  },
  'help-support': {
    prompts: [
      { text: "How do I contact support?", highlighted: "contact support" },
      { text: "Where can I find Azure AD documentation?", highlighted: "Azure AD documentation" },
    ],
    responses: {
      "How do I contact support?": "You can contact support by submitting a ticket through the help portal or calling the IT helpdesk.",
      "Where can I find Azure AD documentation?": "Official Azure AD documentation is available on the Microsoft Docs website.",
    }
  },
};

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('password-reset');
  const [chatStates, setChatStates] = useState<Record<string, { messages: any[]; input: string; isLoading: boolean }>>({});
  const prevWorkflow = useRef(selectedWorkflow);
  const [showInfo, setShowInfo] = useState(false); // collapsed by default

  // Ensure state exists for the selected workflow
  useEffect(() => {
    setChatStates((prev) => {
      if (!prev[selectedWorkflow]) {
        return { ...prev, [selectedWorkflow]: { messages: [], input: '', isLoading: false } };
      }
      return prev;
    });
  }, [selectedWorkflow]);

  // Reset input and isLoading on workflow change
  useEffect(() => {
    if (prevWorkflow.current !== selectedWorkflow) {
      setChatStates((prev) => ({
        ...prev,
        [selectedWorkflow]: {
          messages: prev[selectedWorkflow]?.messages || [],
          input: '',
          isLoading: false,
        },
      }));
      prevWorkflow.current = selectedWorkflow;
    }
  }, [selectedWorkflow]);

  // Collapse info card on workflow change
  useEffect(() => {
    setShowInfo(false);
  }, [selectedWorkflow]);

  const setMessages = (messages: any[]) => {
    setChatStates((prev) => ({
      ...prev,
      [selectedWorkflow]: {
        ...prev[selectedWorkflow],
        messages,
      },
    }));
  };
  const setInput = (input: string) => {
    setChatStates((prev) => ({
      ...prev,
      [selectedWorkflow]: {
        ...prev[selectedWorkflow],
        input,
      },
    }));
  };
  const setIsLoading = (isLoading: boolean) => {
    setChatStates((prev) => ({
      ...prev,
      [selectedWorkflow]: {
        ...prev[selectedWorkflow],
        isLoading,
      },
    }));
  };

  const promptsAndResponses = workflowPrompts[selectedWorkflow] || { prompts: [], responses: {} };

  const chatState = chatStates[selectedWorkflow] || { messages: [], input: '', isLoading: false };

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
          {/* Toggleable Info Card for all workflows */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: BRAND_COLORS.text.primary, mr: 1 }}>
                {selectedWorkflow.charAt(0).toUpperCase() + selectedWorkflow.slice(1)}
              </Typography>
              <IconButton onClick={() => setShowInfo((prev) => !prev)} size="small" sx={{ ml: 0.5 }}>
                {showInfo ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <Typography variant="body2" sx={{ color: BRAND_COLORS.text.secondary, ml: 1, cursor: 'pointer' }} onClick={() => setShowInfo((prev) => !prev)}>
                {showInfo ? 'Hide details' : 'Show details'}
              </Typography>
            </Box>
            <Collapse in={showInfo} timeout="auto" unmountOnExit>
              {workflowInfoCards[selectedWorkflow]}
            </Collapse>
          </Box>
          {/* Chat area is always full width */}
          <Box>
            <ChatInterface
              samplePrompts={promptsAndResponses.prompts}
              responses={promptsAndResponses.responses}
              messages={chatState.messages}
              input={chatState.input}
              setMessages={setMessages}
              setInput={setInput}
              isLoading={chatState.isLoading}
              setIsLoading={setIsLoading}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 