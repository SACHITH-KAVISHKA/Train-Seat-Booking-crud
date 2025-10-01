import { VALIDATION_PATTERNS } from './constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) return 'Invalid email format';
  return null;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const cleanPhone = phone.replace(/\D/g, '');
  if (!VALIDATION_PATTERNS.PHONE.test(cleanPhone)) return 'Phone must be 10 digits';
  return null;
};

/**
 * Validate passenger name
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must not exceed 50 characters';
  if (!VALIDATION_PATTERNS.NAME.test(name)) return 'Name can only contain letters and spaces';
  return null;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};

/**
 * Validate confirm password
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirm password
 * @returns {string|null} Error message or null if valid
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

/**
 * Validate age
 * @param {number} age - Age to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateAge = (age) => {
  if (!age) return 'Age is required';
  if (age < 1 || age > 120) return 'Age must be between 1 and 120';
  return null;
};

/**
 * Validate seat count
 * @param {number} count - Number of seats
 * @param {number} availableSeats - Available seats
 * @param {number} maxPassengers - Maximum passengers allowed
 * @returns {string|null} Error message or null if valid
 */
export const validateSeatCount = (count, availableSeats = 100, maxPassengers = 6) => {
  if (!count) return 'Number of seats is required';
  if (count < 1) return 'At least 1 seat is required';
  if (count > maxPassengers) return `Maximum ${maxPassengers} passengers allowed`;
  if (count > availableSeats) return `Only ${availableSeats} seats available`;
  return null;
};

/**
 * Validate PNR number
 * @param {string} pnr - PNR number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePNR = (pnr) => {
  if (!pnr) return 'PNR number is required';
  if (!VALIDATION_PATTERNS.PNR.test(pnr)) return 'PNR must be 10 characters (letters and numbers)';
  return null;
};

/**
 * Validate date
 * @param {string} date - Date to validate
 * @param {boolean} isFutureRequired - Whether date must be in future
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (date, isFutureRequired = true) => {
  if (!date) return 'Date is required';
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(selectedDate.getTime())) return 'Invalid date format';
  
  if (isFutureRequired && selectedDate < today) {
    return 'Date must be today or in the future';
  }
  
  // Check if date is more than 120 days in future
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 120);
  if (selectedDate > maxDate) {
    return 'Date cannot be more than 120 days in the future';
  }
  
  return null;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateLength = (value, minLength = 0, maxLength = 255, fieldName = 'Field') => {
  if (!value) return null; // Let required validation handle empty values
  
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateRange = (value, min, max, fieldName = 'Value') => {
  if (value === null || value === undefined) return null;
  
  const numValue = Number(value);
  if (isNaN(numValue)) return `${fieldName} must be a number`;
  
  if (numValue < min) return `${fieldName} must be at least ${min}`;
  if (numValue > max) return `${fieldName} must not exceed ${max}`;
  
  return null;
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {string|null} Error message or null if valid
 */
export const validateFile = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  if (!file) return 'File is required';
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `File size must be less than ${maxSizeMB}MB`;
  }
  
  return null;
};

/**
 * Validate credit card number (basic validation)
 * @param {string} cardNumber - Credit card number
 * @returns {string|null} Error message or null if valid
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return 'Credit card number is required';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Credit card number must be between 13 and 19 digits';
  }
  
  // Luhn algorithm for basic validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return 'Invalid credit card number';
  }
  
  return null;
};

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCVV = (cvv) => {
  if (!cvv) return 'CVV is required';
  
  const cleaned = cvv.replace(/\D/g, '');
  
  if (cleaned.length < 3 || cleaned.length > 4) {
    return 'CVV must be 3 or 4 digits';
  }
  
  return null;
};

/**
 * Validate expiry date (MM/YY format)
 * @param {string} expiry - Expiry date
 * @returns {string|null} Error message or null if valid
 */
export const validateExpiryDate = (expiry) => {
  if (!expiry) return 'Expiry date is required';
  
  const cleaned = expiry.replace(/\D/g, '');
  
  if (cleaned.length !== 4) {
    return 'Expiry date must be in MM/YY format';
  }
  
  const month = parseInt(cleaned.substr(0, 2), 10);
  const year = parseInt(cleaned.substr(2, 2), 10) + 2000;
  
  if (month < 1 || month > 12) {
    return 'Invalid month';
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

/**
 * Comprehensive form validation
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Check each rule for the field
    for (const rule of fieldRules) {
      let error = null;
      
      switch (rule.type) {
        case 'required':
          error = validateRequired(value, rule.message || `${field} is required`);
          break;
        case 'email':
          error = value ? validateEmail(value) : null;
          break;
        case 'phone':
          error = value ? validatePhone(value) : null;
          break;
        case 'name':
          error = value ? validateName(value) : null;
          break;
        case 'password':
          error = value ? validatePassword(value) : null;
          break;
        case 'length':
          error = validateLength(value, rule.min, rule.max, field);
          break;
        case 'range':
          error = validateRange(value, rule.min, rule.max, field);
          break;
        case 'custom':
          error = rule.validator(value, data);
          break;
        default:
          break;
      }
      
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return errors;
};