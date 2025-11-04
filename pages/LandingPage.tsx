
import React from 'react';
import { ArrowRightIcon, PlusIcon } from '../components/icons/Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {

  const testimonials = [
    {
      quote: "Poisé has played a pivotal role in improving my workday comfort. By providing stability and real-time feedback, it bridges the gap between sedentary work and physical wellbeing.",
      author: "Jane Doe, CEO",
      company: "Health Corp",
      logo: "https://picsum.photos/seed/healthcorp/40/40"
    },
    {
      quote: "A pioneer in digital wellness, setting high standards for accuracy, reliability, and user experience. Their achievements with Poisé have made the entire industry more attractive to users and institutions.",
      author: "John Smith, Co-Founder",
      company: "Wellness Inc",
      logo: "https://picsum.photos/seed/wellnessinc/40/40"
    },
    {
      quote: "We chose Poisé for its strong foundation in health science and its commitment to user privacy. The integration with our employee wellness program was seamless.",
      author: "Emily White, CTO",
      company: "Tech Solutions",
      logo: "https://picsum.photos/seed/techsolutions/40/40"
    }
  ];
  
  const faqs = [
    "What is Poisé?",
    "How are my camera feeds stored?",
    "Does using Poisé have risks?",
    "How does the scoring work?",
  ];

  return (
    <div className="bg-transparent">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 mb-4">
          The future of wellness is here. <a href="#" className="font-semibold text-gray-800">Learn more &rarr;</a>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Reclaim Your Posture. Elevate Your Life.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
          Poisé is your personal AI wellness coach, helping you build healthier habits for a pain-free future.
        </p>
        <div className="flex justify-center items-center gap-4">
          <button onClick={onGetStarted} className="bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors">
            Start Tracking for Free <ArrowRightIcon />
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm">$66.98 billion in productivity lost to back pain annually.</p>
      </section>

       {/* Testimonials Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by the best.</h2>
           <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Poisé is used by leading institutions and companies to improve employee wellness.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <p className="text-gray-700 flex-grow">"{testimonial.quote}"</p>
                <div className="mt-6 flex items-center">
                  <img src={testimonial.logo} alt={testimonial.company} className="w-10 h-10 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold mb-12">FAQs</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="flex justify-between items-center p-6 border border-gray-200 rounded-lg bg-white/80">
                        <p className="text-lg font-medium">{faq}</p>
                        <button className="text-gray-400 hover:text-gray-900">
                            <PlusIcon />
                        </button>
                    </div>
                ))}
            </div>
             <a href="#" className="text-lg text-gray-800 font-medium mt-8 inline-block hover:underline">See More &rarr;</a>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;