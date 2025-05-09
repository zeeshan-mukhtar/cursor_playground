import { useState, useCallback } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, TextField, InputAdornment, Collapse } from '@mui/material';
import { LockReset, Help, Search, Send, ExpandMore, ExpandLess, SmartToy, ArrowForward, Security } from '@mui/icons-material';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('password-reset');
  const [setInputText, setSetInputText] = useState<(text: string) => void>(() => () => {});
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPromptsOpen, setIsPromptsOpen] = useState(true);

  const samplePrompts = [
    {
      text: "My Azure AD password is about to expire. Can you help with resetting it?",
      highlighted: "about to expire"
    },
    {
      text: "I'm locked out of my Azure account. How can I regain access?",
      highlighted: "locked out"
    },
    {
      text: "Need to enable Multi-Factor Authentication for my Azure AD account",
      highlighted: "Multi-Factor Authentication"
    },
    {
      text: "How do I update my Azure AD security questions?",
      highlighted: "security questions"
    },
    {
      text: "Can't sign in to Microsoft 365 with my Azure AD credentials",
      highlighted: "can't sign in"
    },
    {
      text: "Need to sync my on-premise password with Azure AD",
      highlighted: "sync"
    }
  ];

  const handleSamplePromptSelect = useCallback((prompt: string) => {
    setInputText(prompt);
  }, [setInputText]);

  const handleCustomPromptSubmit = () => {
    if (customPrompt.trim()) {
      setInputText(customPrompt);
      setCustomPrompt('');
    }
  };

  const handleSetInputText = useCallback((setter: (text: string) => void) => {
    setSetInputText(() => setter);
  }, []);

  const togglePrompts = () => {
    setIsPromptsOpen(!isPromptsOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      <Sidebar selectedWorkflow={selectedWorkflow} setSelectedWorkflow={setSelectedWorkflow} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 4,
            pt: 2 
          }}>
            <SmartToy sx={{ 
              fontSize: 40, 
              color: '#4A6CF7'
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4A6CF7 0%, #24219c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI Workflow Assistant
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Paper 
              sx={{ 
                flex: 2, 
                p: 3,
                borderRadius: 3,
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2 
              }}>
                <Security sx={{ color: '#4A6CF7', fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1B2559'
                  }}
                >
                  Azure AD Assistant
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  color: '#64748B',
                  mb: 3
                }}
              >
                Having issues with your Azure Active Directory account? I'm here to help you with password management, security settings, and account access.
              </Typography>
              <List sx={{ '& .MuiListItem-root': { px: 2, py: 1.5 } }}>
                <ListItem>
                  <ListItemIcon>
                    <LockReset sx={{ color: '#4A6CF7' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Password Management" 
                    secondary="Reset, update, or sync your Azure AD password"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: '#1B2559'
                    }}
                    secondaryTypographyProps={{
                      color: '#64748B'
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Help sx={{ color: '#4A6CF7' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Account Security" 
                    secondary="MFA setup, security questions, and account recovery"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: '#1B2559'
                    }}
                    secondaryTypographyProps={{
                      color: '#64748B'
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
            
            <Paper 
              sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '500px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 108, 247, 0.02)'
                  }
                }}
                onClick={togglePrompts}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SmartToy sx={{ color: '#4A6CF7', fontSize: 20 }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontSize: '0.95rem',
                      color: '#1B2559',
                      fontWeight: 600
                    }}
                  >
                    Sample prompts
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    transform: isPromptsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <ExpandMore sx={{ color: '#4A6CF7' }} />
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                flex: 1,
                height: 'calc(100% - 60px)'
              }}>
                <Collapse 
                  in={isPromptsOpen} 
                  timeout="auto" 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '72px',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    visibility: isPromptsOpen ? 'visible' : 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      p: 2,
                      gap: 2,
                      overflowY: 'auto',
                      height: '100%',
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#CBD5E1',
                        borderRadius: '4px',
                      }
                    }}
                  >
                    {samplePrompts.map((prompt, index) => (
                      <Box
                        key={index}
                        onClick={() => handleSamplePromptSelect(prompt.text)}
                        sx={{
                          cursor: 'pointer',
                          p: 2,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          border: '1px solid rgba(203, 213, 225, 0.5)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(74, 108, 247, 0.1)',
                            borderColor: '#4A6CF7'
                          }
                        }}
                      >
                        <Typography sx={{ color: '#1B2559' }}>
                          {prompt.text.split(prompt.highlighted).map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span style={{ 
                                  backgroundColor: 'rgba(74, 108, 247, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  color: '#4A6CF7',
                                  fontWeight: 500
                                }}>
                                  {prompt.highlighted}
                                </span>
                              )}
                            </span>
                          ))}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Collapse>

                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2
                }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search for answers or give me an action"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomPromptSubmit();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <ArrowForward 
                            sx={{ 
                              cursor: 'pointer', 
                              color: customPrompt.trim() ? '#4A6CF7' : '#CBD5E1',
                              transition: 'color 0.2s ease'
                            }}
                            onClick={handleCustomPromptSubmit}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(203, 213, 225, 0.5)',
                          transition: 'border-color 0.2s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: '#4A6CF7 !important',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4A6CF7 !important',
                          borderWidth: '1px !important'
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
          
          <ChatInterface onSamplePromptSelect={handleSetInputText} />
        </Container>
      </Box>
    </Box>
  );
} 