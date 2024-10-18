export class SocialAuthError extends Error {
  constructor() {
    const message = `Happen auth error with third party service`;
    super(message);
    // because we are extending a built-in class
    Object.setPrototypeOf(this, SocialAuthError.prototype);
  }
}
