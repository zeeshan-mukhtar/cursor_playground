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
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          RC Agentic AI Playground
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* IT NOC Section */}
        <ListItem button onClick={() => setOpenITNOC((prev) => !prev)}>
          <ListItemIcon><BusinessCenter /></ListItemIcon>
          <ListItemText primary="IT NOC" />
          {openITNOC ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openITNOC} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {ITNOCWorkflows.map((workflow) => (
              <ListItem
                button
                key={workflow.id}
                selected={selectedWorkflow === workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{workflow.icon}</ListItemIcon>
                <ListItemText primary={workflow.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
        <Divider sx={{ my: 1 }} />
        {/* HR Section */}
        <ListItem button onClick={() => setOpenHR((prev) => !prev)}>
          <ListItemIcon><AssignmentInd /></ListItemIcon>
          <ListItemText primary="HR" />
          {openHR ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openHR} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {HRWorkflows.map((workflow) => (
              <ListItem
                button
                key={workflow.id}
                selected={selectedWorkflow === workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{workflow.icon}</ListItemIcon>
                <ListItemText primary={workflow.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
} 