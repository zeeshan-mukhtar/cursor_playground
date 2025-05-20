import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
  Divider
} from '@mui/material';
import {
  LockReset,
  AccountCircle,
  BusinessCenter,
  Help,
  ExpandLess,
  ExpandMore,
  Group,
  AssignmentInd,
  Description,
  Info,
  SupportAgent
} from '@mui/icons-material';

interface SidebarProps {
  selectedWorkflow: string;
  setSelectedWorkflow: (workflow: string) => void;
}

const DRAWER_WIDTH = 280;

const ITNOCWorkflows = [
  { id: 'password-reset', name: 'Reset Password', icon: <LockReset /> },
  { id: 'account-unlock', name: 'Unlock Account', icon: <AccountCircle /> },
  { id: 'software-access', name: 'Request Software', icon: <BusinessCenter /> },
  { id: 'group-management', name: 'Group Management', icon: <Group /> },
  { id: 'user-provisioning', name: 'User Provisioning', icon: <AssignmentInd /> },
  { id: 'app-registration', name: 'App Registration', icon: <BusinessCenter /> },
  { id: 'audit-logs', name: 'Audit Logs', icon: <Description /> },
  { id: 'help-support', name: 'Get Help', icon: <Help /> },
];

const HRWorkflows = [
  { id: 'leave-request', name: 'Leave Request', icon: <AssignmentInd /> },
  { id: 'payslip-download', name: 'Payslip Download', icon: <Description /> },
  { id: 'update-personal-info', name: 'Update Personal Info', icon: <Info /> },
  { id: 'resource-onboarding', name: 'Resource Onboarding', icon: <AssignmentInd /> },
  { id: 'hr-helpdesk', name: 'HR Helpdesk', icon: <SupportAgent /> },
];

export default function Sidebar({ selectedWorkflow, setSelectedWorkflow }: SidebarProps) {
  const [openITNOC, setOpenITNOC] = useState(true);
  const [openHR, setOpenHR] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: '#f5f7fb',
          color: '#222',
          borderRight: 'none',
          borderRadius: '18px',
          margin: '16px 0 16px 12px',
          boxShadow: '0 4px 24px rgba(74,108,247,0.08)',
        },
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, color: '#2a3535' }}>
          AI Playground
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: '#e0e7ef', mb: 1 }} />
      <List>
        {/* IT NOC Section */}
        <ListItem button onClick={() => setOpenITNOC((prev) => !prev)} sx={{ borderRadius: 3, mb: 0.5 }}>
          <ListItemIcon sx={{ color: '#4A6CF7' }}><BusinessCenter /></ListItemIcon>
          <ListItemText primary={<span style={{ fontWeight: 600, fontSize: 16, color: '#2a3535' }}>IT NOC</span>} />
          {openITNOC ? <ExpandLess sx={{ color: '#4A6CF7' }} /> : <ExpandMore sx={{ color: '#4A6CF7' }} />}
        </ListItem>
        <Collapse in={openITNOC} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {ITNOCWorkflows.map((workflow) => (
              <ListItem
                button
                key={workflow.id}
                selected={selectedWorkflow === workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                sx={{
                  pl: 4,
                  borderRadius: 99,
                  my: 0.5,
                  color: '#2a3535',
                  background: selectedWorkflow === workflow.id ? '#e8eafd' : 'transparent',
                  '&:hover': {
                    background: '#e8eafd',
                    color: '#4A6CF7',
                  },
                  transition: 'background 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: '#4A6CF7' }}>{workflow.icon}</ListItemIcon>
                <ListItemText primary={workflow.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
        <Divider sx={{ my: 2, bgcolor: '#e0e7ef' }} />
        {/* HR Section */}
        <ListItem button onClick={() => setOpenHR((prev) => !prev)} sx={{ borderRadius: 3, mb: 0.5 }}>
          <ListItemIcon sx={{ color: '#4A6CF7' }}><AssignmentInd /></ListItemIcon>
          <ListItemText primary={<span style={{ fontWeight: 600, fontSize: 16, color: '#2a3535' }}>HR</span>} />
          {openHR ? <ExpandLess sx={{ color: '#4A6CF7' }} /> : <ExpandMore sx={{ color: '#4A6CF7' }} />}
        </ListItem>
        <Collapse in={openHR} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {HRWorkflows.map((workflow) => (
              <ListItem
                button
                key={workflow.id}
                selected={selectedWorkflow === workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                sx={{
                  pl: 4,
                  borderRadius: 99,
                  my: 0.5,
                  color: '#2a3535',
                  background: selectedWorkflow === workflow.id ? '#e8eafd' : 'transparent',
                  '&:hover': {
                    background: '#e8eafd',
                    color: '#4A6CF7',
                  },
                  transition: 'background 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: '#4A6CF7' }}>{workflow.icon}</ListItemIcon>
                <ListItemText primary={workflow.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
} 