# AI Workflow Assistant with Azure AD Integration

This application provides an AI-powered workflow assistant that helps users with various tasks, including password reset through Azure AD integration.

## Features

- Password reset workflow with Azure AD integration
- Modern, responsive UI with Material-UI components
- Real-time chat interface
- Sample prompts for common tasks
- Secure authentication with Microsoft Authentication Library (MSAL)

## Prerequisites

- Node.js 14.x or later
- Azure AD tenant with appropriate permissions
- Azure AD application registration with the following permissions:
  - User.Read
  - User.ReadWrite

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-workflow-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your_tenant_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
```

4. Replace the placeholder values in `.env.local` with your Azure AD application credentials.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Sample Prompts

The application comes with several pre-configured prompts for password reset:

- "I need to reset my password"
- "My account is locked"
- "How do I change my password?"
- "I forgot my password"

## Architecture

The application is built with:

- Next.js - React framework
- Material-UI - UI components
- MSAL - Microsoft Authentication Library
- Azure AD - Identity and access management

## Security Considerations

- All sensitive operations require proper authentication
- Password reset requires user verification
- Access tokens are handled securely using MSAL
- Environment variables are used for sensitive configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request #   c u r s o r _ p l a y g r o u n d  
 #   p l a y g r o u n d _ t e s t  
 #   c u r s o r _ p l a y g r o u n d  
 