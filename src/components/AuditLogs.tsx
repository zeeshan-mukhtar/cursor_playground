import { Paper, Typography } from '@mui/material';

export default function AuditLogs() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 5px 20px rgba(0,0,0,0.05)', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Audit Logs
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        View and search Azure AD audit logs for user and admin activities. Use the assistant for log analysis and troubleshooting.
      </Typography>
    </Paper>
  );
} 