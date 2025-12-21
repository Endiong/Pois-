
import React, { useState, useEffect } from 'react';
import { AuthMode } from '../App';
import { AuthLogoIcon, GoogleIcon, EyeIcon, EyeOffIcon, CloseIcon, LoaderIcon, CheckCircleIcon } from '../components/icons/Icons';

interface AuthPageProps {
    mode: AuthMode;
    onLoginSuccess: () => void;
    onSwitchMode: (mode: AuthMode) => void;
    onBack: () => void;
}

const GoogleAuthPopup: React.FC<{ onSuccess: () => void; onClose: () => void; }> = ({ onSuccess, onClose }) => {
    const [status, setStatus] = useState<'connecting' | 'success'>('connecting');

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStatus('success');
        }, 2000);

        const timer2 = setTimeout(() => {
            onSuccess();
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onSuccess]);

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                     <h2 className="text-lg font-semibold text-gray-700">Sign in with Google</h2>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <GoogleIcon />
                    <h3 className="text-xl font-medium text-gray-800 mt-4">Poisé</h3>
                    <p className="text-gray-500 mt-1">Authenticating your account</p>
                    
                    <div className="mt-8">
                        {status === 'connecting' ? (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <LoaderIcon className="w-6 h-6" />
                                <span>Connecting to Google...</span>
                            </div>
                        ) : (
                             <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircleIcon />
                                <span>Authentication successful!</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-8">
                        This is a simulated authentication window.
                    </p>
                </div>
            </div>
        </div>
    );
};

const AuthPage: React.FC<AuthPageProps> = ({ mode, onLoginSuccess, onSwitchMode, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGooglePopupOpen, setIsGooglePopupOpen] = useState(false);

    const handleGoogleLogin = () => {
        setIsGooglePopupOpen(true);
    };

    const handleGoogleLoginSuccess = () => {
        setIsGooglePopupOpen(false);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 500);
    };


    return (
        <div className="flex-grow flex items-center justify-center bg-white">
            <button onClick={onBack} disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                <CloseIcon />
            </button>
            {isGooglePopupOpen && (
                <GoogleAuthPopup 
                    onSuccess={handleGoogleLoginSuccess} 
                    onClose={() => setIsGooglePopupOpen(false)}
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full">
                {/* Left decorative panel - Geometric Illustration */}
                <div className="hidden md:flex flex-col justify-center items-center bg-indigo-50 p-8 rounded-l-2xl overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" width="100%" height="100%">
                            <defs>
                                <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" className="text-indigo-900 fill-current" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                        </svg>
                    </div>
                    
                    {/* Abstract Spine/Connection Illustration */}
                    <svg viewBox="0 0 300 400" className="w-64 h-auto text-indigo-600 drop-shadow-xl z-10" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Central Spine Line */}
                        <path d="M150 50 C150 50 200 100 200 150 S150 250 150 250 S100 300 100 350" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"/>
                        
                        {/* Nodes */}
                        <circle cx="150" cy="50" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="200" cy="150" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="150" cy="250" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="100" cy="350" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        
                        {/* Floating Geometric Decor */}
                        <rect x="50" y="80" width="40" height="40" rx="8" stroke="#F59E0B" strokeWidth="2" className="opacity-80 animate-bounce" style={{animationDuration: '3s'}}/>
                        <circle cx="250" cy="280" r="20" stroke="#10B981" strokeWidth="2" className="opacity-80 animate-pulse"/>
                        <path d="M50 300 L80 330 L50 360" stroke="#EC4899" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                {/* Right form panel */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-block">
                                <AuthLogoIcon />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mt-4">Get started with Poisé</h1>
                            <p className="text-gray-500 mt-1">Create an account or sign in to continue.</p>
                        </div>
                        
                        <div className="mt-6">
                             <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                <GoogleIcon /> <span className="ml-3">Continue with Google</span>
                            </button>
                        </div>
                        
                        <p className="mt-8 text-center text-xs text-gray-400">
                           By continuing, you agree to the Poisé <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
