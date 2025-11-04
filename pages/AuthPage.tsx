import React, { useState } from 'react';
import { AuthMode } from '../App';
import { AuthLogoIcon, GoogleIcon, AppleIcon, EyeIcon, EyeOffIcon, CloseIcon, LoaderIcon } from '../components/icons/Icons';

interface AuthPageProps {
    mode: AuthMode;
    onLoginSuccess: () => void;
    onSwitchMode: (mode: AuthMode) => void;
    onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onLoginSuccess, onSwitchMode, onBack }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isLogin = mode === 'login';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isLogin) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                return;
            }
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log(`Simulating ${isLogin ? 'login' : 'signup'} for ${email}`);
            onLoginSuccess();
        }, 1500);
    };

    const handleGoogleLogin = () => {
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Simulating Google login...');
            onLoginSuccess();
        }, 1500);
    };


    return (
        <div className="flex-grow flex items-center justify-center bg-white">
            <button onClick={onBack} disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                <CloseIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full">
                {/* Left decorative panel */}
                <div className="hidden md:flex flex-col justify-center items-center bg-gray-50 p-8 rounded-l-2xl overflow-hidden"
                     style={{backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '1.5rem 1.5rem'}}>
                    <img 
                        src="https://images.unsplash.com/photo-1605813299425-474a05504343?q=80&w=1887&auto=format&fit=crop"
                        alt="Anatomical model of a human spine"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Right form panel */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-block">
                                <AuthLogoIcon />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mt-4">{isLogin ? "Welcome back!" : "Create an account"}</h1>
                            <p className="text-gray-500 mt-1">{isLogin ? "Enter your credentials to jump back in." : "Start your journey with us today."}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="example@mail.com" required
                                           value={email} onChange={(e) => setEmail(e.target.value)}
                                           className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input type={passwordVisible ? "text" : "password"} id="password" placeholder="••••••••" required
                                               value={password} onChange={(e) => setPassword(e.target.value)}
                                               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                                {!isLogin && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700" htmlFor="confirm-password">Confirm Password</label>
                                        <input type="password" id="confirm-password" placeholder="••••••••" required
                                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                                    </div>
                                )}
                                {isLogin && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input id="remember-me" name="remember-me" type="checkbox"
                                                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                        </div>
                                        <div className="text-sm">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                            
                            <button type="submit" disabled={isLoading}
                                    className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex justify-center items-center">
                                {isLoading ? <LoaderIcon className="w-5 h-5" /> : (isLogin ? "Sign In" : "Create Account")}
                            </button>
                        </form>
                        
                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300"/>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                             <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <GoogleIcon /> <span className="ml-2">Google</span>
                            </button>
                             <button disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <AppleIcon /> <span className="ml-2">Apple</span>
                            </button>
                        </div>
                        
                        <p className="mt-8 text-center text-sm text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={() => onSwitchMode(isLogin ? 'signup' : 'login')} disabled={isLoading}
                               className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 disabled:opacity-50">
                                {isLogin ? "Create an Account" : "Sign In"}
                            </button>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;