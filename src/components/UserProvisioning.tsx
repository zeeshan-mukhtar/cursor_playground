import { Paper, Typography } from '@mui/material';

export default function UserProvisioning() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        User Provisioning
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Provision new users, assign roles, and manage user lifecycle in Azure AD. Use the assistant for automated provisioning help.
      </Typography>
    </Paper>
  );
} 