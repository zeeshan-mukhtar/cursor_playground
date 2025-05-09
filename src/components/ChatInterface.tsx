import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSamplePromptSelect?: (setter: (text: string) => void) => void;
}

export default function ChatInterface({ onSamplePromptSelect }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // Here we would integrate with Azure AD for password reset
      // This is a mock response for demonstration
      const botResponse: Message = {
        text: "I'll help you reset your password. Please verify your identity first. Would you like to receive a verification code via email or phone?",
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsLoading(false);
    }
  };

  // Expose method to set input text (for sample prompts)
  const setInputText = (text: string) => {
    setInput(text);
  };

  // Make setInputText available to parent through the onSamplePromptSelect prop
  React.useEffect(() => {
    if (onSamplePromptSelect) {
      onSamplePromptSelect(setInputText);
    }
  }, [onSamplePromptSelect]);

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

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
} 