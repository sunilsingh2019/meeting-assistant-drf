import { TestimonialContent } from './TestimonialContent';

const testimonials = [
  {
    content: "Meeting Assistant has transformed how we handle meetings. The AI-powered transcription and summarization save us hours of work every week. It's like having a dedicated assistant in every meeting.",
    author: {
      name: 'Sarah Chen',
      role: 'Product Manager at TechFlow',
      image: '/images/testimonials/sarah-chen.jpg'
    }
  },
  {
    content: "The smart summarization feature is incredible. It captures all key points and action items perfectly. We've seen a 40% increase in meeting productivity since implementing Meeting Assistant.",
    author: {
      name: 'Michael Rodriguez',
      role: 'Engineering Lead at InnovateCo',
      image: '/images/testimonials/michael-rodriguez.jpg'
    }
  },
  {
    content: "What impressed me most was how quickly our team adapted to using Meeting Assistant. The interface is intuitive, and the AI features are powerful yet easy to use. It's become an essential tool for our remote team.",
    author: {
      name: 'Emily Thompson',
      role: 'Operations Director at GlobalTech',
      image: '/images/testimonials/emily-thompson.jpg'
    }
  }
];

export default function Testimonials() {
  return <TestimonialContent testimonials={testimonials} />;
} 