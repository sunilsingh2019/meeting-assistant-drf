import Image from 'next/image';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUp() {
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
        {/* Left side - Sign up form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-sm w-full space-y-8">
            <div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sync your work calendar to start using Meeting Assistant
              </p>
            </div>

            <SignUpForm />

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
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
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between p-12 bg-gray-50">
          <div className="flex-1 flex items-center">
            <div className="max-w-md">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/testimonials/megan-huynh.jpg"
                    alt="Megan Huynh"
                    fill
                    className="rounded-full object-cover"
                    sizes="(max-width: 768px) 48px, 48px"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Megan Huynh</h3>
                  <p className="text-sm text-gray-600">Product Manager</p>
                </div>
              </div>
              <blockquote className="text-lg text-gray-600 italic">
                "Meeting Assistant has really boosted my confidence in my work because now I know that every user interview I conduct is stored somewhere for me always to look back to."
              </blockquote>
            </div>
          </div>

          {/* Featured logos */}
          <div className="mt-12">
            <p className="text-sm text-gray-600 mb-6">Featured on:</p>
            <div className="grid grid-cols-3 gap-8">
              <Image
                src="/images/logos/nyt-logo.svg"
                alt="New York Times"
                width={120}
                height={30}
                className="h-6 w-auto"
                sizes="120px"
              />
              <Image
                src="/images/logos/techcrunch-logo.svg"
                alt="TechCrunch"
                width={120}
                height={30}
                className="h-6 w-auto"
                sizes="120px"
              />
              <Image
                src="/images/logos/mashable-logo.svg"
                alt="Mashable"
                width={120}
                height={30}
                className="h-6 w-auto"
                sizes="120px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 