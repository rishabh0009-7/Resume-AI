export function validateEnvironmentVariables() {
  const requiredVars = [
    'DATABASE_URL',
    'GEMINI_API_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validate GEMINI_API_KEY format (should start with AIza)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !geminiKey.startsWith('AIza')) {
    throw new Error('GEMINI_API_KEY appears to be invalid. It should start with "AIza"');
  }

  // Validate CLERK keys format
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  if (clerkSecret && !clerkSecret.startsWith('sk_')) {
    throw new Error('CLERK_SECRET_KEY appears to be invalid. It should start with "sk_"');
  }

  const clerkPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (clerkPublishable && !clerkPublishable.startsWith('pk_')) {
    throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY appears to be invalid. It should start with "pk_"');
  }

  console.log('✅ All environment variables are valid');
}

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    geminiApiKey: process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing',
    clerkSecretKey: process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing',
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  };
} 