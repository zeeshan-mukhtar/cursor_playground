import { Paper, Typography } from '@mui/material';

export default function UnlockAccount() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Unlock Account
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        If you are locked out of your Azure AD account, use this workflow to regain access. Follow the steps or chat with the assistant for help.
      </Typography>
    </Paper>
  );
} 