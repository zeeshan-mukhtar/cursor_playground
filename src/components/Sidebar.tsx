import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import {
  LockReset,
  AccountCircle,
  BusinessCenter,
  Help,
} from '@mui/icons-material';

interface SidebarProps {
  selectedWorkflow: string;
  setSelectedWorkflow: (workflow: string) => void;
}

const DRAWER_WIDTH = 280;

const workflows = [
  { id: 'password-reset', name: 'Reset Password', icon: <LockReset /> },
  { id: 'account-unlock', name: 'Unlock Account', icon: <AccountCircle /> },
  { id: 'software-access', name: 'Request Software', icon: <BusinessCenter /> },
  { id: 'group-management', name: 'Group Management', icon: <BusinessCenter /> },
  { id: 'user-provisioning', name: 'User Provisioning', icon: <AccountCircle /> },
  { id: 'app-registration', name: 'App Registration', icon: <BusinessCenter /> },
  { id: 'audit-logs', name: 'Audit Logs', icon: <Help /> },
  { id: 'help-support', name: 'Get Help', icon: <Help /> },
];

export default function Sidebar({ selectedWorkflow, setSelectedWorkflow }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          AI Workflow Assistant
        </Typography>
      </Box>
      
      <List>
        {workflows.map((workflow) => (
          <ListItem
            button
            key={workflow.id}
            selected={selectedWorkflow === workflow.id}
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            <ListItemIcon>{workflow.icon}</ListItemIcon>
            <ListItemText primary={workflow.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
} 