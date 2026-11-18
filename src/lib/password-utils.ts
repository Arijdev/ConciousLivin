export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
  score: number;
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /welcome/i,
  ];

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    errors.push('Password contains common patterns, please choose a stronger password');
    score = Math.max(0, score - 2);
  }

  const isValid = errors.length === 0;

  let message = 'Password strength: ';
  if (score <= 2) message += 'Weak';
  else if (score <= 3) message += 'Fair';
  else if (score <= 4) message += 'Good';
  else message += 'Strong';

  return { isValid, message, errors, score };
}

export function getPasswordStrengthLabel(score: number): string {
  if (score <= 2) return 'Weak';
  if (score <= 3) return 'Fair';
  if (score <= 4) return 'Good';
  return 'Strong';
}
