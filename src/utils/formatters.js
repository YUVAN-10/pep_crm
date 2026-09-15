/**
 * Currency and date formatting utilities for PEP CRM
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return '₹0';
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number);
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    ...options 
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};
