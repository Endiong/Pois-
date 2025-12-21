
import React, { useState } from 'react';
import { TargetIcon, CheckCircleIcon, ArrowRightIcon, ChevronRightIcon, TrophyIcon, ClockIcon, UserCheckIcon, SparklesIcon } from '../icons/Icons';

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
  onSetGoal: (goal: number) => void;
  onSetSessionGoal: (goal: number) => void;
  onSetFocusArea: (area: string) => void;
  currentGoal: number;
  currentSessionGoal: number;
  currentFocusArea: string;
}

const CustomSlider = ({ 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  colorClass 
}: { 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  onChange: (val: number) => void; 
  colorClass: string;
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative w-full h-12 flex items-center">
      <div className="absolute w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300 ease-out`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div 
        className="absolute h-8 w-8 bg-white dark:bg-gray-200 rounded-full shadow-lg border border-gray-100 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out"
        style={{ left: `calc(${percentage}% - 16px)` }}
      >
        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      </div>
    </div>
  );
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
    userName, onComplete, onSetGoal, onSetSessionGoal, onSetFocusArea, 
    currentGoal, currentSessionGoal, currentFocusArea 
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const steps = [
    // Step 1: Welcome (Redesigned)
    {
      title: `Welcome, ${userName}`,
      description: "Let's personalize your Poisé experience.",
      // Icon removed as requested
      icon: null, 
      content: (
        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm mx-auto">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Habit Formation</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
               We'll help you build muscle memory through consistent, gentle nudges over time.
             </p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Privacy First</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
               All posture analysis happens locally on your device. No video is ever uploaded.
             </p>
          </div>
        </div>
      )
    },
    // Step 2: Quality Goal (Green Theme)
    {
      title: "Posture Goal",
      description: "Set your target quality score for each session.",
      icon: <TargetIcon className="w-12 h-12 text-emerald-500" />,
      content: (
        <div className="w-full mt-10 max-w-sm mx-auto">
            <div className="text-center mb-10">
                <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{currentGoal}%</span>
            </div>
            
            <CustomSlider 
              min={30} 
              max={100} 
              step={5} 
              value={currentGoal} 
              onChange={onSetGoal}
              colorClass="bg-emerald-500"
            />
            
            <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                <span>Relaxed</span>
                <span>Strict</span>
            </div>
        </div>
      )
    },
    // Step 3: Session Goal (Purple Theme)
    {
      title: "Daily Sessions",
      description: "How many hours do you want to track daily?",
      icon: <ClockIcon className="w-12 h-12 text-purple-600" />,
      content: (
        <div className="w-full mt-10 max-w-sm mx-auto">
            <div className="text-center mb-10">
                <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{currentSessionGoal}</span>
                <span className="text-2xl font-medium text-gray-400 ml-2">hrs</span>
            </div>
            
            <CustomSlider 
              min={1} 
              max={12} 
              step={1} 
              value={currentSessionGoal} 
              onChange={onSetSessionGoal}
              colorClass="bg-purple-600"
            />

            <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                <span>Light</span>
                <span>Intense</span>
            </div>
        </div>
      )
    },
    // Step 4: Focus Area (Minimalist)
    {
      title: "Primary Focus",
      description: "Select the area you want to improve most.",
      icon: <UserCheckIcon className="w-12 h-12 text-gray-700 dark:text-gray-300" />,
      content: (
        <div className="grid grid-cols-1 gap-3 w-full max-w-xs mt-8 mx-auto">
            {['Neck & Head', 'Shoulders', 'Spine Neutral', 'Screen Distance'].map((area) => (
                <button
                    key={area}
                    onClick={() => onSetFocusArea(area)}
                    className={`p-4 rounded-xl text-sm font-semibold border-2 transition-all text-center ${
                        currentFocusArea === area 
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-black shadow-lg transform scale-105' 
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                    {area}
                </button>
            ))}
        </div>
      )
    },
    // Step 5: Camera Setup
    {
      title: "Camera Setup",
      description: "For best results, keep your camera at eye level.",
      icon: null, // Minimalist look
      content: (
        <div className="mt-8 w-full max-w-sm mx-auto space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 mb-6">
                <span className="text-gray-400 text-sm font-medium">Camera Preview Graphic</span>
            </div>
            {[
                "Ensure your head and shoulders are visible.",
                "Avoid strong backlighting.",
                "Sit comfortably upright."
            ].map((tip, idx) => (
                <div key={idx} className="flex items-center gap-4 text-left">
                    <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{tip}</span>
                </div>
            ))}
        </div>
      )
    },
    // Step 6: Completion
    {
      title: "All Set!",
      description: "You've unlocked your first badge.",
      icon: <SparklesIcon className="w-16 h-16 text-yellow-500 animate-pulse" />,
      content: (
        <div className="mt-10 flex flex-col items-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col items-center text-center relative z-10 transform transition-transform hover:scale-105">
                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-transparent rounded-full mb-4 text-yellow-600 dark:text-yellow-400 shadow-inner">
                        <TrophyIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Onboarding Explorer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Badge Unlocked</p>
                </div>
            </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl flex flex-col h-full max-h-[800px] relative">
        
        {/* Progress Dots */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 py-8 z-10">
            {steps.map((_, i) => (
                <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-black dark:bg-white' : 'w-1.5 bg-gray-300 dark:bg-gray-700'}`}
                />
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 overflow-y-auto no-scrollbar">
            <div className="animate-in fade-in zoom-in-95 duration-300 w-full flex flex-col items-center">
                {currentStepData.icon && (
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full inline-block">
                        {currentStepData.icon}
                    </div>
                )}
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {currentStepData.title}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-4">
                    {currentStepData.description}
                </p>
                
                {currentStepData.content}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between w-full max-w-lg mx-auto">
            <button 
                onClick={prevStep} 
                className={`text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-3 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                Back
            </button>

            {step < totalSteps ? (
                <button 
                    onClick={nextStep} 
                    className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl text-sm"
                >
                    Continue <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
                <button 
                    onClick={onComplete} 
                    className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl text-sm"
                >
                    Get Started <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
