import { Paper, Typography } from '@mui/material';

export default function AppRegistration() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        App Registration
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Register new applications in Azure AD, manage permissions, and configure authentication. Use the assistant for registration guidance.
      </Typography>
    </Paper>
  );
} 