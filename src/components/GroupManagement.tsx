import { Paper, Typography } from '@mui/material';

export default function GroupManagement() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Group Management
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Manage Azure AD groups, add or remove members, and review group settings. Use the assistant for step-by-step guidance.
      </Typography>
    </Paper>
  );
} 