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

// Define workflow-specific sample prompts and AI-style responses
const workflowPrompts: Record<string, { prompts: { text: string; highlighted: string }[]; responses: Record<string, string> }> = {
  'password-reset': {
    prompts: [
      { text: "How do I reset my Azure AD password?", highlighted: "reset my Azure AD password" },
      { text: "My password expired, what should I do?", highlighted: "password expired" },
      { text: "How do I change my password?", highlighted: "change my password" },
    ],
    responses: {
      "How do I reset my Azure AD password?":
        "Of course! To reset your Azure AD password, please follow these steps:\n1. Go to the official Azure AD password reset portal.\n2. Enter your user ID (usually your email address).\n3. Follow the on-screen instructions to verify your identity and set a new password.\nIf you run into any issues, such as not receiving a verification code, let me know and I can help troubleshoot. Would you like a direct link to the portal or more detailed guidance?",
      "My password expired, what should I do?":
        "No worries! If your password has expired, you can reset it using the self-service password reset portal.\nJust visit the portal, enter your user ID, and follow the prompts to verify your identity. If you need help with any step, or if you're unable to reset your password, let me know and I'll walk you through it.",
      "How do I change my password?":
        "Changing your password is easy! You can do it from your account settings or, if you're on a Windows device, by pressing Ctrl+Alt+Del and selecting 'Change a password.'\nWould you like step-by-step instructions for your device or operating system?",
    }
  },
  'account-unlock': {
    prompts: [
      { text: "How do I unlock my Azure AD account?", highlighted: "unlock my Azure AD account" },
      { text: "I'm locked out, can you help?", highlighted: "locked out" },
    ],
    responses: {
      "How do I unlock my Azure AD account?":
        "I can help you unlock your Azure AD account!\n1. Go to the Azure AD account unlock portal.\n2. Enter your user ID and follow the instructions to verify your identity.\n3. Once verified, you'll be able to unlock your account and regain access.\nIf you need a direct link or run into any issues, just let me know!",
      "I'm locked out, can you help?":
        "I'm here to help! If you're locked out, you can use the self-service unlock option or contact your IT administrator.\nWould you like to try unlocking your account yourself, or do you need help contacting support?",
    }
  },
  'software-access': {
    prompts: [
      { text: "How do I request access to Microsoft Teams?", highlighted: "request access to Microsoft Teams" },
      { text: "Can I get access to Power BI?", highlighted: "access to Power BI" },
    ],
    responses: {
      "How do I request access to Microsoft Teams?":
        "To request access to Microsoft Teams, you can usually submit a request through your organization's software portal or contact your IT department.\nWould you like me to guide you through the request process or provide a direct link to the portal?",
      "Can I get access to Power BI?":
        "Absolutely! Access to Power BI is typically managed by your IT team.\nYou can request access via the application catalog or by submitting a ticket.\nLet me know if you'd like step-by-step instructions or help with the request form.",
    }
  },
  'group-management': {
    prompts: [
      { text: "How do I add a user to a group?", highlighted: "add a user to a group" },
      { text: "How can I see all members of a group?", highlighted: "see all members of a group" },
    ],
    responses: {
      "How do I add a user to a group?":
        "To add a user to a group in Azure AD:\n1. Go to Azure AD > Groups.\n2. Select the group you want to manage.\n3. Click on 'Members' and then 'Add members.'\n4. Search for the user and add them.\nWould you like screenshots or a video guide?",
      "How can I see all members of a group?":
        "You can view all members by navigating to the group in Azure AD and selecting the 'Members' tab.\nIf you need a list exported or filtered by role, let me know!",
    }
  },
  'user-provisioning': {
    prompts: [
      { text: "How do I create a new user in Azure AD?", highlighted: "create a new user" },
      { text: "How do I assign a role to a user?", highlighted: "assign a role to a user" },
    ],
    responses: {
      "How do I create a new user in Azure AD?":
        "To create a new user:\n1. Go to Azure AD > Users > New user.\n2. Fill in the required details (name, username, etc.).\n3. Assign roles or groups as needed.\nWould you like a detailed walkthrough or help with bulk user creation?",
      "How do I assign a role to a user?":
        "Assigning a role is simple:\n1. Select the user in Azure AD.\n2. Go to 'Assigned roles' and click 'Add assignment.'\n3. Choose the appropriate role and confirm.\nLet me know if you need a list of available roles or best practices for role assignment!",
    }
  },
  'app-registration': {
    prompts: [
      { text: "How do I register a new app in Azure AD?", highlighted: "register a new app" },
      { text: "How do I configure permissions for an app?", highlighted: "configure permissions for an app" },
    ],
    responses: {
      "How do I register a new app in Azure AD?":
        "To register a new app:\n1. Go to Azure AD > App registrations > New registration.\n2. Enter the app name and redirect URI.\n3. Click 'Register' and configure settings as needed.\nWould you like help with authentication setup or API permissions?",
      "How do I configure permissions for an app?":
        "You can configure permissions by:\n1. Selecting the app registration.\n2. Navigating to 'API permissions.'\n3. Adding the required permissions and granting admin consent if needed.\nLet me know if you need help with specific APIs or permission types!",
    }
  },
  'audit-logs': {
    prompts: [
      { text: "How do I view Azure AD audit logs?", highlighted: "view Azure AD audit logs" },
      { text: "Can I export audit logs?", highlighted: "export audit logs" },
    ],
    responses: {
      "How do I view Azure AD audit logs?":
        "To view audit logs:\n1. Go to Azure AD > Audit logs.\n2. Use the filters to find specific events or users.\n3. Click on any log entry for more details.\nIf you need help interpreting the logs or troubleshooting an event, just ask!",
      "Can I export audit logs?":
        "Yes, you can export audit logs to CSV directly from the Azure portal's Audit logs section.\nWould you like step-by-step export instructions or help with log analysis?",
    }
  },
  'help-support': {
    prompts: [
      { text: "How do I contact support?", highlighted: "contact support" },
      { text: "Where can I find Azure AD documentation?", highlighted: "Azure AD documentation" },
    ],
    responses: {
      "How do I contact support?":
        "You can contact support by submitting a ticket through your organization's help portal or by calling the IT helpdesk.\nIf you need urgent assistance, let me know and I can provide escalation steps or direct contact info.",
      "Where can I find Azure AD documentation?":
        "You can find official Azure AD documentation on the Microsoft Docs website.\nWould you like a direct link or help finding documentation for a specific feature?",
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