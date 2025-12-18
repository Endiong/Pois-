
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightIcon, PlusIcon, MinusIcon, CameraIcon, SparklesIcon, ChartBarSquareIcon, CheckBadgeIcon } from '../components/icons/Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      quote: "Poisé has played a pivotal role in improving my workday comfort. By providing stability and real-time feedback, it bridges the gap between sedentary work and physical wellbeing.",
      author: "Jane Doe, CEO",
      company: "Health Corp",
      logo: "https://i.pravatar.cc/150?u=jane"
    },
    {
      quote: "A pioneer in digital wellness, setting high standards for accuracy, reliability, and user experience. Their achievements with Poisé have made the entire industry more attractive to users and institutions.",
      author: "John Smith, Co-Founder",
      company: "Wellness Inc",
      logo: "https://i.pravatar.cc/150?u=john"
    },
    {
      quote: "We chose Poisé for its strong foundation in health science and its commitment to user privacy. The integration with our employee wellness program was seamless.",
      author: "Emily White, CTO",
      company: "Tech Solutions",
      logo: "https://i.pravatar.cc/150?u=emily"
    },
     {
      quote: "The real-time alerts have been a game-changer. I'm more mindful of my posture throughout the day, and my neck pain has significantly decreased.",
      author: "Alex Ray, Developer",
      company: "Innovate LLC",
      logo: "https://i.pravatar.cc/150?u=alex"
    }
  ];
  
  const faqs = [
    {
      q: "What is Poisé?",
      a: "Poisé is your personal AI wellness coach, using your device's camera to provide real-time feedback on your posture. It helps you build healthier habits, reduce pain, and improve your overall wellbeing through intelligent analysis and personalized tips."
    },
    {
      q: "How are my camera feeds stored?",
      a: "Your privacy is our top priority. All posture analysis happens directly on your device. Your camera feed is never stored, recorded, or sent to the cloud. We only analyze the feed in real-time to provide feedback."
    },
    {
      q: "Does using Poisé have risks?",
      a: "Poisé is a wellness tool designed to help you become more aware of your posture. It is not a medical device and should not be used to diagnose or treat any medical conditions. Always consult with a healthcare professional for any health concerns."
    },
    {
      q: "How does the scoring work?",
      a: "Our AI model analyzes key points on your body (like your shoulders and ears) to determine your posture. Your score is based on the percentage of time you maintain good posture during an active session. The higher the score, the better your posture habits!"
    },
  ];

  const nextTestimonial = useCallback(() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length), [testimonials.length]);
  const prevTestimonial = () => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(() => {
        nextTestimonial();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
         <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(251, 146, 60, 0.2), transparent 40%),
              radial-gradient(circle at 90% 30%, rgba(59, 130, 246, 0.15), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(244, 114, 182, 0.2), transparent 50%)
            `,
            filter: 'blur(100px)',
          }}
        />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 mb-4">
            The future of wellness is here. <a href="#" className="font-semibold text-gray-800">Learn more &rarr;</a>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Reclaim Your Posture. <br className="hidden md:block"/> Elevate Your Life.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Poisé is your personal AI wellness coach, helping you build healthier habits for a pain-free future.
          </p>
          <div className="flex justify-center items-center gap-4">
            <button onClick={onGetStarted} className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl">
              Start Tracking for Free <ArrowRightIcon />
            </button>
          </div>
          <p className="text-gray-400 mt-6 text-sm flex items-center justify-center gap-2">
             <CheckBadgeIcon className="w-4 h-4 text-green-500"/> No credit card required. 100% Private.
          </p>
        </section>
      </div>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">How Poisé Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to better health and productivity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        <CameraIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">1. Connect Camera</h3>
                    <p className="text-gray-600 text-sm">Grant access to your camera. Our AI processes video locally—your feed never leaves your computer.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">2. AI Feedback</h3>
                    <p className="text-gray-600 text-sm">Get real-time alerts when you slouch or lean. Poisé learns your habits and suggests actionable tips.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <ChartBarSquareIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">3. Track Progress</h3>
                    <p className="text-gray-600 text-sm">Visualize your posture trends over time. Achieve daily goals and build lasting muscle memory.</p>
                </div>
            </div>
        </div>
      </section>


       {/* Testimonials Section */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by the best.</h2>
           <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Poisé is used by leading institutions and companies to improve employee wellness.</p>
          <div className="relative max-w-xl mx-auto">
            <div className="overflow-hidden relative h-64">
                {testimonials.map((testimonial, index) => (
                  <div key={index} 
                       className={`min-w-full flex-shrink-0 px-2 absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                  >
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                        <p className="text-gray-700 flex-grow text-lg italic">"{testimonial.quote}"</p>
                        <div className="mt-6 flex items-center">
                          <img src={testimonial.logo} alt={testimonial.company} className="w-12 h-12 rounded-full mr-4" />
                          <div>
                            <p className="font-semibold text-gray-900">{testimonial.author}</p>
                            <p className="text-gray-500">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
            </div>
            <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-2.5 h-2.5 rounded-full ${currentTestimonial === index ? 'bg-gray-800' : 'bg-gray-300'} transition-colors`}></button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-5xl font-bold mb-12 text-center">FAQs</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full flex justify-between items-center p-6 text-left"
                        >
                            <p className="text-lg font-medium">{faq.q}</p>
                            <span className={`text-gray-400 hover:text-gray-900 transition-transform duration-300 ${openFaq === index ? 'transform rotate-180' : ''}`}>
                               <PlusIcon />
                            </span>
                        </button>
                        <div 
                          className="grid transition-all duration-500 ease-in-out"
                          style={{ gridTemplateRows: openFaq === index ? '1fr' : '0fr' }}
                        >
                           <div className="overflow-hidden">
                               <div className="px-6 pb-6 text-gray-600">
                                 <p>{faq.a}</p>
                               </div>
                           </div>
                        </div>
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
