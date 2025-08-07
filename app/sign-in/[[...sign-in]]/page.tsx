import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue building amazing resumes
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-blue-600 hover:bg-blue-700 text-sm font-medium',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldInput: 
                  'rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                footerActionLink: 
                  'text-blue-600 hover:text-blue-700 font-medium'
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  )
}
