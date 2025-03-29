'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Author {
  name: string;
  role: string;
  image: string;
}

interface Testimonial {
  content: string;
  author: Author;
}

interface TestimonialContentProps {
  testimonials: Testimonial[];
}

export function TestimonialContent({ testimonials }: TestimonialContentProps) {
  return (
    <div className="relative isolate bg-white py-24 sm:py-32">
      {/* Background pattern */}
      <div
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-indigo-300 to-purple-300"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Loved by teams everywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            See how Meeting Assistant is helping teams improve their meeting productivity and collaboration.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative rounded-3xl bg-white p-10 shadow-md ring-1 ring-gray-200"
            >
              <blockquote className="mt-6 text-gray-700">
                <p>{`"${testimonial.content}"`}</p>
              </blockquote>
              <div className="mt-8 flex items-center gap-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-50">
                  <Image
                    className="object-cover"
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    fill
                    sizes="(max-width: 768px) 48px, 48px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-gray-600">{testimonial.author.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 