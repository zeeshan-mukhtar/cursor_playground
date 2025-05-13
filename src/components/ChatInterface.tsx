import React, { useRef } from 'react';
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
  responses: Record<string, string>;
  messages: Message[];
  input: string;
  setMessages: (messages: Message[]) => void;
  setInput: (input: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ChatInterface({ samplePrompts, responses, messages, input, setMessages, setInput, isLoading, setIsLoading }: ChatInterfaceProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = React.useState<number | undefined>(undefined);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use mapped response if input matches a sample prompt, else default
      const botText =
        responses[input.trim()] ||
        "I'll help you reset your password. Please verify your identity first. Would you like to receive a verification code via email or phone?";

      const botResponse: Message = {
        text: botText,
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages([...messages, userMessage, botResponse]);
        setIsLoading(false);
      }, 2000);
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