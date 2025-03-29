import Image from 'next/image';
import Link from 'next/link';
import SignInForm from '@/components/auth/SignInForm';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Meeting Assistant"
            width={40}
            height={40}
            className="h-10 w-auto"
            sizes="40px"
          />
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Sign in form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-sm w-full space-y-8">
            <div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to continue to Meeting Assistant
              </p>
            </div>

            <SignInForm />

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              By using Meeting Assistant you agree to the{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Testimonial */}
        <div className="hidden lg:flex flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-purple-600">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
          </div>
          <div className="relative w-full h-full flex items-center justify-center p-20">
            <div className="max-w-lg">
              <blockquote className="mt-6">
                <div className="relative text-lg font-medium text-white md:flex-grow">
                  <svg
                    className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-white/40"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative text-xl text-white">
                    Meeting Assistant has transformed how we handle meetings. The AI-powered insights and automated scheduling have saved us countless hours.
                  </p>
                </div>
                <footer className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-12 w-12 rounded-full"
                        src="/images/testimonial-avatar.jpg"
                        alt="Testimonial avatar"
                        width={48}
                        height={48}
                        sizes="48px"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-white">Sarah Thompson</div>
                      <div className="text-sm text-indigo-200">Product Manager, TechCorp</div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 