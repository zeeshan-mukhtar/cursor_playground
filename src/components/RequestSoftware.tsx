import { Paper, Typography } from '@mui/material';

export default function RequestSoftware() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Request Software
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Use this workflow to request access to software or applications through Azure AD. Submit your request or chat with the assistant for help.
      </Typography>
    </Paper>
  );
} 