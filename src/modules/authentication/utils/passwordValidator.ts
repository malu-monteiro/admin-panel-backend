export const PasswordValidator = {
  validate(password: string): { isValid: boolean; errorMessage?: string } {
    if (!password) {
      return { isValid: false, errorMessage: "Password is required" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        errorMessage: "Password must be at least 6 characters",
      };
    }

    if (!/(?=.*[A-Za-z])/.test(password)) {
      return {
        isValid: false,
        errorMessage: "Password must contain at least one letter",
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        errorMessage: "Password must contain at least one number",
      };
    }

    return { isValid: true };
  },

  validateOrThrow(password: string): void {
    const { isValid, errorMessage } = this.validate(password);
    if (!isValid) {
      throw new Error(errorMessage);
    }
  },
};
