
import React, { useState } from 'react';
import { SparklesIcon, CameraIcon, TargetIcon, CheckCircleIcon, ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon } from '../icons/Icons';

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
  onSetGoal: (goal: number) => void;
  currentGoal: number;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ userName, onComplete, onSetGoal, currentGoal }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const steps = [
    {
      title: `Welcome to Poisé, ${userName}!`,
      description: "We're thrilled to help you on your journey to better posture and a pain-free life.",
      icon: <SparklesIcon className="w-12 h-12 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-300">
                <CheckBadgeIcon className="w-6 h-6"/>
             </div>
             <div>
                <p className="font-bold text-gray-900 dark:text-white">Build Healthy Habits</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Poisé uses AI to remind you to sit up straight, building lasting muscle memory.</p>
             </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
             <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-300">
                <LockClosedIcon className="w-6 h-6"/>
             </div>
             <div>
                <p className="font-bold text-gray-900 dark:text-white">Privacy First</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your camera feed is processed locally. We never store or upload your video.</p>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Your First Goal",
      description: "How much of your desk time do you want to spend in good posture?",
      icon: <TargetIcon className="w-12 h-12 text-blue-500" />,
      content: (
        <div className="space-y-6">
            <div className="text-center">
                <span className="text-5xl font-bold text-blue-600">{currentGoal}%</span>
            </div>
            <input 
                type="range"
                min="10"
                max="100"
                step="5"
                value={currentGoal}
                onChange={(e) => onSetGoal(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-400 text-center italic">Most beginners start with 70%.</p>
        </div>
      )
    },
    {
      title: "Prepare Your Space",
      description: "For the best tracking accuracy, follow these simple tips:",
      icon: <CameraIcon className="w-12 h-12 text-purple-500" />,
      content: (
        <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-600">1</div>
                Position your camera at eye level.
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                Ensure your upper body is visible.
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-600">3</div>
                Make sure the lighting is clear and steady.
            </li>
        </ul>
      )
    },
    {
      title: "Ready to start?",
      description: "You're all set! We'll start your first tracking session now. Sit comfortably and sit straight!",
      icon: <CheckCircleIcon className="w-12 h-12 text-green-500" />,
      content: (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 text-center">
            <p className="text-green-800 dark:text-green-300 font-semibold mb-2">You've earned your first badge!</p>
            <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-green-200 mb-4">
                <TrophyIcon className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">Onboarding Explorer</p>
        </div>
      )
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col min-h-[500px] animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex-1 p-8 md:p-12 flex flex-col items-center text-center">
            <div className="mb-6 transform hover:scale-110 transition-transform">
                {currentStepData.icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentStepData.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">{currentStepData.description}</p>
            <div className="w-full text-left">
                {currentStepData.content}
            </div>
        </div>

        <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-700/30 flex items-center justify-between">
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${step === i + 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`} />
                ))}
            </div>
            <div className="flex gap-4">
                {step > 1 && (
                    <button 
                        onClick={prevStep} 
                        className="p-3 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ChevronLeftIcon />
                    </button>
                )}
                {step < totalSteps ? (
                    <button 
                        onClick={nextStep} 
                        className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Next <ChevronRightIcon />
                    </button>
                ) : (
                    <button 
                        onClick={onComplete} 
                        className="px-8 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center gap-2 hover:opacity-90 transition-colors shadow-lg"
                    >
                        Let's Go! <ArrowRightIcon />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;

// Supporting icons/components needed within the onboarding modal
const CheckBadgeIcon = ({className = "w-6 h-6"}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;
const LockClosedIcon = ({className = "w-6 h-6"}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const TrophyIcon = ({className = "w-6 h-6"}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
