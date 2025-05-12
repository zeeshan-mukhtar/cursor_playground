import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem
} from '@mui/material';
import { Send, KeyboardArrowDown } from '@mui/icons-material';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SamplePrompt {
  text: string;
  highlighted: string;
}

interface ChatInterfaceProps {
  samplePrompts: SamplePrompt[];
}

export default function ChatInterface({ samplePrompts }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

  // Map each sample prompt to a specific response
  const promptResponses: Record<string, string> = {
    "My Azure AD password is about to expire. Can you help with resetting it?":
      "Your Azure AD password can be reset by visiting the password reset portal. Would you like a direct link or step-by-step instructions?",
    "I'm locked out of my Azure account. How can I regain access?":
      "If you're locked out, you can unlock your account using the self-service portal or by contacting your admin. Would you like to start the unlock process?",
    "Need to enable Multi-Factor Authentication for my Azure AD account":
      "To enable MFA, go to your account security settings. Would you like a guide on setting up MFA?",
    "How do I update my Azure AD security questions?":
      "You can update your security questions in your account profile under security info. Would you like a direct link?",
    "Can't sign in to Microsoft 365 with my Azure AD credentials":
      "If you can't sign in, try resetting your password or check if your account is locked. Would you like help with either?",
    "Need to sync my on-premise password with Azure AD":
      "To sync your on-premise password, ensure your organization has password writeback enabled. Would you like troubleshooting steps?",
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use mapped response if input matches a sample prompt, else default
      const botText =
        promptResponses[input.trim()] ||
        "I'll help you reset your password. Please verify your identity first. Would you like to receive a verification code via email or phone?";

      const botResponse: Message = {
        text: botText,
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 700);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsLoading(false);
    }
  };

  const handleMenuOpen = () => {
    // Anchor to the input's parent (the input container)
    if (inputRef.current && inputRef.current.parentElement) {
      setAnchorEl(inputRef.current.parentElement);
      setInputWidth(inputRef.current.parentElement.offsetWidth);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSamplePromptSelect = (prompt: string) => {
    setInput(prompt);
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1,
                backgroundColor: message.isUser ? 'primary.main' : 'grey.100',
                color: message.isUser ? 'white' : 'text.primary',
                maxWidth: '70%',
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Ask a Question
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Type your question or select from common queries
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for answers or give me an action"
          value={input}
          inputRef={inputRef}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <KeyboardArrowDown
                      sx={{
                        color: 'primary.main',
                        transition: 'transform 0.2s ease',
                        transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </Box>
                  <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              maxHeight: 300,
              width: inputWidth ? `${inputWidth}px` : '100%',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {samplePrompts.map((prompt, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSamplePromptSelect(prompt.text)}
              sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
            >
              <Typography sx={{ color: 'text.primary' }}>
                {prompt.text.split(prompt.highlighted).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        style={{
                          backgroundColor: 'rgba(0,35,102,0.08)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#002366',
                          fontWeight: 500,
                        }}
                      >
                        {prompt.highlighted}
                      </span>
                    )}
                  </span>
                ))}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Paper>
  );
} 