'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Basic',
    id: 'basic',
    href: '/auth/signup?plan=basic',
    priceMonthly: '$9',
    description: 'Perfect for individuals and small teams getting started with meeting notes.',
    features: [
      'Up to 10 meetings per month',
      'AI-powered transcription',
      'Basic summarization',
      'Export to PDF/Word',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'pro',
    href: '/auth/signup?plan=pro',
    priceMonthly: '$29',
    description: 'Ideal for growing teams that need more advanced features and integrations.',
    features: [
      'Unlimited meetings',
      'Advanced AI transcription',
      'Smart summarization',
      'Custom templates',
      'Calendar integration',
      'Priority support',
      'Team collaboration',
      'Analytics dashboard',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    href: '/auth/signup?plan=enterprise',
    priceMonthly: 'Custom',
    description: 'Dedicated support and infrastructure for your organization.',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'Advanced security',
      'API access',
      'SSO integration',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    featured: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  return (
    <div className="relative isolate bg-white py-24 sm:py-32">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-300 to-purple-300 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12"
        >
          {tiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * tierIdx }}
              className={classNames(
                tier.featured ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10',
                tier.featured ? 'bg-gray-900 ring-gray-900' : ''
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={classNames(
                      tier.featured ? 'text-white' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Most popular
                    </p>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={classNames(
                      tier.featured ? 'text-white' : 'text-gray-900',
                      'text-4xl font-bold tracking-tight'
                    )}
                  >
                    {tier.priceMonthly}
                  </span>
                  {tier.priceMonthly !== 'Custom' && (
                    <span
                      className={classNames(
                        tier.featured ? 'text-gray-300' : 'text-gray-600',
                        'text-sm font-semibold leading-6'
                      )}
                    >
                      /month
                    </span>
                  )}
                </p>
                <ul
                  role="list"
                  className={classNames(
                    tier.featured ? 'text-gray-300' : 'text-gray-600',
                    'mt-8 space-y-3 text-sm leading-6'
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={classNames(
                          tier.featured ? 'text-white' : 'text-indigo-600',
                          'h-6 w-5 flex-none'
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.href}
                className={classNames(
                  tier.featured
                    ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                  'mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                Get started
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 