import { PasswordValidationResult, PasswordRuleCheck } from '../types';

export const validateBankingPassword = (password: string): PasswordValidationResult => {
  const rules: PasswordRuleCheck[] = [
    {
      id: 'length',
      label: '8 to 32 Characters',
      satisfied: password.length >= 8 && password.length <= 32,
      hint: 'Password must be between 8 and 32 characters in length.'
    },
    {
      id: 'uppercase',
      label: 'At least 1 Uppercase (A-Z)',
      satisfied: /[A-Z]/.test(password),
      hint: 'Include at least one uppercase alphabetic character.'
    },
    {
      id: 'lowercase',
      label: 'At least 1 Lowercase (a-z)',
      satisfied: /[a-z]/.test(password),
      hint: 'Include at least one lowercase alphabetic character.'
    },
    {
      id: 'number',
      label: 'At least 1 Numeric Digit (0-9)',
      satisfied: /[0-9]/.test(password),
      hint: 'Include at least one number.'
    },
    {
      id: 'special',
      label: 'At least 1 Special Symbol (!@#$%^&*)',
      satisfied: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
      hint: 'Include at least one special security character.'
    }
  ];

  const satisfiedCount = rules.filter(r => r.satisfied).length;
  const isValid = satisfiedCount === rules.length;

  let score = 0;
  let strengthLabel: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Very Weak';

  if (satisfiedCount === 5) {
    if (password.length >= 12) {
      score = 4;
      strengthLabel = 'Strong';
    } else {
      score = 3;
      strengthLabel = 'Good';
    }
  } else if (satisfiedCount >= 4) {
    score = 2;
    strengthLabel = 'Fair';
  } else if (satisfiedCount >= 2) {
    score = 1;
    strengthLabel = 'Weak';
  } else {
    score = 0;
    strengthLabel = 'Very Weak';
  }

  return {
    isValid,
    score,
    strengthLabel,
    rules
  };
};
