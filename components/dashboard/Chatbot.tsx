import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { SendIcon, LoaderIcon, SparklesIcon, PoiséIcon } from '../icons/Icons';
import { ai } from '../../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      const chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: 'You are "Poisé Ghost", a friendly, spectral wellness mascot. You keep a watchful eye on posture. You are supportive, witty, and use occasional ghost-related puns. Your advice is actionable and concise.'
        }
      });
      setChat(chatSession);
      setMessages([
        { role: 'model', text: "Boo! I'm Poisé Ghost. I'm here to help you stop slouching like a tired spirit. How's your back feeling today?" }
      ]);
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { role: 'model', text: "Spectral signal lost! Try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
        <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat with the Ghost</h1>
            <p className="text-gray-500 mt-1">Personalized posture advice from your spectral guardian.</p>
        </header>
        
        <div className="flex-grow bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'model' && (
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                                <PoiséIcon className="w-7 h-5" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${
                            message.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                        }`}>
                            <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white">
                            <PoiséIcon className="w-7 h-5" />
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                            <LoaderIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 pl-6 pr-14 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner dark:text-white transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 p-2.5 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 transition-all active:scale-95 shadow-lg"
                    >
                       <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;