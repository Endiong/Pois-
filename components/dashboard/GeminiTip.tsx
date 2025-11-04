
import React, { useState, useEffect } from 'react';
import { getPostureTip } from '../../services/geminiService';

const GeminiTip: React.FC = () => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTip = async () => {
    setIsLoading(true);
    const newTip = await getPostureTip();
    setTip(newTip);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-3 text-indigo-800">Gemini Pro Tip</h3>
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
        </div>
      ) : (
        <p className="text-indigo-700">{tip}</p>
      )}
      <button 
        onClick={fetchTip} 
        disabled={isLoading}
        className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Loading...' : 'Get a new tip'}
      </button>
    </div>
  );
};

export default GeminiTip;
