import React, { useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import { Send, KeyboardArrowDown, SmartToy, Person } from '@mui/icons-material';

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

// Sample user personas for demo
const userPersonas = [
  { name: 'Alex Johnson', avatar: 'A' },
  { name: 'Priya Patel', avatar: 'P' },
  { name: 'Chris Lee', avatar: 'C' },
];
const assistantPersona = { name: 'RC Agentic AI', avatar: <SmartToy /> };

// Helper to parse steps and actions from assistant response
function parseAssistantResponse(text: string) {
  // Split by --- (divider between steps)
  const stepParts = text.split(/---/g).map(s => s.trim()).filter(Boolean);
  // Find last part with [Button]s
  let actions: string[] = [];
  if (stepParts.length > 0) {
    const last = stepParts[stepParts.length - 1];
    const buttonMatches = Array.from(last.matchAll(/\[(.*?)\]/g));
    if (buttonMatches.length > 0) {
      actions = buttonMatches.map(m => m[1]);
      // Remove [Button]s from last step
      stepParts[stepParts.length - 1] = last.replace(/\[(.*?)\]/g, '').trim();
    }
  }
  return { steps: stepParts, actions };
}

// Helper to reveal steps one by one with delay
function revealNextStep(steps: string[], setDisplayedSteps: React.Dispatch<React.SetStateAction<string[]>>, setIsLoading: (loading: boolean) => void, i: number = 0) {
  setDisplayedSteps(prev => [...prev, steps[i]]);
  i++;
  if (i < steps.length) {
    setTimeout(() => revealNextStep(steps, setDisplayedSteps, setIsLoading, i), 1200);
  } else {
    setIsLoading(false);
  }
}

export default function ChatInterface({ samplePrompts, responses, messages, input, setMessages, setInput, isLoading, setIsLoading }: ChatInterfaceProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = React.useState<number | undefined>(undefined);
  // For step-by-step assistant message rendering
  const [pendingSteps, setPendingSteps] = React.useState<string[]>([]);
  const [displayedSteps, setDisplayedSteps] = React.useState<string[]>([]);
  const [pendingActions, setPendingActions] = React.useState<string[]>([]);
  const [pendingMessageIdx, setPendingMessageIdx] = React.useState<number | null>(null);
  const prevMessagesRef = React.useRef<Message[]>(messages);
  const pendingFullBotText = React.useRef<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Pick a sample user persona for this session
  const userPersona = React.useMemo(() => userPersonas[Math.floor(Math.random() * userPersonas.length)], []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    return undefined;
  }, [messages, isLoading]);

  // Modified handleSend for step-by-step assistant response
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
      const botText =
        responses[input.trim()] ||
        "I'll help you reset your password. Please verify your identity first. Would you like to receive a verification code via email or phone?";
      // If it's a multi-step response, use step-by-step rendering
      if (botText.includes('**1.**')) {
        pendingFullBotText.current = botText;
        const { steps, actions } = parseAssistantResponse(botText);
        setPendingSteps(steps);
        setPendingActions(actions);
        setDisplayedSteps([]);
        setPendingMessageIdx(messages.length + 1); // index for this bot message
        prevMessagesRef.current = [...messages, userMessage, {
          text: '',
          isUser: false,
          timestamp: new Date(),
        }];
        // Reveal steps one by one
        setTimeout(() => revealNextStep(steps, setDisplayedSteps, setIsLoading, 0), 1200);
        // Add a placeholder bot message (will be replaced as steps are revealed)
        setMessages(prevMessagesRef.current);
        return;
      }
      // Fallback: normal single-message bot response
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

  // Effect: update the last assistant message as steps are revealed
  React.useEffect(() => {
    if (pendingMessageIdx !== null && displayedSteps.length > 0) {
      const newMessages = [...prevMessagesRef.current];
      // Only update if the placeholder bot message exists
      if (newMessages[pendingMessageIdx]) {
        // If reveal is complete, store the original full response string (with [Button]s)
        if (displayedSteps.length === pendingSteps.length && pendingFullBotText.current) {
          newMessages[pendingMessageIdx] = {
            ...newMessages[pendingMessageIdx],
            text: pendingFullBotText.current,
          };
        } else {
          newMessages[pendingMessageIdx] = {
            ...newMessages[pendingMessageIdx],
            text: displayedSteps.join('\n\n---\n\n'),
          };
        }
        setMessages(newMessages);
        prevMessagesRef.current = newMessages;
      }
    }
    // When all steps are revealed, reset pending state (but do NOT overwrite the message text)
    if (
      pendingMessageIdx !== null &&
      displayedSteps.length === pendingSteps.length &&
      pendingSteps.length > 0
    ) {
      setTimeout(() => {
        setPendingSteps([]);
        setDisplayedSteps([]);
        setPendingActions([]);
        setPendingMessageIdx(null);
        pendingFullBotText.current = null;
      }, 100);
    }
  }, [displayedSteps, pendingSteps, pendingMessageIdx, setMessages]);

  // Handler for action button clicks (for demo, just add a message)
  const handleActionClick = (action: string) => {
    const userMessage = {
      text: action,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    // Normalize action text for matching
    const normalizedAction = action.trim();
    let botText = responses[normalizedAction];
    // If not found, try case-insensitive match
    if (!botText) {
      const foundKey = Object.keys(responses).find(
        k => k.trim().toLowerCase() === normalizedAction.toLowerCase()
      );
      if (foundKey) botText = responses[foundKey];
    }
    // If still not found, use a generic multi-step fallback with buttons
    if (!botText) {
      botText =
        `**1.** You selected: ${action}\n\n---\n\n` +
        `**2.** This is a sample fallback response for the action button.\n\n---\n\n` +
        `**3.** Would you like to try another action or return to the main menu?\n\n[Main menu] [Cancel]`;
    }
    // If it's a multi-step response, use step-by-step rendering
    if (botText.includes('**1.**')) {
      pendingFullBotText.current = botText;
      const { steps, actions } = parseAssistantResponse(botText);
      setPendingSteps(steps);
      setPendingActions(actions);
      setDisplayedSteps([]);
      setPendingMessageIdx(messages.length + 1); // index for this bot message
      prevMessagesRef.current = [...messages, userMessage, {
        text: '',
        isUser: false,
        timestamp: new Date(),
      }];
      // Reveal steps one by one
      setTimeout(() => revealNextStep(steps, setDisplayedSteps, setIsLoading, 0), 1200);
      // Add a placeholder bot message (will be replaced as steps are revealed)
      setMessages(prevMessagesRef.current);
      return;
    }
    // Fallback: normal single-message bot response
    const botResponse = {
      text: botText,
      isUser: false,
      timestamp: new Date(),
    };
    setTimeout(() => {
      setMessages([...messages, userMessage, botResponse]);
      setIsLoading(false);
    }, 2000);
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
    <Paper sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 16px rgba(74,108,247,0.07)' }}>
      {/* Chat history area with internal scroll */}
      <Box ref={chatHistoryRef} sx={{ flex: 1, minHeight: 0, maxHeight: '100%', overflowY: 'auto', px: { xs: 1, sm: 3 }, pt: 3, pb: 0, background: 'transparent' }}>
        {messages.map((message, index) => {
          const isUser = message.isUser;
          const senderName = isUser ? userPersona.name : assistantPersona.name;
          const avatar = isUser ? (
            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>{userPersona.avatar}</Avatar>
          ) : (
            <Avatar sx={{ bgcolor: '#fff', color: '#1976d2', width: 32, height: 32 }}>{assistantPersona.avatar}</Avatar>
          );
          // Determine if this message is a multi-step assistant response
          const isMultiStepAssistant =
            !isUser && typeof message.text === 'string' && message.text.includes('**1.**') && message.text.includes('---');
          // Assistant message: if this is the last message and step-by-step is active, render steps and actions
          const isLastAssistant =
            !isUser &&
            index === messages.length - 1 &&
            displayedSteps.length > 0 &&
            pendingMessageIdx === index;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                mb: 1,
              }}
            >
              {avatar}
              <Box sx={{ ml: isUser ? 0 : 1, mr: isUser ? 1 : 0, maxWidth: '70%' }}>
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor: isUser ? 'primary.main' : 'grey.100',
                    color: isUser ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8, display: 'block', mb: 0.5 }}>
                    {senderName}
                  </Typography>
                  {/* Step-by-step assistant rendering for both in-progress and history */}
                  {(() => {
                    if (isLastAssistant) {
                      const steps = displayedSteps;
                      const actions = pendingActions;
                      const totalSteps = pendingSteps.length;
                      return (
                        <Box>
                          {steps.map((step, i) => (
                            <Box key={i} sx={{ mb: 3, p: 2, background: '#f5f7fb', borderRadius: 2, boxShadow: '0 2px 8px rgba(74,108,247,0.07)' }}>
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.08rem' }}>{step}</Typography>
                              {i < steps.length - 1 && <Divider sx={{ my: 2, borderBottomWidth: 3, bgcolor: '#4A6CF7' }} />}
                            </Box>
                          ))}
                          {steps.length === totalSteps && actions.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 1 }}>
                              {actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  variant="contained"
                                  color={action.toLowerCase().includes('cancel') ? 'error' : 'primary'}
                                  size="medium"
                                  sx={{ fontWeight: 700, px: 3, py: 1, borderRadius: 2, boxShadow: '0 2px 8px rgba(74,108,247,0.10)' }}
                                  onClick={() => handleActionClick(action)}
                                >
                                  {action}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </Box>
                      );
                    }
                    if (isMultiStepAssistant) {
                      const parsed = parseAssistantResponse(message.text);
                      const steps = parsed.steps;
                      const actions = parsed.actions;
                      const totalSteps = (message.text.match(/\*\*\d+\.\*\*/g) || []).length;
                      return (
                        <Box>
                          {steps.map((step, i) => (
                            <Box key={i} sx={{ mb: 3, p: 2, background: '#f5f7fb', borderRadius: 2, boxShadow: '0 2px 8px rgba(74,108,247,0.07)' }}>
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.08rem' }}>{step}</Typography>
                              {i < steps.length - 1 && <Divider sx={{ my: 2, borderBottomWidth: 3, bgcolor: '#4A6CF7' }} />}
                            </Box>
                          ))}
                          {steps.length === totalSteps && actions.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 1 }}>
                              {actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  variant="contained"
                                  color={action.toLowerCase().includes('cancel') ? 'error' : 'primary'}
                                  size="medium"
                                  sx={{ fontWeight: 700, px: 3, py: 1, borderRadius: 2, boxShadow: '0 2px 8px rgba(74,108,247,0.10)' }}
                                  onClick={() => handleActionClick(action)}
                                >
                                  {action}
                                </Button>
                              ))}
                            </Box>
                          )}
                        </Box>
                      );
                    }
                    return <Typography variant="body1">{message.text}</Typography>;
                  })()}
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          );
        })}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>
      {/* Input area and sample prompts, fixed at the bottom */}
      <Box sx={{ flexShrink: 0, p: { xs: 1, sm: 2 }, borderTop: '1px solid #e0e7ef', background: '#fff', boxShadow: '0 -2px 16px rgba(74,108,247,0.04)', borderRadius: '0 0 16px 16px', zIndex: 2 }}>
        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {samplePrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 500, bgcolor: '#f5f7fb', color: '#4A6CF7', borderColor: '#e0e7ef', '&:hover': { bgcolor: '#e8eafd', borderColor: '#4A6CF7' } }}
              onClick={() => setInput(prompt.text)}
            >
              {prompt.text.split(prompt.highlighted).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span style={{ backgroundColor: 'rgba(74,108,247,0.10)', padding: '2px 6px', borderRadius: '4px', color: '#4A6CF7', fontWeight: 600 }}>
                      {prompt.highlighted}
                    </span>
                  )}
                </span>
              ))}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your question or action..."
            value={input}
            inputRef={inputRef}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            sx={{ borderRadius: 3, bgcolor: '#f5f7fb', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
} 