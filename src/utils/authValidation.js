const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function validateEmail(value, label = 'Email') {
  if (!value?.trim()) {
    return `${label} is required.`;
  }
  if (!EMAIL_PATTERN.test(value.trim())) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }
  return '';
}

export function validatePassword(value) {
  if (!value) {
    return 'Password is required.';
  }
  if (!PASSWORD_PATTERN.test(value)) {
    return 'Password must be at least 8 characters and include at least one letter and one number.';
  }
  return '';
}

export function validateRequired(value, label) {
  if (!value?.toString().trim()) {
    return `${label} is required.`;
  }
  return '';
}

export function validatePhone(value) {
  const cleaned = value?.replace(/\s+/g, '');
  if (!cleaned) {
    return 'Phone number is required.';
  }
  if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
    return 'Enter a valid phone number.';
  }
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Confirm password is required.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
}
