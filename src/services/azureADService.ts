import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/authConfig';

class AzureADService {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  async getAccessToken() {
    try {
      const account = this.msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('No active account found');
      }

      const response = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      return response.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async initiatePasswordReset(userId: string) {
    try {
      const accessToken = await this.getAccessToken();
      
      // Get authentication methods for the user
      const authMethodsResponse = await axios.get(
        graphConfig.passwordResetEndpoint.replace('{id}', userId),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // For demonstration, we'll just return the auth methods
      return authMethodsResponse.data.value;
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw error;
    }
  }

  async resetPassword(userId: string, newPassword: string) {
    try {
      const accessToken = await this.getAccessToken();
      
      // This is a simplified example. In production, you'd want to follow
      // proper security practices and use Microsoft Graph API's proper endpoints
      await axios.post(
        `https://graph.microsoft.com/v1.0/users/${userId}/changePassword`,
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  async verifyUser(userId: string, verificationCode: string) {
    // In a real implementation, this would verify the user's identity
    // using the provided verification code
    return true;
  }
}

export const azureADService = new AzureADService(); 