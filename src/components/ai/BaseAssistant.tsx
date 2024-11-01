import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BaseAssistantProps {
  mode: 'builder' | 'learning';
  onUpdateCode?: (code: string) => void;
  currentCode?: string;
  systemPrompt: string;
  initialMessage: string;
}

export default function BaseAssistant({ 
  mode,
  onUpdateCode, 
  currentCode, 
  systemPrompt,
  initialMessage 
}: BaseAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: initialMessage
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat({ role: 'user', content: userMessage }),
          systemPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

      if (mode === 'builder' && onUpdateCode) {
        // Extract code blocks and update
        const codeBlocks = data.content.match(/```(?:liquid)?\n([\s\S]*?)```/g);
        if (codeBlocks) {
          const code = codeBlocks[0]
            .replace(/```(?:liquid)?\n/, '')
            .replace(/```$/, '')
            .trim();
          onUpdateCode(code);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E2E] text-white">
      <div className="p-4 border-b border-[#2A2A3C]">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-purple-400" />
          <h2 className="font-medium">Shopify {mode === 'builder' ? 'Builder' : 'Learning'} Assistant</h2>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-400 mt-1 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-lg p-3 ${
                message.role === 'assistant' 
                  ? 'bg-[#2A2A3C]' 
                  : 'bg-purple-500 bg-opacity-20'
              }`}
            >
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 size={24} className="animate-spin text-purple-400" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#2A2A3C]">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask AI to ${mode === 'builder' ? 'write' : 'learn about'} Liquid template code...`}
            className="flex-1 bg-[#2A2A3C] text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}