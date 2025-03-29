'use client';

import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">What's new</span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Just shipped v1.0</span>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Meeting Assistant for Modern Teams
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform your meetings with AI-powered summaries, action items, and real-time collaboration. Save time, stay organized, and never miss important details.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started for free
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6 text-gray-900">
              Watch demo <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900">95%</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">Time saved in meeting documentation</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900">50K+</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">Active users</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900">24/7</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">AI-powered assistance</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative rounded-xl bg-white/5 shadow-2xl ring-1 ring-gray-400/10">
              <Image
                src="/landing-page-hero.png"
                alt="Meeting Assistant Dashboard"
                width={2432}
                height={1442}
                priority
                className="w-[76rem] rounded-xl shadow-xl ring-1 ring-gray-400/10"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 76rem"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>
    </div>
  );
};

export default Hero; 