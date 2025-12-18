import React, { useState } from 'react';
import { UserCircleIcon, LockClosedIcon, CheckCircleIcon, UploadIcon, EnvelopeIcon } from '../icons/Icons';

interface UserProfile {
    name: string;
    avatar: string;
    email?: string;
}

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || 'margaret@example.com');
  const [avatar, setAvatar] = useState(profile.avatar);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, avatar, email });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Create a fake local URL for preview
          const url = URL.createObjectURL(file);
          setAvatar(url);
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences and profile.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
         {/* Profile Section */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <UserCircleIcon /> Profile
             </h3>
             
             <div className="flex flex-col sm:flex-row gap-8">
                 {/* Avatar Upload */}
                 <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                        <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-sm" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <UploadIcon className="w-6 h-6 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <span className="text-xs text-gray-500">Click to change</span>
                 </div>

                 {/* Inputs */}
                 <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            />
                            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                 </div>
             </div>
         </div>

         {/* Security */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <LockClosedIcon /> Security
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                 </div>
             </div>
         </div>

         <div className="flex justify-end gap-4">
             {isSaved && (
                 <span className="flex items-center gap-2 text-green-600 animate-in fade-in">
                     <CheckCircleIcon className="w-5 h-5" /> Saved Successfully
                 </span>
             )}
             <button 
                type="submit"
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full font-bold hover:opacity-80 transition-opacity shadow-lg"
             >
                Save Changes
             </button>
         </div>
      </form>
    </div>
  );
};

export default SettingsView;