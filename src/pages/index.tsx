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

// Info card content for each workflow
const workflowInfoContent: Record<string, { heading: string; description: string; bullets: string[] }> = {
  'password-reset': {
    heading: '✨ Try it yourself!',
    description: "Imagine that your Azure AD password is about to expire. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Receive password expiry notification',
      'Ask for password reset',
    ],
  },
  'account-unlock': {
    heading: '🔓 Try it yourself!',
    description: "Suppose you're locked out of your Azure AD account. Here's how RC Agentic AI Playground can help:",
    bullets: [
      'Unlock your Azure AD account',
      'Get step-by-step recovery guidance',
    ],
  },
  'software-access': {
    heading: '💻 Try it yourself!',
    description: "Need access to a new application? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Request access to Microsoft Teams, Power BI, and more',
      'Track your software access requests',
    ],
  },
  'group-management': {
    heading: '👥 Try it yourself!',
    description: "Imagine you need to manage Azure AD groups. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Add or remove users from groups',
      'View and export group membership',
    ],
  },
  'user-provisioning': {
    heading: '🧑‍💼 Try it yourself!',
    description: "Suppose you need to onboard a new team member. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Create new Azure AD users',
      'Assign roles and permissions',
    ],
  },
  'app-registration': {
    heading: '🛠️ Try it yourself!',
    description: "Want to register a new app in Azure AD? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Register new applications',
      'Configure app permissions and authentication',
    ],
  },
  'audit-logs': {
    heading: '📊 Try it yourself!',
    description: "Need to review Azure AD activity? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'View and filter audit logs',
      'Export logs for analysis',
    ],
  },
  'help-support': {
    heading: '❓ Try it yourself!',
    description: "Looking for help or documentation? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Contact support or IT helpdesk',
      'Access Azure AD documentation',
    ],
  },
  'leave-request': {
    heading: '🗓️ Try it yourself!',
    description: "Imagine you need to take a day off. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Submit a leave request',
      'Check your leave balance',
      'Track approval status',
    ],
  },
  'payslip-download': {
    heading: '💵 Try it yourself!',
    description: "Suppose you want to access your latest payslip. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Download your latest payslip',
      'View payslip history',
      'Get help understanding your payslip',
    ],
  },
  'update-personal-info': {
    heading: '📝 Try it yourself!',
    description: "Need to update your contact details? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Update address, phone, or emergency contact',
      'Change bank account details',
      'Review your personal information',
    ],
  },
  'hr-helpdesk': {
    heading: '🙋 Try it yourself!',
    description: "Have an HR question or issue? Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Contact HR support',
      'Submit an HR query or ticket',
      'Browse HR FAQs and policies',
    ],
  },
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
  'leave-request': {
    prompts: [
      { text: "How do I apply for leave?", highlighted: "apply for leave" },
      { text: "Can I check my leave balance?", highlighted: "leave balance" },
      { text: "How do I track my leave approval?", highlighted: "track my leave approval" },
    ],
    responses: {
      "How do I apply for leave?":
        "Absolutely! To apply for leave, go to the Leave Request section, select your leave type and dates, and submit your request.\nWould you like a step-by-step guide or a direct link to the leave form?",
      "Can I check my leave balance?":
        "Yes, you can check your leave balance in your HR portal under 'Leave Balance' or 'My Profile.'\nLet me know if you need help finding this section or understanding your balance.",
      "How do I track my leave approval?":
        "You can track your leave approval status in the Leave Request history or notifications area.\nWould you like to receive updates or reminders about your leave requests?",
    }
  },
  'payslip-download': {
    prompts: [
      { text: "How do I download my latest payslip?", highlighted: "download my latest payslip" },
      { text: "Can I view my payslip history?", highlighted: "payslip history" },
      { text: "What if I can't open my payslip?", highlighted: "can't open my payslip" },
    ],
    responses: {
      "How do I download my latest payslip?":
        "To download your latest payslip, go to the Payslip section in your HR portal and click on the most recent payslip.\nWould you like a direct link or help with the download process?",
      "Can I view my payslip history?":
        "Yes, you can view your payslip history in the same section.\nYou'll see a list of all your previous payslips, which you can download or print as needed.",
      "What if I can't open my payslip?":
        "If you're having trouble opening your payslip, make sure you have a PDF reader installed.\nIf the issue persists, let me know and I can help troubleshoot or connect you with HR support.",
    }
  },
  'update-personal-info': {
    prompts: [
      { text: "How do I update my address?", highlighted: "update my address" },
      { text: "Can I change my bank account details?", highlighted: "change my bank account details" },
      { text: "How do I review my personal info?", highlighted: "review my personal info" },
    ],
    responses: {
      "How do I update my address?":
        "To update your address, go to the Personal Info section in your HR portal and edit your address details.\nWould you like a step-by-step guide or help with submitting the change?",
      "Can I change my bank account details?":
        "Yes, you can change your bank account details in the Payroll or Personal Info section.\nLet me know if you need help finding the right form or want to know about approval timelines.",
      "How do I review my personal info?":
        "You can review all your personal information in the HR portal under 'My Profile' or 'Personal Info.'\nWould you like to check for any outdated details or get a summary of your current info?",
    }
  },
  'hr-helpdesk': {
    prompts: [
      { text: "How do I contact HR support?", highlighted: "contact HR support" },
      { text: "Can I submit an HR query?", highlighted: "submit an HR query" },
      { text: "Where can I find HR policies?", highlighted: "find HR policies" },
    ],
    responses: {
      "How do I contact HR support?":
        "You can contact HR support by submitting a ticket in the HR Helpdesk section or by calling the HR helpline.\nWould you like a direct link or the contact number?",
      "Can I submit an HR query?":
        "Yes, you can submit any HR-related query through the HR Helpdesk.\nJust fill out the query form and HR will get back to you as soon as possible.",
      "Where can I find HR policies?":
        "HR policies are available in the HR portal under 'Policies' or 'Resources.'\nLet me know if you need a specific policy or a summary of the most important ones.",
    }
  },
};

