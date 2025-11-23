export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    // Simulate email sending
    console.log(\Verification code for \: \\);
    
    // In production, integrate with SendGrid, AWS SES, or similar
    // Store code in localStorage temporarily (for demo)
    const codes = JSON.parse(localStorage.getItem('verification_codes') || '{}');
    codes[email] = { code, timestamp: Date.now(), attempts: 0 };
    localStorage.setItem('verification_codes', JSON.stringify(codes));
    
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

export const verifyCode = (email: string, code: string): boolean => {
  try {
    const codes = JSON.parse(localStorage.getItem('verification_codes') || '{}');
    const record = codes[email];
    
    if (!record) return false;
    if (record.code !== code) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= 3) {
        delete codes[email];
      }
      localStorage.setItem('verification_codes', JSON.stringify(codes));
      return false;
    }
    
    // Code is valid, delete it
    delete codes[email];
    localStorage.setItem('verification_codes', JSON.stringify(codes));
    return true;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};

export const generateVerificationCode = (): string => {
  return Math.random().toString().substring(2, 8);
};
