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
  'resource-onboarding': {
    heading: '🚀 Try it yourself!',
    description: "Suppose you need to onboard a new employee or contractor. Here's what you can do with RC Agentic AI Playground:",
    bullets: [
      'Initiate onboarding for a new resource',
      'Track onboarding progress and tasks',
      'Get a checklist of required documents',
      'Send welcome emails and assign a buddy',
    ],
  },
  'travel-request': {
    heading: '✈️ Try it yourself!',
    description: "Need to raise a travel request? Here's what you can do with AI Playground:",
    bullets: [
      'Raise a travel request via Zoho People',
      'AI validates completeness and requests missing documents',
      'AI checks available flight options and highlights best fares',
    ],
  },
  'visa-processing': {
    heading: '🛂 Try it yourself!',
    description: "Need help with visa processing? Here's what you can do:",
    bullets: [
      'AI validates checklist for visa initiation',
      'Notifies employee if incomplete',
      'Initiates visa process if required',
    ],
  },
  'travel-booking': {
    heading: '🏨 Try it yourself!',
    description: "Want to book flights, hotels, or cars? Here's what you can do:",
    bullets: [
      'AI fetches and highlights best flight/hotel/car options',
      'Shares compiled itinerary with employee',
      'Checks out bookings via payment gateway',
    ],
  },
  'travel-approval': {
    heading: '✅ Try it yourself!',
    description: "Need travel approval? Here's what you can do:",
    bullets: [
      'AI triggers L1/L2 manager approval with real-time fare details',
      'Auto-approves if not received in 3 hours',
      'Shares final itinerary and confirmation',
    ],
  },
  'travel-expenses': {
    heading: '💳 Try it yourself!',
    description: "Want to log or review travel expenses? Here's what you can do:",
    bullets: [
      'Logs all final expenses in travel request form',
      'Pays for bookings using credit card',
      'View and export travel expense reports',
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
        "**1.** I see you want to reset your Azure AD password. Let me check your account status and prepare the reset process...\n\n---\n\n" +
        "**2.** For security, I need to confirm your identity and ensure your account is eligible for a password reset. This helps protect your information.\n\n---\n\n" +
        "**3.** Please confirm your username and whether you have access to your recovery email or phone. Once confirmed, I'll send you a password reset link.\n\n" +
        "- **User:** John Doe (john.doe@example.com)\n" +
        "- **Application:** Azure AD\n" +
        "- **Reset Portal:** https://portal.example.com/password-reset\n\n" +
        "👉 **Please confirm** if these details are correct, or let me know if you'd like to edit your request.\n\n" +
        "[Send reset link] [Edit details] [Cancel]",
      "My password expired, what should I do?":
        "**1.** Your password has expired. I'll check your account and guide you through the reset process...\n\n---\n\n" +
        "**2.** Resetting an expired password requires identity verification. This ensures only you can update your credentials.\n\n---\n\n" +
        "**3.** Please confirm your username and recovery contact. I'll send a reset link once confirmed.\n\n" +
        "- **User:** John Doe (john.doe@example.com)\n" +
        "- **Application:** Azure AD\n" +
        "- **Reset Portal:** https://portal.example.com/password-reset\n\n" +
        "[Send reset link] [Edit details] [Cancel]",
      "How do I change my password?":
        "**1.** You'd like to change your password. Let me check your current status and available options...\n\n---\n\n" +
        "**2.** Changing your password regularly helps keep your account secure. I'll guide you through the process for your device or platform.\n\n---\n\n" +
        "**3.** Would you like to change your password via the Azure portal, Windows device, or another method?\n\n" +
        "- **User:** John Doe (john.doe@example.com)\n" +
        "- **Portal:** https://portal.example.com/account\n\n" +
        "[Change via Azure portal] [Change on Windows] [Other method] [Cancel]",
    }
  },
  'account-unlock': {
    prompts: [
      { text: "How do I unlock my Azure AD account?", highlighted: "unlock my Azure AD account" },
      { text: "I'm locked out, can you help?", highlighted: "locked out" },
    ],
    responses: {
      "How do I unlock my Azure AD account?":
        "**1.** I see your account is locked. Let me check the reason and available unlock options...\n\n---\n\n" +
        "**2.** Account locks can happen due to multiple failed sign-ins or security policies. I'll verify your identity before proceeding.\n\n---\n\n" +
        "**3.** Please confirm your username and if you have access to your recovery contact.\n\n" +
        "- **User:** John Doe (john.doe@example.com)\n\n" +
        "👉 **Please confirm** to proceed with unlocking your account, or edit/cancel the request.\n\n" +
        "[Unlock account] [Edit details] [Cancel]",
      "I'm locked out, can you help?":
        "**1.** You're locked out of your account. I'll check your account status and recovery options...\n\n---\n\n" +
        "**2.** To unlock your account, I need to verify your identity and check for any security holds.\n\n---\n\n" +
        "**3.** Please confirm your details to proceed.\n\n" +
        "- **User:** John Doe (john.doe@example.com)\n\n" +
        "[Unlock account] [Contact support] [Cancel]",
    }
  },
  'software-access': {
    prompts: [
      { text: "How do I request access to Microsoft Teams?", highlighted: "request access to Microsoft Teams" },
      { text: "Can I get access to Power BI?", highlighted: "access to Power BI" },
      { text: "Can you give me access to Zoom?", highlighted: "access to Zoom" },
    ],
    responses: {
      "How do I request access to Microsoft Teams?":
        "**1.** You'd like access to Microsoft Teams. I'll check your current permissions and prepare a request...\n\n---\n\n" +
        "**2.** I need to confirm you don't already have access and gather your user details for the request.\n\n---\n\n" +
        "**3.** Please confirm the following details to proceed:\n\n" +
        "- **App:** Microsoft Teams\n" +
        "- **User:** John Doe (john.doe@example.com)\n\n" +
        "👉 **Please confirm** if these details are correct, or edit/cancel the request.\n\n" +
        "[Request access] [Edit details] [Cancel]",
      "Can I get access to Power BI?":
        "**1.** You're requesting access to Power BI. Let me check your current access and prepare a request...\n\n---\n\n" +
        "**2.** I'll confirm your user details and ensure you meet the requirements for Power BI access.\n\n---\n\n" +
        "**3.** Please confirm the following details to proceed:\n\n" +
        "- **App:** Power BI\n" +
        "- **User:** John Doe (john.doe@example.com)\n\n" +
        "[Request access] [Edit details] [Cancel]",
      "Can you give me access to Zoom?":
        "**1.** You're requesting access to Zoom. I'll check your current access and prepare a request...\n\n---\n\n" +
        "**2.** I'll confirm your user details and ensure you meet the requirements for Zoom access.\n\n---\n\n" +
        "**3.** Please confirm the following details to proceed:\n\n" +
        "- **App:** Zoom\n" +
        "- **User:** John Doe (john.doe@example.com)\n\n" +
        "[Request access] [Edit details] [Cancel]",
    }
  },
  'group-management': {
    prompts: [
      { text: "How do I add a user to a group?", highlighted: "add a user to a group" },
      { text: "How can I see all members of a group?", highlighted: "see all members of a group" },
      { text: "Am I part of the product group?", highlighted: "part of the product group" },
    ],
    responses: {
      "How do I add a user to a group?":
        "**1.** You want to add a user to a group. Let me check your permissions and available groups...\n\n---\n\n" +
        "**2.** Only group owners or admins can add members. I'll verify your access and prepare the add-member form.\n\n---\n\n" +
        "**3.** Please specify the group and user to add, or choose from your managed groups.\n\n" +
        "[Add user] [Select group] [Cancel]",
      "How can I see all members of a group?":
        "**1.** You want to view group members. I'll fetch the list for your selected group...\n\n---\n\n" +
        "**2.** Viewing group membership helps manage access and collaboration.\n\n---\n\n" +
        "**3.** Please specify the group, or select from your groups below.\n\n" +
        "[Show members] [Select group] [Cancel]",
      "Am I part of the product group?":
        "**1.** I'll check your membership in the product group.\n\n---\n\n" +
        "**2.** There are multiple groups related to 'product.' Please specify which one you mean.\n\n---\n\n" +
        "**3.**\n1. Product Management (product-management@example.com)\n2. All Product (all-product@example.com)\n3. User Experience (product-design@example.com)\n\n" +
        "[Check membership] [Choose different group] [Cancel]",
    }
  },
  'user-provisioning': {
    prompts: [
      { text: "How do I create a new user in Azure AD?", highlighted: "create a new user" },
      { text: "How do I assign a role to a user?", highlighted: "assign a role to a user" },
    ],
    responses: {
      "How do I create a new user in Azure AD?":
        "**1.** You want to create a new user. I'll check your permissions and prepare the user creation form...\n\n---\n\n" +
        "**2.** Only admins can create new users. I'll guide you through the required fields.\n\n---\n\n" +
        "**3.** Please provide the new user's name, email, and role.\n\n" +
        "[Start user creation] [Cancel]",
      "How do I assign a role to a user?":
        "**1.** You want to assign a role. I'll check available roles and your permissions...\n\n---\n\n" +
        "**2.** Assigning roles controls access and permissions.\n\n---\n\n" +
        "**3.** Please specify the user and role, or select from your managed users.\n\n" +
        "[Assign role] [Select user] [Cancel]",
    }
  },
  'app-registration': {
    prompts: [
      { text: "How do I register a new app in Azure AD?", highlighted: "register a new app" },
      { text: "How do I configure permissions for an app?", highlighted: "configure permissions for an app" },
    ],
    responses: {
      "How do I register a new app in Azure AD?":
        "**1.** You want to register a new app. I'll check your permissions and prepare the registration form...\n\n---\n\n" +
        "**2.** App registration requires admin rights and specific details.\n\n---\n\n" +
        "**3.** Please provide the app name and redirect URI, or start the registration wizard.\n\n" +
        "[Start registration] [Cancel]",
      "How do I configure permissions for an app?":
        "**1.** You want to configure app permissions. I'll fetch the app's current permissions...\n\n---\n\n" +
        "**2.** Permissions control what the app can access.\n\n---\n\n" +
        "**3.** Please specify the app and permissions to configure, or select from your registered apps.\n\n" +
        "[Configure permissions] [Select app] [Cancel]",
    }
  },
  'audit-logs': {
    prompts: [
      { text: "How do I view Azure AD audit logs?", highlighted: "view Azure AD audit logs" },
      { text: "Can I export audit logs?", highlighted: "export audit logs" },
    ],
    responses: {
      "How do I view Azure AD audit logs?":
        "**1.** You want to view audit logs. I'll fetch the latest logs for your account...\n\n---\n\n" +
        "**2.** Audit logs help track changes and monitor security.\n\n---\n\n" +
        "**3.** Please specify the date range or type of logs you want to view.\n\n" +
        "[View logs] [Select date range] [Cancel]",
      "Can I export audit logs?":
        "**1.** You want to export audit logs. I'll prepare the export file...\n\n---\n\n" +
        "**2.** Exporting logs allows for offline analysis and compliance.\n\n---\n\n" +
        "**3.** Please specify the format (CSV, PDF) and date range.\n\n" +
        "[Export as CSV] [Export as PDF] [Cancel]",
    }
  },
  'help-support': {
    prompts: [
      { text: "How do I contact support?", highlighted: "contact support" },
      { text: "Where can I find Azure AD documentation?", highlighted: "Azure AD documentation" },
    ],
    responses: {
      "How do I contact support?":
        "**1.** You need support. I'll check available contact options...\n\n---\n\n" +
        "**2.** Support can be reached via ticket, chat, or phone.\n\n---\n\n" +
        "**3.** Please choose your preferred support channel.\n\n" +
        "[Submit ticket] [Call IT] [Cancel]",
      "Where can I find Azure AD documentation?":
        "**1.** You're looking for documentation. I'll fetch the latest Azure AD docs...\n\n---\n\n" +
        "**2.** Official docs provide step-by-step guides and troubleshooting.\n\n---\n\n" +
        "**3.** Would you like a direct link or help with a specific topic?\n\n" +
        "[Get documentation link] [Search topic] [Cancel]",
    }
  },
  'leave-request': {
    prompts: [
      { text: "How do I apply for leave?", highlighted: "apply for leave" },
      { text: "Can I check my leave balance?", highlighted: "leave balance" },
      { text: "How do I track my leave approval?", highlighted: "track my leave approval" },
      { text: "I want to take 3 days off next week from Wednesday to Friday.", highlighted: "3 days off next week" },
    ],
    responses: {
      "How do I apply for leave?":
        "**1.** You want to apply for leave. I'll check your leave balance and prepare the request form...\n\n---\n\n" +
        "**2.** Leave requests require available balance and manager approval.\n\n---\n\n" +
        "**3.** Please select your leave type and dates, or start the leave request form.\n\n" +
        "[Submit leave request] [Edit dates] [Cancel]",
      "Can I check my leave balance?":
        "**1.** Let me check your current leave balance in the HR system...\n\n---\n\n" +
        "**2.** I'm verifying your available Paid Time Off (PTO) days based on your employment records and recent leave usage.\n\n---\n\n" +
        "**3.** Your current PTO balance is **24 days**. Would you like to see a breakdown by leave type or request time off?\n\n" +
        "[Show breakdown] [Request time off] [Cancel]",
      "How do I track my leave approval?":
        "**1.** You want to track your leave approval. I'll check the status of your recent requests...\n\n---\n\n" +
        "**2.** Leave approvals are managed by your supervisor.\n\n---\n\n" +
        "**3.** Here's the status of your latest leave request: **Pending approval**. Would you like to receive updates?\n\n" +
        "[Get updates] [Cancel]",
      "I want to take 3 days off next week from Wednesday to Friday.":
        "**1.** You want to request 3 days off next week. I'll prepare the leave request for your review...\n\n---\n\n" +
        "**2.** I need to confirm your requested dates and user details before submitting.\n\n---\n\n" +
        "**3.** Please confirm the following details for your PTO request:\n\n" +
        "- **Start Date:** 2025-05-21 (Wednesday)\n" +
        "- **End Date:** 2025-05-23 (Friday)\n" +
        "- **User:** John Doe - john.doe@example.com\n\n" +
        "[Submit leave request] [Edit dates] [Cancel]",
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
        "**1.** You want to download your latest payslip. I'll fetch your most recent document...\n\n---\n\n" +
        "**2.** Payslips are available in your HR portal.\n\n---\n\n" +
        "**3.** Please confirm your identity to download your payslip.\n\n" +
        "[Download payslip] [Cancel]",
      "Can I view my payslip history?":
        "**1.** You want to view your payslip history. I'll retrieve your past payslips...\n\n---\n\n" +
        "**2.** Payslip history helps you track your earnings and deductions.\n\n---\n\n" +
        "**3.** Here are your last 5 payslips. Would you like to download any?\n\n" +
        "[View payslips] [Download payslip] [Cancel]",
      "What if I can't open my payslip?":
        "**1.** You're having trouble opening your payslip. Let me check the file format and your device compatibility...\n\n---\n\n" +
        "**2.** Payslips are usually in PDF format.\n\n---\n\n" +
        "**3.** Please ensure you have a PDF reader installed. If the issue persists, I can connect you with HR support.\n\n" +
        "[Get help] [Cancel]",
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
        "**1.** You want to update your address. I'll open the personal info form...\n\n---\n\n" +
        "**2.** Keeping your address up to date ensures you receive important documents.\n\n---\n\n" +
        "**3.** Please enter your new address or upload proof of address if required.\n\n" +
        "[Update address] [Cancel]",
      "Can I change my bank account details?":
        "**1.** You want to change your bank account details. I'll open the payroll info form...\n\n---\n\n" +
        "**2.** Updating your bank details ensures your salary is deposited correctly.\n\n---\n\n" +
        "**3.** Please enter your new bank account information.\n\n" +
        "[Update bank details] [Cancel]",
      "How do I review my personal info?":
        "**1.** You want to review your personal info. I'll fetch your current records...\n\n---\n\n" +
        "**2.** Reviewing your info helps keep your records accurate.\n\n---\n\n" +
        "**3.** Here's a summary of your current personal info. Would you like to update anything?\n\n" +
        "[View info] [Update info] [Cancel]",
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
        "**1.** You need HR support. I'll check available contact options...\n\n---\n\n" +
        "**2.** HR can be reached via ticket, chat, or phone.\n\n---\n\n" +
        "**3.** Please choose your preferred HR support channel.\n\n" +
        "[Submit HR ticket] [Call HR] [Cancel]",
      "Can I submit an HR query?":
        "**1.** You want to submit an HR query. I'll open the query form...\n\n---\n\n" +
        "**2.** Submitting queries helps HR address your concerns efficiently.\n\n---\n\n" +
        "**3.** Please enter your query or select a topic.\n\n" +
        "[Submit query] [Cancel]",
      "Where can I find HR policies?":
        "**1.** You're looking for HR policies. I'll fetch the latest policy documents...\n\n---\n\n" +
        "**2.** HR policies are available in the HR portal.\n\n---\n\n" +
        "**3.** Would you like a direct link or a summary of key policies?\n\n" +
        "[Get link] [View summary] [Cancel]",
    }
  },
  'resource-onboarding': {
    prompts: [
      { text: "How do I start onboarding a new employee?", highlighted: "onboarding a new employee" },
      { text: "What documents are needed for onboarding?", highlighted: "documents are needed" },
      { text: "How can I track onboarding progress?", highlighted: "track onboarding progress" },
      { text: "Can I send a welcome email automatically?", highlighted: "send a welcome email" },
    ],
    responses: {
      "How do I start onboarding a new employee?":
        "**1.** You want to onboard a new employee. I'll open the onboarding form...\n\n---\n\n" +
        "**2.** Onboarding requires collecting personal and job details.\n\n---\n\n" +
        "**3.** Please enter the new hire's information to begin onboarding.\n\n" +
        "[Start onboarding] [Cancel]",
      "What documents are needed for onboarding?":
        "**1.** You want to know which documents are needed. I'll fetch the onboarding checklist...\n\n---\n\n" +
        "**2.** Required documents include ID, tax forms, and offer letter.\n\n---\n\n" +
        "**3.** Here's a checklist of required documents. Would you like to upload them now?\n\n" +
        "[View checklist] [Upload documents] [Cancel]",
      "How can I track onboarding progress?":
        "**1.** You want to track onboarding progress. I'll fetch the onboarding dashboard...\n\n---\n\n" +
        "**2.** Tracking progress ensures all tasks are completed on time.\n\n---\n\n" +
        "**3.** Here's the onboarding status for your new hire. Would you like notifications for key milestones?\n\n" +
        "[View dashboard] [Get notifications] [Cancel]",
      "Can I send a welcome email automatically?":
        "**1.** You want to send a welcome email. I'll check if automation is enabled...\n\n---\n\n" +
        "**2.** Automated emails help new hires feel welcome.\n\n---\n\n" +
        "**3.** Would you like to use a template or write a custom message?\n\n" +
        "[Use template] [Write custom] [Cancel]",
    }
  },
  'travel-request': {
    prompts: [
      { text: "I want to raise a travel request for next week.", highlighted: "raise a travel request" },
      { text: "What documents do I need for a travel request?", highlighted: "documents do I need" },
    ],
    responses: {
      "I want to raise a travel request for next week.":
        "**1.** You want to raise a travel request. I'll validate your request and required documents...\n\n---\n\n" +
        "**2.** Please provide your travel dates, destination, and purpose.\n\n---\n\n" +
        "**3.** I'll check available flight options and highlight the best fares.\n\n" +
        "[Provide details] [Cancel]",
      "What documents do I need for a travel request?":
        "**1.** For a travel request, you typically need an approved request form, ID proof, and any required client invitation.\n\n---\n\n" +
        "**2.** I'll validate your documents and let you know if anything is missing.\n\n" +
        "[Upload documents] [Cancel]",
    }
  },
  'visa-processing': {
    prompts: [
      { text: "Do I need a visa for my trip?", highlighted: "need a visa" },
      { text: "How do I start the visa process?", highlighted: "start the visa process" },
    ],
    responses: {
      "Do I need a visa for my trip?":
        "**1.** I'll check if a visa is required for your destination.\n\n---\n\n" +
        "**2.** If required, I'll validate your checklist and initiate the visa process.\n\n" +
        "[Check requirements] [Cancel]",
      "How do I start the visa process?":
        "**1.** To start the visa process, I'll need your travel details and supporting documents.\n\n---\n\n" +
        "**2.** Please upload your documents and I'll notify you if anything is missing.\n\n" +
        "[Upload documents] [Cancel]",
    }
  },
  'travel-booking': {
    prompts: [
      { text: "Show me the best flight options for my trip.", highlighted: "best flight options" },
      { text: "Can you book a hotel near the airport?", highlighted: "book a hotel" },
      { text: "I need a car rental for my trip.", highlighted: "car rental" },
    ],
    responses: {
      "Show me the best flight options for my trip.":
        "**1.** I'll fetch available flight options for your requested dates.\n\n---\n\n" +
        "**2.** Highlighting the best fares and minimum layover.\n\n" +
        "[Show flights] [Cancel]",
      "Can you book a hotel near the airport?":
        "**1.** I'll fetch hotel options near your destination within your budget.\n\n---\n\n" +
        "**2.** Please confirm your preferences.\n\n" +
        "[Show hotels] [Cancel]",
      "I need a car rental for my trip.":
        "**1.** I'll fetch car rental options for your travel dates.\n\n---\n\n" +
        "**2.** Please confirm pickup and drop-off details.\n\n" +
        "[Show car rentals] [Cancel]",
    }
  },
  'travel-approval': {
    prompts: [
      { text: "Has my travel request been approved?", highlighted: "travel request been approved" },
      { text: "Who needs to approve my travel?", highlighted: "approve my travel" },
    ],
    responses: {
      "Has my travel request been approved?":
        "**1.** I'll check the approval status for your travel request.\n\n---\n\n" +
        "**2.** If pending, I'll notify your manager and auto-approve if not received in 3 hours.\n\n" +
        "[Check status] [Cancel]",
      "Who needs to approve my travel?":
        "**1.** Your travel request requires L1 and L2 manager approval.\n\n---\n\n" +
        "**2.** I'll trigger approvals and keep you updated.\n\n" +
        "[Notify managers] [Cancel]",
    }
  },
  'travel-expenses': {
    prompts: [
      { text: "How do I log my travel expenses?", highlighted: "log my travel expenses" },
      { text: "Can I get a report of my travel expenses?", highlighted: "report of my travel expenses" },
    ],
    responses: {
      "How do I log my travel expenses?":
        "**1.** I'll open the travel expense form for you.\n\n---\n\n" +
        "**2.** Please enter your expenses and upload receipts.\n\n" +
        "[Open expense form] [Cancel]",
      "Can I get a report of my travel expenses?":
        "**1.** I'll fetch your travel expense reports.\n\n---\n\n" +
        "**2.** You can view, download, or export them as needed.\n\n" +
        "[View reports] [Export] [Cancel]",
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
  'resource-onboarding': 'Resource Onboarding',
  'hr-helpdesk': 'HR Helpdesk',
  'travel-request': 'Travel Request',
  'visa-processing': 'Visa Processing',
  'travel-booking': 'Travel Booking',
  'travel-approval': 'Travel Approval',
  'travel-expenses': 'Travel Expenses',
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
    <Box sx={{ display: 'flex', height: '100vh', minHeight: 0, bgcolor: BRAND_COLORS.background.light }}>
      <Sidebar selectedWorkflow={selectedWorkflow} setSelectedWorkflow={setSelectedWorkflow} />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, bgcolor: BRAND_COLORS.background.light, p: 0 }}>
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, p: 0 }}>
          {/* Always show the info card for the workflow at the top, no heading or toggle */}
          <Box sx={{ mb: 0, p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(90deg, #f5f7fb 60%, #e8eafd 100%)', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 0 }}>
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
          </Box>
          {/* Chat area fills the rest of the page height */}
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', p: 0, height: 0 }}>
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