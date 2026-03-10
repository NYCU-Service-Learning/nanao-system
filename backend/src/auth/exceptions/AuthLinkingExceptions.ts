export class AccountLinkingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AccountLinkingError';
  }
}

export class GoogleAccountAlreadyLinkedError extends AccountLinkingError {
  constructor(email: string) {
    super(
      `Google account ${email} is already linked to another user account`,
      'GOOGLE_ALREADY_LINKED',
    );
  }
}

export class LineAccountAlreadyLinkedError extends AccountLinkingError {
  constructor(displayName: string) {
    super(
      `Line account ${displayName} is already linked to another user account`,
      'LINE_ALREADY_LINKED',
    );
  }
}

export class AccountAlreadyLinkedError extends AccountLinkingError {
  constructor(provider: string) {
    super(
      `This account is already linked to a ${provider} account`,
      'ACCOUNT_ALREADY_LINKED',
    );
  }
}
