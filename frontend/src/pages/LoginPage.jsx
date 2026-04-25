import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-black font-black text-sm mx-auto mb-4 shadow-lg shadow-cyan-400/30">
          {'</>'}
        </div>
        <h1 className="text-2xl font-bold mb-6">
          <span className="text-white">Code</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
        </h1>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#161b22] border border-gray-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-[#0d1117] border-gray-700 text-white hover:bg-gray-800",
              formButtonPrimary: "bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90",
              formFieldInput: "bg-[#0d1117] border-gray-700 text-white",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
            }
          }}
          redirectUrl="/"
          signUpUrl="/signup"
        />
      </div>
    </div>
  )
}
