import { formatCurrency } from '../utils/helpers';

// Test the currency formatting
const testAmounts = [500, 1000, 2500, 15000, 100000];

console.log('Testing Sri Lankan Rupees formatting:');
testAmounts.forEach(amount => {
  console.log(`${amount} -> ${formatCurrency(amount)}`);
});

// Export for testing
export { testAmounts };