import axios from "axios";
import { API_URL } from "../config";

export interface AuthConfig {
  auth: {
    local: boolean;
    google: boolean;
    lineLogin: boolean;
    lineLink: boolean;
  };
}

export interface LinkedAccounts {
  status: string;
  linkedAccounts: {
    google: boolean;
    line: boolean;
  };
  accountInfo: {
    googleEmail: string | null;
    lineId: string | null;
  };
}

export const getAuthConfig = async (): Promise<AuthConfig> => {
  const response = await axios.get(`${API_URL}auth/config`);
  return response.data;
};

export const getLinkedAccounts = async (): Promise<LinkedAccounts> => {
  const response = await axios.get(`${API_URL}auth/linked-accounts`, {
    withCredentials: true,
  });
  return response.data;
};
