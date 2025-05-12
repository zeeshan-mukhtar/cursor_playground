import { Paper, Typography } from '@mui/material';

export default function GetHelp() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Get Help
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Need assistance with Azure AD or this application? Use this page to get support, access documentation, or chat with the assistant for help.
      </Typography>
    </Paper>
  );
} 