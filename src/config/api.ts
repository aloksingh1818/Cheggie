export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  chat: {
    send: `${API_BASE_URL}/api/chat`,
  },
  aiModels: {
    list: `${API_BASE_URL}/api/ai-models`,
    configure: `${API_BASE_URL}/api/ai-models/configure`,
  },
  credits: {
    balance: `${API_BASE_URL}/api/credits/balance`,
  }
}; 