'use client';

import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import chatbotService from '@/services/chatbot';
import { ScrollableContainer } from '@/components/ui/scrollable-container';

interface Message {
  text: string;
  type: 'user' | 'bot' | 'detection';
  suggestions?: string[];
}

export interface ConversationHandle {
  handleSignDetection: (gesture: string, confidence: number) => void;
}

export const Conversation = forwardRef<ConversationHandle>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Send welcome message when component mounts
    const initChat = async () => {
      const response = await chatbotService.processMessage('welcome');
      setMessages([{ text: response.text, type: 'bot', suggestions: response.suggestions }]);
    };
    initChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useImperativeHandle(ref, () => ({
    handleSignDetection: (gesture: string, confidence: number) => {
      setMessages(prev => [...prev, {
        text: `Detected sign: ${gesture} (${(confidence * 100).toFixed(1)}% confidence)`,
        type: 'detection'
      }]);
    }
  }));

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, type: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Get chatbot response
    const response = await chatbotService.processMessage(inputText);
    setMessages(prev => [...prev, {
      text: response.text,
      type: 'bot',
      suggestions: response.suggestions
    }]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">SLAT Assistant</h3>
      </div>

      <div className="flex flex-col h-[400px]">
        <ScrollableContainer 
          maxHeight="332px" 
          padding="md" 
          fadeEdges
          className="flex-1 space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : message.type === 'detection'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'glass shadow-sm dark:glass-dark'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollableContainer>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about SLAT..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              className="rounded-full flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

Conversation.displayName = 'Conversation';

export default Conversation; 