// Get heading for toggle button and card
const workflowHeadings: Record<string, string> = {
  'password-reset': 'Reset Password',
  'account-unlock': 'Unlock Account',
  'software-access': 'Request Software',
  'group-management': 'Group Management',
  'user-provisioning': 'User Provisioning',
  'app-registration': 'App Registration',
  'audit-logs': 'Audit Logs',
  'help-support': 'Get Help',
  'leave-request': 'Leave Request',
  'payslip-download': 'Payslip Download',
  'update-personal-info': 'Update Personal Info',
  'hr-helpdesk': 'HR Helpdesk',
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
          {/* Toggleable Info Card for all workflows */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: BRAND_COLORS.text.primary, mr: 1 }}>
                {workflowHeadings[selectedWorkflow]}
              </Typography>
              <IconButton onClick={() => setShowInfo((prev) => !prev)} size="small" sx={{ ml: 0.5 }}>
                {showInfo ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <Typography variant="body2" sx={{ color: BRAND_COLORS.text.secondary, ml: 1, cursor: 'pointer' }} onClick={() => setShowInfo((prev) => !prev)}>
                {showInfo ? 'Hide details' : 'Show details'}
              </Typography>
            </Box>
            <Collapse in={showInfo} timeout="auto" unmountOnExit>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(90deg, #f5f7fb 60%, #e8eafd 100%)', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                  {workflowInfoContent[selectedWorkflow]?.heading}
                </Typography>
                <Typography variant="body1" sx={{ color: BRAND_COLORS.text.secondary, mb: 2 }}>
                  {workflowInfoContent[selectedWorkflow]?.description}
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 24 }}>
                  {workflowInfoContent[selectedWorkflow]?.bullets.map((item, idx) => (
                    <li key={idx} style={{ color: BRAND_COLORS.text.primary, marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              </Paper>
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