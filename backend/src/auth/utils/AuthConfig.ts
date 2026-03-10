export interface ThirdPartyAuthConfig {
  google: {
    enabled: boolean;
    clientId?: string;
    clientSecret?: string;
  };
  line: {
    login: {
      enabled: boolean;
      channelId?: string;
      secretKey?: string;
    };
    link: {
      enabled: boolean;
      channelId?: string;
      secretKey?: string;
    };
  };
}

export function getAuthConfig(): ThirdPartyAuthConfig {
  const googleEnabled = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET_KEY
  );

  const lineLoginEnabled = !!(
    process.env.LINE_LOGIN_CHANNEL_ID && process.env.LINE_LOGIN_SECRET_KEY
  );

  const lineLinkEnabled = !!(
    process.env.LINE_LINK_CHANNEL_ID && process.env.LINE_LINK_SECRET_KEY
  );

  return {
    google: {
      enabled: googleEnabled,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
    },
    line: {
      login: {
        enabled: lineLoginEnabled,
        channelId: process.env.LINE_LOGIN_CHANNEL_ID,
        secretKey: process.env.LINE_LOGIN_SECRET_KEY,
      },
      link: {
        enabled: lineLinkEnabled,
        channelId: process.env.LINE_LINK_CHANNEL_ID,
        secretKey: process.env.LINE_LINK_SECRET_KEY,
      },
    },
  };
}

export function isThirdPartyAuthEnabled(): boolean {
  const config = getAuthConfig();
  return (
    config.google.enabled ||
    config.line.login.enabled ||
    config.line.link.enabled
  );
}
